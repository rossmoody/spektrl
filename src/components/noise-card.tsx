import { Noise } from '@/scripts/noise'
import { useState } from 'react'

type Props = {
  noise: Noise
  globalPlaying: boolean
}

export const NoiseCard = ({ noise, globalPlaying }: Props) => {
  const [active, setActive] = useState(noise.active)

  const toggleActive = () => {
    const next = !active
    noise.active = next
    if (next && globalPlaying) {
      noise.play()
    } else {
      noise.stop()
    }
    setActive(next)
  }
  return (
    <fieldset>
      <div>
        <label>
          Color
          <input
            type="range"
            min="-6"
            max="6"
            step="0.1"
            onChange={(e) => {
              noise.slope = parseFloat(e.target.value)
              if (noise.active && globalPlaying) noise.play()
            }}
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
              (noise.filterFrequency = parseFloat(e.target.value))
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
            onChange={(e) => (noise.volume = parseFloat(e.target.value))}
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
            onChange={(e) => (noise.pan = parseFloat(e.target.value))}
          />
        </label>
      </div>

      <div>
        <label>
          Breathe
          <input
            type="checkbox"
            onChange={(e) => noise.toggleBreathe(e.target.checked)}
          />
        </label>
      </div>

      <button onClick={toggleActive}>{noise.active ? '⏸️' : '▶️'}</button>
    </fieldset>
  )
}
