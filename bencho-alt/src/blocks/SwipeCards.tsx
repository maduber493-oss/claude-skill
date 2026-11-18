import { useDrag } from '@use-gesture/react'
import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import useSound from 'use-sound'

const START = ['Motion', 'Gestures', 'Sounds', 'Tailwind', 'React']

/** Swipe gesture: flick the top card left or right to dismiss it. */
export function SwipeCards() {
  const [cards, setCards] = useState(START)
  const [drag, setDrag] = useState({ x: 0, dir: 0 })
  const [playDrop] = useSound('/sounds/drop.wav')

  const bind = useDrag(({ down, movement: [mx], swipe: [sx], velocity: [vx] }) => {
    const dismiss = sx !== 0 || (!down && Math.abs(mx) > 120) || (!down && vx > 1.5)
    if (!down && dismiss) {
      setDrag({ x: 0, dir: sx || Math.sign(mx) })
      playDrop()
      setCards((c) => c.slice(1))
    } else {
      setDrag({ x: down ? mx : 0, dir: 0 })
    }
  }, { axis: 'x', filterTaps: true })

  return (
    <div className="relative h-44 w-64">
      <AnimatePresence custom={drag.dir}>
        {cards.slice(0, 3).reverse().map((c) => {
          const i = cards.indexOf(c)
          const top = i === 0
          return (
            <motion.div
              key={c}
              custom={drag.dir}
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1 - i * 0.05, y: i * 10, opacity: 1, x: top ? drag.x : 0, rotate: top ? drag.x / 15 : 0 }}
              exit={{ x: (drag.dir || 1) * 400, rotate: (drag.dir || 1) * 25, opacity: 0, transition: { duration: 0.3 } }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                            className={`absolute inset-0 grid cursor-grab place-items-center rounded-2xl border border-zinc-700 bg-zinc-900 text-2xl font-semibold shadow-xl active:cursor-grabbing ${top ? '' : 'pointer-events-none'}`}
            >
              {top ? <div {...bind()} style={{ touchAction: 'pan-y' }} className="absolute inset-0 grid place-items-center">{c}</div> : c}
            </motion.div>
          )
        })}
      </AnimatePresence>
      {cards.length === 0 && (
        <button onClick={() => setCards(START)} className="absolute inset-0 grid place-items-center rounded-2xl border border-dashed border-zinc-700 text-sm text-zinc-500 hover:text-zinc-300">
          Deck empty: tap to reset
        </button>
      )}
    </div>
  )
}
