import { motion, useMotionValue, useSpring } from 'motion/react'
import type { ReactNode } from 'react'
import useSound from 'use-sound'

/** Hover gesture: the button is pulled toward the cursor and pops on click. */
export function MagneticButton({ children, strength = 0.35 }: { children: ReactNode; strength?: number }) {
  const x = useSpring(useMotionValue(0), { stiffness: 250, damping: 15 })
  const y = useSpring(useMotionValue(0), { stiffness: 250, damping: 15 })
  const [playPop] = useSound('/sounds/pop.wav')
  const [playTick] = useSound('/sounds/tick.wav', { volume: 0.3 })

  return (
    <motion.button
      style={{ x, y }}
      onPointerEnter={() => playTick()}
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect()
        x.set((e.clientX - (r.left + r.width / 2)) * strength)
        y.set((e.clientY - (r.top + r.height / 2)) * strength)
      }}
      onPointerLeave={() => { x.set(0); y.set(0) }}
      whileTap={{ scale: 0.92 }}
      onClick={() => playPop()}
      className="rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 px-8 py-4 font-medium text-white shadow-lg shadow-fuchsia-500/20"
    >
      {children}
    </motion.button>
  )
}
