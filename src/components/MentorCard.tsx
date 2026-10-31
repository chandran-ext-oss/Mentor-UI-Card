import { useState } from 'react'
import { motion, type Variants } from 'framer-motion'
import { Briefcase, Calendar, Star, Zap } from 'lucide-react'
import type { Mentor } from '../types'
import BookingModal from './BookingModal'

const ease = [0.22, 1, 0.36, 1] as const

const cardVariants: Variants = {
  rest: { y: 0, boxShadow: '0 0 0 0 rgba(29,26,22,0)', transition: { duration: 0.3, ease } },
  hover: { y: -6, boxShadow: '0 18px 36px -14px rgba(29,26,22,0.25)', transition: { duration: 0.3, ease } },
}
const starPop: Variants = {
  idle: { scale: 1, rotate: 0 },
  pop: { scale: [1, 1.4, 1], rotate: [0, 20, 0], transition: { duration: 0.7, ease } },
}
const imageVariants: Variants = {
  rest: { scale: 1, transition: { duration: 0.5, ease } },
  hover: { scale: 1.14, transition: { duration: 0.5, ease } },
}

function Stat({ label, value, wide }: { label: string; value: string; wide?: boolean }) {
  return (
    <div className={`flex flex-col text-ink/70 ${wide ? 'w-auto' : 'w-16 min-[480px]:w-20'}`}>
      <span className="whitespace-nowrap text-xs leading-4 min-[480px]:text-sm min-[480px]:leading-5">{label}</span>
      <span className="text-sm font-bold leading-5 tracking-[0.28px] min-[480px]:text-lg min-[480px]:leading-6 min-[480px]:tracking-[0.36px]">
        {value}
      </span>
    </div>
  )
}

const SessionsIcon = () => (
  <svg aria-hidden viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1" className="size-3.5 shrink-0 text-ink min-[480px]:size-4">
    <path d="M3.2 6.4A6.4 6.4 0 0 1 9.6 0A6.4 6.4 0 0 1 16 6.4V12.8H9.6A6.4 6.4 0 0 1 3.2 6.4Z" />
    <path d="M0 11.2A4.8 4.8 0 0 1 4.8 6.4A4.8 4.8 0 0 1 9.6 11.2A4.8 4.8 0 0 1 4.8 16H0Z" />
  </svg>
)

const Divider = () => (
  <span aria-hidden className="h-10 border-l border-dotted border-ink/30 min-[480px]:h-12" />
)

export default function MentorCard({ mentor }: { mentor: Mentor }) {
  const [open, setOpen] = useState(false)
  const [photoFailed, setPhotoFailed] = useState(false)
  const meta = 'text-sm tracking-[0.28px] min-[480px]:text-lg min-[480px]:tracking-[0.36px] text-ink/70'

  return (
    <>
      <motion.div
        className="w-full max-w-[328px] min-[480px]:max-w-[440px]"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease }}
      >
        <motion.article
          aria-label={`${mentor.name}, mentor profile`}
          variants={cardVariants}
          initial="rest"
          animate="rest"
          whileHover="hover"
          whileTap="hover"
          className="flex flex-col gap-3 rounded-[20px] border-2 border-solid border-frame bg-white p-3 min-[480px]:gap-5 min-[480px]:rounded-[32px] min-[480px]:p-5"
        >
          {/* Photo */}
          <div className="relative h-[172px] overflow-hidden rounded-xl bg-gradient-to-br from-[#2b2622] to-[#0f0d0b] min-[480px]:h-[296px] min-[480px]:rounded-[20px]">
            {photoFailed ? (
              <motion.svg
                aria-hidden
                viewBox="0 0 400 300"
                preserveAspectRatio="xMidYMid slice"
                variants={imageVariants}
                className="absolute inset-0 h-full w-full"
              >
                <defs>
                  <linearGradient id="ph" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stopColor="#e9b98a" />
                    <stop offset="1" stopColor="#b9694a" />
                  </linearGradient>
                </defs>
                <rect width="400" height="300" fill="url(#ph)" />
                <circle cx="320" cy="60" r="95" fill="#fff" opacity=".14" />
                <circle cx="70" cy="250" r="60" fill="#fff" opacity=".1" />
                <path d="M70 300c0-62 54-96 130-96s130 34 130 96z" fill="#2b2622" />
                <circle cx="200" cy="132" r="52" fill="#3a332d" />
              </motion.svg>
            ) : (
              <motion.img
                src={mentor.photo}
                alt={`Portrait of ${mentor.name}`}
                variants={imageVariants}
                onError={() => setPhotoFailed(true)}
                className="absolute inset-0 h-full w-full object-cover"
              />
            )}
            <div className="absolute inset-x-3 inset-y-3 flex flex-col items-start justify-between min-[480px]:inset-x-5 min-[480px]:inset-y-5">
              {mentor.tags.topRated ? (
                <span className="flex h-6 items-center rounded bg-white px-3 text-[10px] leading-4 text-ink/80 min-[480px]:h-auto min-[480px]:rounded-md min-[480px]:py-2 min-[480px]:text-xs">
                  Top Rated
                </span>
              ) : <span />}
              {mentor.tags.availableNow && (
                <span className="flex h-6 items-center gap-1 rounded bg-[#d9ffe0] px-3 text-[10px] font-bold leading-4 text-[#2aaf42] min-[480px]:h-auto min-[480px]:gap-2 min-[480px]:rounded-md min-[480px]:py-2 min-[480px]:text-xs">
                  <Zap aria-hidden className="size-3 fill-current min-[480px]:size-4" strokeWidth={1.5} />
                  Available ASAP
                </span>
              )}
            </div>
          </div>

          {/* Details */}
          <div className="flex flex-col gap-3 min-[480px]:gap-4">
            <div className="flex flex-col gap-2 min-[480px]:gap-3">
              <h2 className="text-2xl font-bold capitalize leading-8 tracking-[-0.48px] text-ink min-[480px]:text-[28px] min-[480px]:leading-9 min-[480px]:tracking-[-0.56px]">
                {mentor.name}
              </h2>
              <p className={`flex items-center gap-3 ${meta}`}>
                <Briefcase aria-hidden className="size-3 shrink-0 text-ink min-[480px]:size-4" strokeWidth={1.5} />
                <span className="truncate leading-6">
                  {mentor.role} @ {mentor.company}
                  <span className="hidden min-[480px]:inline">, {mentor.location}</span>
                </span>
              </p>
              <p className={`flex items-center gap-3 leading-6 ${meta}`}>
                <span className="flex items-center gap-3">
                  <SessionsIcon />
                  {mentor.sessions} Sessions
                </span>
                <motion.button
                  type="button"
                  aria-label={`Rating ${mentor.rating} out of 5`}
                  initial="idle"
                  animate="idle"
                  whileHover="pop"
                  whileTap="pop"
                  className="-m-1.5 flex cursor-pointer items-center gap-1.5 rounded-md p-1.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-coal"
                >
                  (
                  <motion.span variants={starPop} className="inline-flex">
                    <motion.span
                      className="inline-flex"
                      initial={{ scale: 0, rotate: -90 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: 'spring', stiffness: 260, damping: 14, delay: 0.5 }}
                    >
                      <Star aria-hidden className="size-4 fill-[#f5b82e] text-[#f5b82e]" strokeWidth={1.5} />
                    </motion.span>
                  </motion.span>
                  <span>{mentor.rating} Rating)</span>
                </motion.button>
              </p>
            </div>

            <div className="flex items-center justify-between rounded-lg bg-ink/5 p-3">
              <Stat label="Experience" value={mentor.experience} />
              <Divider />
              <Stat label="Fluent in" value={mentor.language} />
              <Divider />
              <Stat label="Avg Attendance" value={mentor.attendance} wide />
            </div>

            <hr className="m-0 border-0 border-t border-ink/40" />

            <motion.button
              type="button"
              onClick={() => setOpen(true)}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.2 }}
              className="flex h-10 items-center justify-center gap-2 rounded-lg bg-coal text-sm font-bold tracking-[0.28px] text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-coal min-[480px]:h-12 min-[480px]:gap-3 min-[480px]:text-lg min-[480px]:tracking-[0.36px]"
            >
              <Calendar aria-hidden className="size-3 min-[480px]:size-4" strokeWidth={1.5} />
              Book a Session
            </motion.button>
          </div>
        </motion.article>
      </motion.div>

      <BookingModal open={open} mentorName={mentor.name} onClose={() => setOpen(false)} />
    </>
  )
}
