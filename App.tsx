import { MotionConfig } from 'framer-motion'
import MentorCard from './components/MentorCard'
import { mentor } from './data/mentor'

export default function App() {
  return (
    // reducedMotion="user" disables transform animations when the OS asks for less motion
    <MotionConfig reducedMotion="user">
      <main className="flex min-h-screen items-center justify-center p-4">
        <MentorCard mentor={mentor} />
      </main>
    </MotionConfig>
  )
}
