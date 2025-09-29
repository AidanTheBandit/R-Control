"use client"

import { useState, useEffect, useCallback } from "react"
import { cn } from "@/lib/utils"
import ColorThief from 'colorthief'

const defaultItems = [
  { title: "Apps Management", subtitle: "Manage your applications", image: "https://via.placeholder.com/80x80/FF6B6B/FFFFFF?text=Apps" },
  { title: "Device Info", subtitle: "View device information", image: "https://via.placeholder.com/80x80/4ECDC4/FFFFFF?text=Device" },
  { title: "File Sharing", subtitle: "Share files with device", image: "https://via.placeholder.com/80x80/45B7D1/FFFFFF?text=Files" },
  { title: "Media Controls", subtitle: "Control media playback", image: "https://via.placeholder.com/80x80/F7DC6F/FFFFFF?text=Media" },
  { title: "Console Panel", subtitle: "Access console commands", image: "https://via.placeholder.com/80x80/BB8FCE/FFFFFF?text=Console" },
  { title: "Logs Panel", subtitle: "View system logs", image: "https://via.placeholder.com/80x80/85C1E9/FFFFFF?text=Logs" },
  { title: "Settings", subtitle: "Configure application", image: "https://via.placeholder.com/80x80/F8C471/FFFFFF?text=Settings" },
]

function ItemCard({
  item,
  index,
  position,
  onClick,
  isAnimating,
}) {
  const [gradient, setGradient] = useState("linear-gradient(135deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 100%)")

  useEffect(() => {
    if (item.image) {
      const img = new Image()
      img.crossOrigin = 'Anonymous'
      img.onload = () => {
        const colorThief = new ColorThief()
        const palette = colorThief.getPalette(img, 2)
        if (palette && palette.length >= 2) {
          const color1 = `rgb(${palette[0].join(',')})`
          const color2 = `rgb(${palette[1].join(',')})`
          setGradient(`linear-gradient(135deg, ${color1} 0%, ${color2} 100%)`)
        }
      }
      img.src = item.image
    }
  }, [item.image])

  const getCardStyles = () => {
    const baseClasses =
      "absolute right-0 h-20 rounded-l-lg flex items-center cursor-pointer overflow-hidden transition-transform duration-500 ease-out transform-gpu"

    switch (position) {
      case 0: // Center card - fully expanded
        return cn(
          baseClasses,
          "w-[600px] z-50 translate-x-0 scale-100 opacity-100 shadow-2xl",
        )
      case 1:
      case -1: // Adjacent cards
        return cn(
          baseClasses,
          "w-[550px] z-40 translate-x-8 scale-[0.97] opacity-95",
        )
      case 2:
      case -2: // Second tier
        return cn(
          baseClasses,
          "w-[500px] z-30 translate-x-16 scale-[0.94] opacity-85",
        )
      case 3:
      case -3: // Third tier
        return cn(
          baseClasses,
          "w-[450px] z-20 translate-x-24 scale-[0.91] opacity-75",
        )
      case 4:
      case -4: // Fourth tier
        return cn(
          baseClasses,
          "w-[400px] z-10 translate-x-32 scale-[0.88] opacity-65",
        )
      case 5:
      case -5: // Fifth tier
        return cn(
          baseClasses,
          "w-[350px] z-5 translate-x-40 scale-[0.85] opacity-55",
        )
      default: // Hidden cards
        return cn(
          baseClasses,
          "w-[300px] z-0 translate-x-52 scale-75 opacity-0",
        )
    }
  }

  return (
    <div
      className={cn(
        getCardStyles(),
        "hover:translate-x-[-20px] hover:scale-105 hover:shadow-3xl hover:z-[100]",
      )}
      onClick={onClick}
      style={{
        position: 'absolute',
        right: 0,
        transform: `translateY(${position * 82 + 250}px)`,
        transformOrigin: "right center",
        backgroundImage: `${gradient}, url(${item.image || item.icon || 'https://via.placeholder.com/80x80/333/FFF'})`,
        backgroundSize: 'cover, cover',
        backgroundPosition: 'center, center',
        backgroundRepeat: 'no-repeat, no-repeat',
      }}
    >
      <div className="w-20 h-20 flex-shrink-0 bg-cover bg-center rounded-l-lg" style={{ backgroundImage: `url(${item.image || item.icon || 'https://via.placeholder.com/80x80/333/FFF'})` }} />
      <div className="flex-1 px-5 py-3 min-w-0">
        <div className="text-white font-bold text-base mb-1 truncate">{item.title}</div>
        {item.subtitle && <div className="text-white/90 text-sm truncate">{item.subtitle}</div>}
      </div>
    </div>
  )
}

export default function Carousel({ items = defaultItems, onItemSelect, className }) {
  const [selectedIndex, setSelectedIndex] = useState(2)
  const [isAnimating, setIsAnimating] = useState(false)
  const [lastScrollTime, setLastScrollTime] = useState(0)

  const moveSelection = useCallback(
    (direction) => {
      const newIndex = selectedIndex + direction
      if (newIndex >= 0 && newIndex < items.length) {
        setIsAnimating(true)
        setSelectedIndex(newIndex)

        setTimeout(() => setIsAnimating(false), 500)

        // Removed onItemSelect call here, only on click
      }
    },
    [selectedIndex, items],
  )

  const handleCardClick = useCallback(
    (index) => {
      if (index !== selectedIndex) {
        setIsAnimating(true)
        setSelectedIndex(index)

        setTimeout(() => setIsAnimating(false), 500)

        if (onItemSelect) {
          onItemSelect(items[index], index)
        }
      }
    },
    [selectedIndex, items, onItemSelect],
  )

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowUp") {
        e.preventDefault()
        moveSelection(-1)
      } else if (e.key === "ArrowDown") {
        e.preventDefault()
        moveSelection(1)
      }
    }

    const handleWheel = (e) => {
      e.preventDefault()
      const now = Date.now()
      if (now - lastScrollTime < 300) return

      setLastScrollTime(now)

      if (e.deltaY > 0) {
        moveSelection(1)
      } else {
        moveSelection(-1)
      }
    }

    // Attach to document for global control
    document.addEventListener("keydown", handleKeyDown)
    document.addEventListener("wheel", handleWheel, { passive: false })

    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      document.removeEventListener("wheel", handleWheel)
    }
  }, [moveSelection, lastScrollTime])

  return (
    <div className={cn("relative w-full h-full", className)}>
      <div className="absolute right-0 top-1/2 -translate-y-1/2 h-full flex flex-col justify-center items-end perspective-1000">
        <div className="relative h-[500px] w-[650px]">
          {items.map((item, index) => {
            const relativePosition = index - selectedIndex

            if (Math.abs(relativePosition) > 5) return null

            return (
              <ItemCard
                key={index}
                item={item}
                index={index}
                position={relativePosition}
                onClick={() => handleCardClick(index)}
                isAnimating={isAnimating}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}