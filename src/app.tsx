import { NoiseGenerator } from '@scripts/noise-generator'
import { useEffect, useRef, useState } from 'react'

export function App() {
  const [slope, setSlope] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const noiseRef = useRef<NoiseGenerator | null>(null)

  useEffect(() => {
    noiseRef.current = new NoiseGenerator()
    return () => noiseRef.current?.dispose()
  }, [])

  const toggle = () => {
    if (isPlaying) {
      noiseRef.current?.stop()
    } else {
      noiseRef.current?.play(slope)
    }
    setIsPlaying(!isPlaying)
  }

  const handleSlopeChange = (newSlope: number) => {
    setSlope(newSlope)
    if (isPlaying) {
      noiseRef.current?.play(newSlope)
    }
  }

  return (
    <div>
      <div>
        <label>
          Color: {slope}
          <input
            type="range"
            min="-6"
            max="6"
            step="0.1"
            value={slope}
            onChange={(e) => handleSlopeChange(parseFloat(e.target.value))}
          />
        </label>
      </div>

      <div>
        <label>
          Filter Frequency
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            defaultValue={1}
            onChange={(e) =>
              noiseRef.current?.setFilterFrequency(parseFloat(e.target.value))
            }
          />
        </label>
      </div>

      <div>
        <label>
          Volume
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            defaultValue={0.25}
            onChange={(e) =>
              noiseRef.current?.setVolume(parseFloat(e.target.value))
            }
          />
        </label>
      </div>

      <div>
        <label>
          Pan
          <input
            type="range"
            min="-1"
            max="1"
            step="0.01"
            defaultValue={0}
            onChange={(e) =>
              noiseRef.current?.setPan(parseFloat(e.target.value))
            }
          />
        </label>
      </div>

      <div>
        <label>
          Breathe
          <input
            type="checkbox"
            onChange={(e) => noiseRef.current?.toggleBreathe(e.target.checked)}
          />
        </label>
      </div>

      <button onClick={toggle}>{isPlaying ? 'Stop' : 'Play'}</button>
    </div>
  )
}
