import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, ChevronLeft, ChevronRight, X } from 'lucide-react'

interface Props {
  open: boolean
  mentorName: string
  onClose: () => void
}

const TIMES: [number, number][] = [[9, 0], [10, 30], [12, 0], [14, 0], [15, 30], [17, 0]]
const fmtTime = ([h, m]: [number, number]) => `${h % 12 || 12}:${String(m).padStart(2, '0')} ${h < 12 ? 'AM' : 'PM'}`
const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate())
const monthStart = (d: Date) => new Date(d.getFullYear(), d.getMonth(), 1)

const primaryBtn =
  'mt-2 h-10 w-full rounded-lg bg-coal text-sm font-bold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-coal disabled:cursor-not-allowed disabled:opacity-40'

export default function BookingModal({ open, mentorName, onClose }: Props) {
  const today = useMemo(() => startOfDay(new Date()), [])
  const [view, setView] = useState(monthStart(today))
  const [date, setDate] = useState<Date | null>(null)
  const [slot, setSlot] = useState<number | null>(null)
  const [confirmed, setConfirmed] = useState(false)
  const dialogRef = useRef<HTMLDivElement>(null)
  const doneRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  useEffect(() => {
    if (!open) return
    if (confirmed) doneRef.current?.focus()
    else dialogRef.current?.querySelector<HTMLButtonElement>('button[data-day]:not(:disabled)')?.focus()
  }, [open, confirmed])

  const reset = () => {
    setConfirmed(false)
    setDate(null)
    setSlot(null)
    setView(monthStart(today))
  }

  const days = new Date(view.getFullYear(), view.getMonth() + 1, 0).getDate()
  const canGoPrev = view.getTime() > monthStart(today).getTime()
  const isPast = (i: number) => {
    if (!date) return false
    const t = new Date(date)
    t.setHours(TIMES[i][0], TIMES[i][1])
    return t <= new Date()
  }
  const when = date && slot !== null
    ? `${date.toLocaleDateString('en', { weekday: 'short', day: 'numeric', month: 'short' })} at ${fmtTime(TIMES[slot])}`
    : ''

  const nav = 'flex size-9 items-center justify-center rounded-lg text-ink transition-colors hover:bg-ink/5 disabled:opacity-30 disabled:hover:bg-transparent focus-visible:outline focus-visible:outline-2 focus-visible:outline-coal'

  return (
    <AnimatePresence onExitComplete={reset}>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
        >
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="booking-title"
            className="relative max-h-full w-full max-w-[380px] overflow-y-auto rounded-[20px] border-2 border-frame bg-white p-6 text-ink"
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              aria-label="Close"
              onClick={onClose}
              className="absolute right-3 top-3 flex size-10 items-center justify-center rounded-lg text-ink/70 transition-colors hover:bg-ink/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-coal"
            >
              <X aria-hidden className="size-5" />
            </button>

            {confirmed ? (
              <div className="flex flex-col items-center gap-3 pt-2 text-center" aria-live="polite">
                <span className="flex size-12 items-center justify-center rounded-full bg-[#d9ffe0] text-[#2aaf42]">
                  <Check aria-hidden className="size-6" />
                </span>
                <h2 id="booking-title" className="text-2xl font-bold tracking-[-0.48px]">Session booked</h2>
                <p className="text-sm tracking-[0.28px] text-ink/70">
                  Your session with {mentorName} is booked for {when}. This is a demo, so no real booking was made.
                </p>
                <button ref={doneRef} type="button" onClick={onClose} className={primaryBtn}>Done</button>
              </div>
            ) : (
              <div className="pt-2">
                <h2 id="booking-title" className="mb-3 pr-10 text-2xl font-bold tracking-[-0.48px]">Pick a date and time</h2>
                <div className="mb-2 flex items-center justify-between">
                  <button type="button" aria-label="Previous month" disabled={!canGoPrev} className={nav}
                    onClick={() => setView(new Date(view.getFullYear(), view.getMonth() - 1, 1))}>
                    <ChevronLeft aria-hidden className="size-[18px]" />
                  </button>
                  <span className="font-bold" aria-live="polite">
                    {view.toLocaleDateString('en', { month: 'long', year: 'numeric' })}
                  </span>
                  <button type="button" aria-label="Next month" className={nav}
                    onClick={() => setView(new Date(view.getFullYear(), view.getMonth() + 1, 1))}>
                    <ChevronRight aria-hidden className="size-[18px]" />
                  </button>
                </div>

                <div className="mb-4 grid grid-cols-7 gap-0.5 text-center">
                  {'SMTWTFS'.split('').map((c, i) => (
                    <span key={i} aria-hidden className="py-1 text-xs text-ink/50">{c}</span>
                  ))}
                  {Array.from({ length: view.getDay() }, (_, i) => <span key={`b${i}`} />)}
                  {Array.from({ length: days }, (_, i) => {
                    const d = new Date(view.getFullYear(), view.getMonth(), i + 1)
                    const selected = date?.getTime() === d.getTime()
                    const isToday = d.getTime() === today.getTime()
                    return (
                      <button
                        key={i}
                        type="button"
                        data-day
                        disabled={d < today}
                        aria-label={d.toDateString()}
                        aria-pressed={selected}
                        onClick={() => { setDate(d); setSlot(null) }}
                        className={`h-[38px] rounded-lg text-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-coal disabled:cursor-default disabled:text-ink/25 ${
                          selected ? 'bg-coal font-bold text-white' : 'hover:bg-ink/5 disabled:hover:bg-transparent'
                        } ${isToday && !selected ? 'ring-1 ring-inset ring-ink/40' : ''}`}
                      >
                        {i + 1}
                      </button>
                    )
                  })}
                </div>

                {date && (
                  <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
                    <p className="mb-2 text-sm text-ink/70">Available times</p>
                    <div className="mb-4 grid grid-cols-3 gap-2">
                      {TIMES.map((t, i) => (
                        <button
                          key={i}
                          type="button"
                          disabled={isPast(i)}
                          aria-pressed={slot === i}
                          onClick={() => setSlot(i)}
                          className={`h-9 rounded-lg border text-[13px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-coal disabled:opacity-35 ${
                            slot === i ? 'border-coal bg-coal text-white' : 'border-ink/25'
                          }`}
                        >
                          {fmtTime(t)}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                <button type="button" disabled={!date || slot === null} onClick={() => setConfirmed(true)} className={primaryBtn}>
                  Confirm booking
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
