import { NoiseGenerator } from '@scripts/noise-generator'
import { useEffect, useRef, useState } from 'react'

export function App() {
  const [slope, setSlope] = useState(0)
  const [filterFrequency, setFilterFrequency] = useState(1)
  const [volume, setVolume] = useState(0.25)
  const [pan, setPan] = useState(0)
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

  const handleFilterFrequencyChange = (newFrequency: number) => {
    setFilterFrequency(newFrequency)
    noiseRef.current?.addLowPassFilter(newFrequency)
  }

  const handlePanChange = (newPan: number) => {
    setPan(newPan)
    noiseRef.current?.setPan(newPan)
  }

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume)
    noiseRef.current?.setVolume(newVolume)
  }

  return (
    <div>
      <div>
        <label>
          Color
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
            value={filterFrequency}
            onChange={(e) =>
              handleFilterFrequencyChange(parseFloat(e.target.value))
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
            value={volume}
            onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
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
            value={pan}
            onChange={(e) => handlePanChange(parseFloat(e.target.value))}
          />
        </label>
      </div>

      <button onClick={toggle}>{isPlaying ? 'Stop' : 'Play'}</button>
    </div>
  )
}
