import { Noise } from '@/scripts/noise'

type NoiseProps = {
  noise: Noise
}

export const NoiseCard = ({ noise }: NoiseProps) => {
  return (
    <>
      <div>
        <label>
          Color
          <input
            type="range"
            min="-6"
            max="6"
            step="0.1"
            onChange={(e) => noise.play(parseFloat(e.target.value))}
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
              noise.setFilterFrequency(parseFloat(e.target.value))
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
            onChange={(e) => noise.setVolume(parseFloat(e.target.value))}
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
            onChange={(e) => noise.setPan(parseFloat(e.target.value))}
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
    </>
  )
}
