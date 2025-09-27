import { useState, useEffect, useCallback } from "react"
import { cn } from "src/lib/utils"

interface Song {
  title: string
  artist: string
  difficulty: "normal" | "hard" | "insane" | "expert" | "extra"
  stars: number
}

interface SongCarouselProps {
  songs?: Song[]
  onSongSelect?: (song: Song, index: number) => void
  className?: string
}

const defaultSongs: Song[] = [
  { title: "Imperial Circus Dead Decadence", artist: "deetz", difficulty: "extra", stars: 6 },
  { title: "Minorsonek's Easy", artist: "ChuuritsuTv", difficulty: "normal", stars: 2 },
  { title: "Imperial Circus Dead Decadence (Intro ver.)", artist: "ChuuritsuTv", difficulty: "normal", stars: 2 },
  { title: "ウタカタストロフィ", artist: "HelloSCV", difficulty: "insane", stars: 5 },
  { title: "Uta ni Katachi wa nai keredo", artist: "Nymph_", difficulty: "expert", stars: 6 },
  { title: "Uta ni Katachi wa nai Keredo", artist: "JoJo", difficulty: "expert", stars: 5 },
  { title: "歌に形はないけれど", artist: "Natsu", difficulty: "hard", stars: 4 },
  { title: "Blue Zenith", artist: "xi", difficulty: "extra", stars: 7 },
  { title: "FREEDOM DiVE", artist: "xi", difficulty: "extra", stars: 8 },
  { title: "Galaxy Collapse", artist: "Kurokotei", difficulty: "insane", stars: 6 },
]

const albumArts = [
  "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)",
  "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
  "linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)",
  "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
  "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
  "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
  "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
  "linear-gradient(135deg, #30cfd0 0%, #91a7ff 100%)",
  "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
]

const difficultyColors = {
  normal: "from-teal-400 to-teal-600",
  hard: "from-yellow-300 to-orange-400",
  insane: "from-pink-400 to-pink-600",
  expert: "from-purple-400 to-purple-600",
  extra: "from-pink-500 to-pink-700",
}

function StarRating({ stars }: { stars: number }) {
  const fullStars = Math.floor(stars)
  const hasHalf = stars % 1 !== 0
  const emptyStars = 6 - Math.ceil(stars)

  return (
    <div className="flex gap-0.5">
      {Array.from({ length: fullStars }).map((_, i) => (
        <div
          key={`full-${i}`}
          className="w-3 h-3 bg-yellow-400"
          style={{
            clipPath: "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)",
          }}
        />
      ))}
      {hasHalf && (
        <div
          className="w-3 h-3"
          style={{
            background: "linear-gradient(90deg, #fbbf24 50%, #6b7280 50%)",
            clipPath: "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)",
          }}
        />
      )}
      {Array.from({ length: emptyStars }).map((_, i) => (
        <div
          key={`empty-${i}`}
          className="w-3 h-3 bg-gray-500"
          style={{
            clipPath: "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)",
          }}
        />
      ))}
    </div>
  )
}

function SongCard({
  song,
  index,
  position,
  onClick,
  isAnimating,
}: {
  song: Song
  index: number
  position: number
  onClick: () => void
  isAnimating: boolean
}) {
  const getCardStyles = () => {
    const baseClasses =
      "absolute right-0 h-20 rounded-l-lg flex items-center cursor-pointer overflow-hidden transition-all duration-500 ease-out transform-gpu"

    switch (position) {
      case 0: // Center card - fully expanded
        return cn(
          baseClasses,
          "w-[600px] z-50 translate-x-0 scale-100 opacity-100 shadow-2xl",
          isAnimating && "transition-all duration-500 ease-out",
        )
      case 1:
      case -1: // Adjacent cards
        return cn(
          baseClasses,
          "w-[550px] z-40 translate-x-8 scale-[0.97] opacity-95",
          isAnimating && "transition-all duration-450 ease-out",
        )
      case 2:
      case -2: // Second tier
        return cn(
          baseClasses,
          "w-[500px] z-30 translate-x-16 scale-[0.94] opacity-85",
          isAnimating && "transition-all duration-400 ease-out",
        )
      case 3:
      case -3: // Third tier
        return cn(
          baseClasses,
          "w-[450px] z-20 translate-x-24 scale-[0.91] opacity-75",
          isAnimating && "transition-all duration-350 ease-out",
        )
      case 4:
      case -4: // Fourth tier
        return cn(
          baseClasses,
          "w-[400px] z-10 translate-x-32 scale-[0.88] opacity-65",
          isAnimating && "transition-all duration-300 ease-out",
        )
      case 5:
      case -5: // Fifth tier
        return cn(
          baseClasses,
          "w-[350px] z-5 translate-x-40 scale-[0.85] opacity-55",
          isAnimating && "transition-all duration-250 ease-out",
        )
      default: // Hidden cards
        return cn(
          baseClasses,
          "w-[300px] z-0 translate-x-52 scale-75 opacity-0",
          isAnimating && "transition-all duration-200 ease-out",
        )
    }
  }

  return (
    <div
      className={cn(
        getCardStyles(),
        `bg-gradient-to-r ${difficultyColors[song.difficulty]}`,
        "hover:translate-x-[-20px] hover:scale-105 hover:shadow-3xl hover:z-[100]",
      )}
      onClick={onClick}
      style={{
        top: `${position * 82 + 250}px`,
        transformOrigin: "right center",
      }}
    >
      <div
        className="w-20 h-20 flex-shrink-0 bg-cover bg-center"
        style={{ background: albumArts[index % albumArts.length] }}
      />
      <div className="flex-1 px-5 py-3 min-w-0">
        <div className="text-white font-bold text-base mb-1 truncate">{song.title}</div>
        <div className="text-white/90 text-sm mb-1.5 truncate">{song.artist}</div>
        <StarRating stars={song.stars} />
      </div>
    </div>
  )
}

export default function SongCarousel({ songs = defaultSongs, onSongSelect, className }: SongCarouselProps) {
  const [selectedIndex, setSelectedIndex] = useState(2)
  const [isAnimating, setIsAnimating] = useState(false)
  const [lastScrollTime, setLastScrollTime] = useState(0)

  const moveSelection = useCallback(
    (direction: number) => {
      const newIndex = selectedIndex + direction
      if (newIndex >= 0 && newIndex < songs.length) {
        setIsAnimating(true)
        setSelectedIndex(newIndex)

        setTimeout(() => setIsAnimating(false), 500)

        if (onSongSelect) {
          onSongSelect(songs[newIndex], newIndex)
        }
      }
    },
    [selectedIndex, songs, onSongSelect],
  )

  const handleCardClick = useCallback(
    (index: number) => {
      if (index !== selectedIndex) {
        setIsAnimating(true)
        setSelectedIndex(index)

        setTimeout(() => setIsAnimating(false), 500)

        if (onSongSelect) {
          onSongSelect(songs[index], index)
        }
      }
    },
    [selectedIndex, songs, onSongSelect],
  )

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp") {
        e.preventDefault()
        moveSelection(-1)
      } else if (e.key === "ArrowDown") {
        e.preventDefault()
        moveSelection(1)
      }
    }

    const handleWheel = (e: WheelEvent) => {
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
          {songs.map((song, index) => {
            const relativePosition = index - selectedIndex

            if (Math.abs(relativePosition) > 5) return null

            return (
              <SongCard
                key={index}
                song={song}
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
