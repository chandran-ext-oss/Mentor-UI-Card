import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, X } from 'lucide-react'

interface Props {
  open: boolean
  mentorName: string
  onClose: () => void
}

export default function BookingModal({ open, mentorName, onClose }: Props) {
  const [confirmed, setConfirmed] = useState(false)
  const primaryRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  useEffect(() => {
    if (open) primaryRef.current?.focus()
  }, [open, confirmed])

  const handleExitComplete = () => setConfirmed(false)

  return (
    <AnimatePresence onExitComplete={handleExitComplete}>
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
            role="dialog"
            aria-modal="true"
            aria-labelledby="booking-title"
            className="relative w-full max-w-[360px] rounded-[20px] border-2 border-frame bg-white p-6 text-ink"
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
                  Your session with {mentorName} is booked. This is a demo, so no real booking was made.
                </p>
                <button
                  ref={primaryRef}
                  type="button"
                  onClick={onClose}
                  className="mt-2 h-10 w-full rounded-lg bg-coal text-sm font-bold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-coal"
                >
                  Done
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3 pt-2">
                <h2 id="booking-title" className="pr-10 text-2xl font-bold tracking-[-0.48px]">Confirm your session</h2>
                <p className="text-sm tracking-[0.28px] text-ink/70">
                  Book a session with {mentorName}? He is available as soon as possible.
                </p>
                <button
                  ref={primaryRef}
                  type="button"
                  onClick={() => setConfirmed(true)}
                  className="mt-2 h-10 w-full rounded-lg bg-coal text-sm font-bold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-coal"
                >
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
