import TimeMachine from "@/components/time-machine"
import { GradientBackground } from "@/components/gradient-background"

export default function Page() {
  return (
    <main className="relative isolate w-full h-screen bg-black overflow-hidden">
      <GradientBackground />
      <div className="absolute inset-0 -z-10 bg-black/10" />

      <TimeMachine />

      <div className="pointer-events-none absolute inset-0 z-[2000] flex flex-col items-center justify-center gap-4 px-6 text-center mix-blend-difference">
        <h1 className="text-balance whitespace-nowrap font-serif text-5xl font-normal leading-tight tracking-tight text-white sm:text-7xl">
          What if? Why not?
        </h1>
        <p className="font-mono text-[11px] font-medium uppercase tracking-[0.15em] text-white sm:text-xs">
          @spectxo | Arin Chatterjee
        </p>
      </div>
    </main>
  )
}
