import { animate, motion, useMotionValue, useTransform } from 'motion/react'
import { useRef, useState } from 'react'
import useSound from 'use-sound'

const KNOB = 52

/** Slide gesture: drag the knob to the end to confirm. */
export function SlideToConfirm({ label = 'Slide to confirm', onConfirm }: { label?: string; onConfirm?: () => void }) {
  const track = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const [done, setDone] = useState(false)
  const [playTick] = useSound('/sounds/tick.wav', { volume: 0.6 })
  const [playSuccess] = useSound('/sounds/success.wav')
  const max = () => (track.current?.offsetWidth ?? 300) - KNOB - 8
  const textOpacity = useTransform(x, [0, 160], [1, 0])

  return (
    <div ref={track} className="relative h-[60px] w-80 select-none rounded-full bg-zinc-800 p-1">
      <motion.span style={{ opacity: textOpacity }} className="absolute inset-0 grid place-items-center text-sm text-zinc-400">
        {done ? '' : label}
      </motion.span>
      {done && <span className="absolute inset-0 grid place-items-center text-sm font-medium text-emerald-400">Confirmed</span>}
      <motion.div
        drag={done ? false : 'x'}
        dragConstraints={track}
        dragElastic={0}
        dragMomentum={false}
        style={{ x, width: KNOB, height: KNOB }}
        onDragStart={() => playTick()}
        onDragEnd={() => {
          if (x.get() > max() * 0.9) {
            animate(x, max(), { type: 'spring', stiffness: 500, damping: 35 })
            setDone(true); playSuccess(); onConfirm?.()
          } else {
            animate(x, 0, { type: 'spring', stiffness: 500, damping: 30 })
          }
        }}
        whileTap={{ scale: 0.95 }}
        className={`relative z-10 grid cursor-grab place-items-center rounded-full text-lg active:cursor-grabbing ${done ? 'bg-emerald-500' : 'bg-white text-zinc-900'}`}
      >
        {done ? '✓' : '→'}
      </motion.div>
      {done && (
        <button onClick={() => { setDone(false); animate(x, 0) }} className="absolute -bottom-7 left-1/2 -translate-x-1/2 text-xs text-zinc-500 hover:text-zinc-300">
          reset
        </button>
      )}
    </div>
  )
}
