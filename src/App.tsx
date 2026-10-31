import { useLayoutEffect, useRef, useState } from 'react'
import { MotionConfig } from 'framer-motion'
import MentorCard from './components/MentorCard'
import { mentor } from './data/mentor'

// Keeps the whole card visible on short screens (e.g. phones in landscape) by scaling it down.
function useFitScale() {
  const outer = useRef<HTMLElement>(null)
  const inner = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)

  useLayoutEffect(() => {
    const o = outer.current
    const i = inner.current
    if (!o || !i) return
    const calc = () => {
      const cs = getComputedStyle(o)
      const available = o.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom)
      setScale(i.offsetHeight ? Math.min(1, available / i.offsetHeight) : 1)
    }
    calc()
    const ro = new ResizeObserver(calc)
    ro.observe(o)
    ro.observe(i)
    window.addEventListener('orientationchange', calc)
    return () => {
      ro.disconnect()
      window.removeEventListener('orientationchange', calc)
    }
  }, [])

  return { outer, inner, scale }
}

export default function App() {
  const { outer, inner, scale } = useFitScale()
  return (
    // reducedMotion="user" disables transform animations when the OS asks for less motion
    <MotionConfig reducedMotion="user">
      <main
        ref={outer}
        className="flex h-dvh w-full items-center justify-center overflow-hidden px-4"
        style={{
          paddingTop: 'max(16px, env(safe-area-inset-top))',
          paddingBottom: 'max(16px, env(safe-area-inset-bottom))',
        }}
      >
        <div
          ref={inner}
          className="flex w-full justify-center"
          style={scale < 1 ? { transform: `scale(${scale})`, transformOrigin: 'center' } : undefined}
        >
          <MentorCard mentor={mentor} />
        </div>
      </main>
    </MotionConfig>
  )
}
