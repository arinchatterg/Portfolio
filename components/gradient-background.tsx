"use client"

import { GrainGradient } from "@paper-design/shaders-react"

export function GradientBackground() {
  return (
    <div className="absolute inset-0 -z-10">
      <GrainGradient
        style={{ height: "100%", width: "100%" }}
        colorBack="hsl(0, 0%, 4%)"
        softness={0.55}
        intensity={0.7}
        noise={0.05}
        shape="corners"
        offsetX={0}
        offsetY={0}
        scale={1.4}
        rotation={0}
        speed={1}
        colors={["hsl(0, 90%, 42%)", "hsl(12, 95%, 55%)", "hsl(350, 100%, 25%)"]}
      />
    </div>
  )
}
