import { Noise } from '@/scripts/noise'

type Props = {
  noise: Noise
}

export const NoiseCard = ({ noise }: Props) => {
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
            onChange={(e) => {
              const slope = parseFloat(e.target.value)
              noise.slope = slope
              if (noise.isPlaying) {
                noise.play()
              }
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
    </div>
  )
}
