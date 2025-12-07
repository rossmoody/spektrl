import { type NoiseLayer } from '@consts/types'
import { useSoundStore } from '@stores/noise-store'
import type { ChangeEvent } from 'react'

type HTMLInputChangeEvent = ChangeEvent<HTMLInputElement>

const {
  setVolume,
  setNoisePan: setPan,
  setNoiseSlope: setSlope,
  setNoiseFilterFrequency: setFilterFrequency,
  toggleNoiseBreathe: toggleBreathe,
  removeLayer,
  setMute,
} = useSoundStore.getState()

interface NoiseControllerProps {
  layer: NoiseLayer
  globalPlaying: boolean
}

export function NoiseController({
  layer,
  globalPlaying,
}: NoiseControllerProps) {
  const handleMuteChange = (event: HTMLInputChangeEvent) => {
    const isMuted = event.target.checked
    setMute(layer.id, isMuted)
    if (!isMuted && globalPlaying) {
      layer.engine.play(layer.slope)
    } else {
      layer.engine.stop()
    }
  }

  const handleColorChange = (event: HTMLInputChangeEvent) => {
    const slope = parseFloat(event.target.value)
    setSlope(layer.id, slope)
    if (globalPlaying && !layer.isMuted) {
      layer.engine.play(slope)
    }
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
      <p>Noise Layer</p>
      <div>
        <label>
          Color {layer.slope}
          <input
            type="range"
            min="-6"
            max="6"
            step="0.1"
            value={layer.slope}
            onChange={handleColorChange}
          />
        </label>
      </div>

      <div>
        <label>
          Filter Frequency {layer.filterFrequency}
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={layer.filterFrequency}
            onChange={handleFilterFrequencyChange}
          />
        </label>
      </div>

      <div>
        <label>
          Volume {layer.volume}
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

      <div>
        <label>
          Pan {layer.pan}
          <input
            type="range"
            min="-1"
            max="1"
            step="0.05"
            value={layer.pan}
            onChange={handlePanChange}
          />
        </label>
      </div>

      <div>
        <label>
          Breathe
          <input
            type="checkbox"
            checked={layer.isBreathing}
            onChange={handleBreatheChange}
          />
        </label>
      </div>

      <div>
        <label>
          Mute
          <input
            type="checkbox"
            checked={layer.isMuted}
            onChange={handleMuteChange}
          />
        </label>
      </div>

      <button onClick={handleRemoveLayer}>Remove Layer</button>
    </fieldset>
  )
}
