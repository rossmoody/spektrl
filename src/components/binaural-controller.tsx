import { type BinauralLayer } from '@consts/types'
import { useSoundStore } from '@stores/noise-store'
import type { ChangeEvent } from 'react'

type HTMLInputChangeEvent = ChangeEvent<HTMLInputElement>

const { setVolume, removeLayer, setMute } = useSoundStore.getState()

interface BinauralControllerProps {
  layer: BinauralLayer
  globalPlaying: boolean
}

export function BinauralController({
  layer,
  globalPlaying,
}: BinauralControllerProps) {
  const handleMuteChange = (event: HTMLInputChangeEvent) => {
    const isMuted = event.target.checked
    setMute(layer.id, isMuted)
    if (!isMuted && globalPlaying) {
      layer.engine.play(
        layer.carrierFrequency,
        layer.beatFrequency,
        layer.waveform,
      )
    } else {
      layer.engine.stop()
    }
  }

  const handleRemoveLayer = () => {
    removeLayer(layer.id)
  }

  const handleVolumeChange = (event: HTMLInputChangeEvent) => {
    const volume = parseFloat(event.target.value)
    setVolume(layer.id, volume)
  }

  return (
    <fieldset>
      <p>Binaural Layer</p>
      <div>
        <label>
          Volume
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={layer.volume}
            onChange={handleVolumeChange}
          />
        </label>
      </div>

      <label>
        Mute
        <input
          type="checkbox"
          checked={layer.isMuted}
          onChange={handleMuteChange}
        />
      </label>
      <button onClick={handleRemoveLayer}>Remove Layer</button>
    </fieldset>
  )
}
