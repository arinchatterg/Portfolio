"use client"

import React from "react"
import { motion } from "framer-motion"
import { useShortcuts, clamp } from "@/hooks/use-shortcut"

const IMAGES = [
  "https://res.cloudinary.com/a82shxs4/image/upload/v1787158599/IMG_20260815_121826.jpg",
  "https://res.cloudinary.com/a82shxs4/image/upload/v1787158609/IMG_20260602_103550.jpg",
  "https://res.cloudinary.com/a82shxs4/image/upload/v1787158564/IMG-20251101-WA0019.jpg",
  "https://res.cloudinary.com/a82shxs4/image/upload/v1787158572/1000067467.jpg",
  "https://res.cloudinary.com/a82shxs4/image/upload/v1787158583/IMG_20260603_113143.jpg",
  "https://res.cloudinary.com/a82shxs4/image/upload/v1787158593/IMG_20260601_134513.jpg",
  "https://res.cloudinary.com/a82shxs4/image/upload/v1787158599/IMG_20260815_121826.jpg",
]

const FRAME_OFFSET = -30
const FRAMES_VISIBLE_LENGTH = 3
const SCROLL_THRESHOLD = 40
const BUFFER_SIZE = 8 // Render 8 cards before and after visible range (increased for fast scrolling)

export default function TimeMachine({
  shouldImplementPreloading = false,
}: {
  shouldImplementPreloading?: boolean
}) {
  // Use continuous index that can go infinite in both directions
  const [currentIndex, setCurrentIndex] = React.useState(0)
  const containerRef = React.useRef<HTMLDivElement>(null)
  const scrollAccumulator = React.useRef(0)
  const lastUpdateTime = React.useRef(Date.now())
  const touchStartY = React.useRef(0)

  // Calculate which cards should be rendered (visible + buffer)
  const getVisibleCards = React.useCallback(() => {
    const start = currentIndex - BUFFER_SIZE
    const end = currentIndex + FRAMES_VISIBLE_LENGTH + BUFFER_SIZE
    const cards = []

    for (let i = start; i <= end; i++) {
      cards.push({
        index: i,
        imageIndex: ((i % IMAGES.length) + IMAGES.length) % IMAGES.length, // Positive modulo
      })
    }

    return cards
  }, [currentIndex])

  React.useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const MIN_UPDATE_INTERVAL = 75 // Minimum 75ms between index changes (max ~13 changes per second)

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault()
      scrollAccumulator.current += e.deltaY

      const now = Date.now()
      const timeSinceLastUpdate = now - lastUpdateTime.current

      if (Math.abs(scrollAccumulator.current) >= SCROLL_THRESHOLD) {
        // Only update if enough time has passed since last update
        if (timeSinceLastUpdate >= MIN_UPDATE_INTERVAL) {
          const delta = scrollAccumulator.current > 0 ? 1 : -1
          setCurrentIndex((prev) => prev + delta)
          scrollAccumulator.current = 0
          lastUpdateTime.current = now
        }
      }
    }

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY
    }

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault()
      const touchY = e.touches[0].clientY
      const deltaY = touchStartY.current - touchY
      touchStartY.current = touchY

      scrollAccumulator.current += deltaY

      const now = Date.now()
      const timeSinceLastUpdate = now - lastUpdateTime.current

      if (Math.abs(scrollAccumulator.current) >= SCROLL_THRESHOLD) {
        if (timeSinceLastUpdate >= MIN_UPDATE_INTERVAL) {
          const delta = scrollAccumulator.current > 0 ? 1 : -1
          setCurrentIndex((prev) => prev + delta)
          scrollAccumulator.current = 0
          lastUpdateTime.current = now
        }
      }
    }

    container.addEventListener("wheel", handleWheel, { passive: false })
    container.addEventListener("touchstart", handleTouchStart, {
      passive: false,
    })
    container.addEventListener("touchmove", handleTouchMove, {
      passive: false,
    })

    return () => {
      container.removeEventListener("wheel", handleWheel)
      container.removeEventListener("touchstart", handleTouchStart)
      container.removeEventListener("touchmove", handleTouchMove)
    }
  }, [])

  useShortcuts({
    ArrowRight: () => {
      setCurrentIndex((prev) => prev + 1)
    },
    ArrowLeft: () => {
      setCurrentIndex((prev) => prev - 1)
    },
  })

  const visibleCards = getVisibleCards()

  return (
    <div ref={containerRef} className="relative w-full h-full flex items-center justify-center overflow-hidden">
      <div className="relative w-full h-full flex items-center justify-center">
        {visibleCards.map((card) => {
          const offsetIndex = card.index - currentIndex
          const blur = currentIndex > card.index ? 2 : 0
          const opacity = currentIndex > card.index ? 0 : 1
          const scale = clamp(1 - offsetIndex * 0.08, [0.08, 2])
          const y = clamp(offsetIndex * FRAME_OFFSET, [FRAME_OFFSET * FRAMES_VISIBLE_LENGTH, Number.POSITIVE_INFINITY])

          const src = IMAGES[card.imageIndex]
          const image = <img alt="" src={src || "/placeholder.svg"} className="object-cover w-full h-full" />

          return (
            <motion.div
              key={card.index}
              className="absolute w-[85%] max-w-[800px] aspect-[16/9] bg-black rounded-lg overflow-hidden shadow-2xl"
              initial={false}
              animate={{
                y,
                scale,
                transition: {
                  type: "spring",
                  stiffness: 250,
                  damping: 20,
                  mass: 0.5,
                },
              }}
              style={{
                willChange: "opacity, filter, transform",
                filter: `blur(${blur}px)`,
                opacity,
                transitionProperty: "opacity, filter",
                transitionDuration: "200ms",
                transitionTimingFunction: "ease-in-out",
                zIndex: 1000 - card.index,
              }}
            >
              {shouldImplementPreloading ? <>{offsetIndex < FRAMES_VISIBLE_LENGTH ? image : null}</> : image}
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
