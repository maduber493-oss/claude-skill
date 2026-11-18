import type { ReactNode } from 'react'
import { MagneticButton } from './blocks/MagneticButton'
import { SlideToConfirm } from './blocks/SlideToConfirm'
import { SwipeCards } from './blocks/SwipeCards'

function Bench({ gesture, title, children }: { gesture: string; title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-6 rounded-3xl border border-zinc-800 bg-zinc-900/40 p-6">
      <header>
        <p className="text-xs uppercase tracking-widest text-zinc-500">{gesture}</p>
        <h2 className="text-lg font-medium">{title}</h2>
      </header>
      <div className="grid min-h-56 place-items-center">{children}</div>
    </section>
  )
}

export default function App() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="text-3xl font-semibold">Bench</h1>
      <p className="mt-2 text-zinc-400">Interactive blocks with motion, gestures and sound. Turn your volume on.</p>
      <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Bench gesture="Slide" title="Slide to confirm"><SlideToConfirm /></Bench>
        <Bench gesture="Hover" title="Magnetic button"><MagneticButton>Hover me</MagneticButton></Bench>
        <Bench gesture="Swipe" title="Swipe cards"><SwipeCards /></Bench>
      </div>
    </main>
  )
}
