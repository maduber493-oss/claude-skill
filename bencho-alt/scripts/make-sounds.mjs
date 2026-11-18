// Generates small UI sound effects as 16-bit mono WAV files (no external assets needed).
import { writeFileSync } from 'node:fs'
const RATE = 44100
function wav(samples) {
  const buf = Buffer.alloc(44 + samples.length * 2)
  buf.write('RIFF', 0); buf.writeUInt32LE(36 + samples.length * 2, 4); buf.write('WAVE', 8)
  buf.write('fmt ', 12); buf.writeUInt32LE(16, 16); buf.writeUInt16LE(1, 20); buf.writeUInt16LE(1, 22)
  buf.writeUInt32LE(RATE, 24); buf.writeUInt32LE(RATE * 2, 28); buf.writeUInt16LE(2, 32); buf.writeUInt16LE(16, 34)
  buf.write('data', 36); buf.writeUInt32LE(samples.length * 2, 40)
  samples.forEach((s, i) => buf.writeInt16LE(Math.max(-1, Math.min(1, s)) * 32767, 44 + i * 2))
  return buf
}
function tone(dur, freq, { decay = 30, vol = 0.5, sweep = 0 } = {}) {
  const n = Math.floor(RATE * dur), out = new Array(n); let ph = 0
  for (let i = 0; i < n; i++) {
    const t = i / RATE; ph += 2 * Math.PI * (freq + sweep * t) / RATE
    out[i] = Math.sin(ph) * Math.exp(-decay * t) * vol * Math.min(1, i / 40)
  }
  return out
}
const seq = (...parts) => parts.flat()
writeFileSync('public/sounds/tick.wav', wav(tone(0.04, 1800, { decay: 120, vol: 0.35 })))
writeFileSync('public/sounds/pop.wav', wav(tone(0.12, 520, { decay: 35, sweep: 2400 })))
writeFileSync('public/sounds/success.wav', wav(seq(tone(0.09, 660, { decay: 25 }), tone(0.22, 990, { decay: 14 }))))
writeFileSync('public/sounds/drop.wav', wav(tone(0.18, 420, { decay: 22, sweep: -900 })))
console.log('sounds written')
