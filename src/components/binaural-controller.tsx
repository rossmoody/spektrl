import type { BinauralLayer } from '@generators/binaural-layer'
import { useSoundStore } from '@stores/sound-store'

const { updateLayer, removeLayer } = useSoundStore.getState()

interface BinauralControllerProps {
  layer: BinauralLayer
}

export function BinauralController({ layer }: BinauralControllerProps) {
  const id = layer.id

  return (
    <fieldset>
      <p>Binaural</p>

      <label>
        Volume {layer.volume}
        <input
          type="range"
          min={0}
          max={0.95}
          step={0.05}
          value={layer.volume}
          onChange={(e) =>
            updateLayer(id, 'binaural', { volume: parseFloat(e.target.value) })
          }
        />
      </label>

      <label>
        Carrier Frequency {layer.carrierFrequency} Hz
        <input
          type="range"
          min={100}
          max={500}
          step={10}
          value={layer.carrierFrequency}
          onChange={(e) =>
            updateLayer(id, 'binaural', {
              carrierFrequency: parseFloat(e.target.value),
            })
          }
        />
      </label>

      <label>
        Beat Frequency {layer.beatFrequency} Hz
        <input
          type="range"
          min={1}
          max={40}
          step={0.5}
          value={layer.beatFrequency}
          onChange={(e) =>
            updateLayer(id, 'binaural', {
              beatFrequency: parseFloat(e.target.value),
            })
          }
        />
      </label>

      <label>
        Waveform
        <select
          value={layer.waveform}
          onChange={(e) =>
            updateLayer(id, 'binaural', {
              waveform: e.target.value as OscillatorType,
            })
          }
        >
          <option value="sine">Sine</option>
          <option value="triangle">Triangle</option>
          <option value="square">Square</option>
          <option value="sawtooth">Sawtooth</option>
        </select>
      </label>

      <label>
        Mute
        <input
          type="checkbox"
          checked={layer.isMuted}
          onChange={(e) =>
            updateLayer(id, 'binaural', { isMuted: e.target.checked })
          }
        />
      </label>

      <button onClick={() => removeLayer(id)}>Remove</button>
    </fieldset>
  )
}
