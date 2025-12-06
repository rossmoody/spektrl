import { useNoiseStore, type NoiseLayer } from '@stores/noise-store'
import type { ChangeEvent } from 'react'

type HTMLInputChangeEvent = ChangeEvent<HTMLInputElement>

const {
  setVolume,
  setPan,
  setSlope,
  setFilterFrequency,
  toggleBreathe,
  removeLayer,
  setMute,
} = useNoiseStore.getState()

interface NoiseLayerProps {
  layer: NoiseLayer
  globalPlaying: boolean
}

export function NoiseLayer({ layer, globalPlaying }: NoiseLayerProps) {
  const handleMuteChange = (event: HTMLInputChangeEvent) => {
    const isMuted = event.target.checked
    setMute(layer.id, isMuted)
    if (!isMuted && globalPlaying) {
      layer.noise.play()
    } else {
      layer.noise.stop()
    }
  }

  const handleColorChange = (event: HTMLInputChangeEvent) => {
    const slope = parseFloat(event.target.value)
    setSlope(layer.id, slope)
  }

  const handleRemoveLayer = () => {
    removeLayer(layer.id)
  }

  const handleVolumeChange = (event: HTMLInputChangeEvent) => {
    const volume = parseFloat(event.target.value)
    setVolume(layer.id, volume)
  }

  const handlePanChange = (event: HTMLInputChangeEvent) => {
    const pan = parseFloat(event.target.value)
    setPan(layer.id, pan)
  }

  const handleFilterFrequencyChange = (event: HTMLInputChangeEvent) => {
    const frequency = parseFloat(event.target.value)
    setFilterFrequency(layer.id, frequency)
  }

  const handleBreatheChange = (event: HTMLInputChangeEvent) => {
    const enabled = event.target.checked
    toggleBreathe(layer.id, enabled)
  }

  return (
    <fieldset>
      <div>
        <label>
          Color: {layer.slope}
          <input
            type="range"
            min="-6"
            max="6"
            step="0.1"
            onChange={handleColorChange}
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
            onChange={handleFilterFrequencyChange}
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
            onChange={handleVolumeChange}
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
            onChange={handlePanChange}
          />
        </label>
      </div>

      <div>
        <label>
          Breathe
          <input type="checkbox" onChange={handleBreatheChange} />
        </label>
      </div>

      <label>
        Mute
        <input type="checkbox" onChange={handleMuteChange} />
      </label>
      <button onClick={handleRemoveLayer}>Remove Layer</button>
    </fieldset>
  )
}
