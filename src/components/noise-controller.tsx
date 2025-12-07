import type { NoiseLayer } from '@generators/noise-layer'
import { useSoundStore } from '@stores/sound-store'

const { updateLayer, removeLayer } = useSoundStore.getState()

interface Props {
  layer: NoiseLayer
}

export function NoiseController({ layer }: Props) {
  const id = layer.id

  return (
    <fieldset>
      <p>Noise</p>

      <label>
        Volume
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={layer.volume}
          onChange={(e) => {
            updateLayer(id, 'noise', { volume: parseFloat(e.target.value) })
          }}
        />
      </label>

      <label>
        Color
        <input
          type="range"
          min={-6}
          max={6}
          step={0.1}
          value={layer.slope}
          onChange={(e) =>
            updateLayer(id, 'noise', { slope: parseFloat(e.target.value) })
          }
        />
      </label>

      <label>
        Pan
        <input
          type="range"
          min={-1}
          max={1}
          step={0.01}
          value={layer.pan}
          onChange={(e) =>
            updateLayer(id, 'noise', { pan: parseFloat(e.target.value) })
          }
        />
      </label>

      <label>
        Filter
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={layer.filterFrequency}
          onChange={(e) =>
            updateLayer(id, 'noise', {
              filterFrequency: parseFloat(e.target.value),
            })
          }
        />
      </label>

      <label>
        Breathe
        <input
          type="checkbox"
          checked={layer.isBreathing}
          onChange={(e) =>
            updateLayer(id, 'noise', { isBreathing: e.target.checked })
          }
        />
      </label>

      <label>
        Mute
        <input
          type="checkbox"
          checked={layer.isMuted}
          onChange={(e) =>
            updateLayer(id, 'noise', { isMuted: e.target.checked })
          }
        />
      </label>

      <button onClick={() => removeLayer(id)}>Remove</button>
    </fieldset>
  )
}
