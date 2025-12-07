import { type BinauralLayer } from '@consts/types'
import { useSoundStore } from '@stores/noise-store'
import type { ChangeEvent } from 'react'

type HTMLInputChangeEvent = ChangeEvent<HTMLInputElement>

const {
  setVolume,
  removeLayer,
  setMute,
  setCarrierFrequency,
  setBeatFrequency,
  setWaveform,
} = useSoundStore.getState()

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

  const resetSound = () => {
    const currentLayer = useSoundStore
      .getState()
      .layers.find((l) => l.id === layer.id)
    if (
      !currentLayer ||
      currentLayer.type !== 'binaural' ||
      currentLayer.isMuted ||
      !globalPlaying
    )
      return

    currentLayer.engine.play(
      currentLayer.carrierFrequency,
      currentLayer.beatFrequency,
      currentLayer.waveform,
    )
  }

  const handleRemoveLayer = () => {
    removeLayer(layer.id)
  }

  const handleVolumeChange = (event: HTMLInputChangeEvent) => {
    const volume = parseFloat(event.target.value)
    setVolume(layer.id, volume)
  }

  const handleCarrierFrequencyChange = (event: HTMLInputChangeEvent) => {
    const carrierFrequency = parseFloat(event.target.value)
    setCarrierFrequency(layer.id, carrierFrequency)
    resetSound()
  }

  const handleBeatFrequencyChange = (event: HTMLInputChangeEvent) => {
    const beatFrequency = parseFloat(event.target.value)
    setBeatFrequency(layer.id, beatFrequency)
    resetSound()
  }

  const handleWaveformChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const waveform = event.target.value as BinauralLayer['waveform']
    setWaveform(layer.id, waveform)
    resetSound()
  }

  return (
    <fieldset>
      <p>Binaural Layer</p>
      <div>
        <label>
          Volume {layer.volume}
          <input
            type="range"
            min="0"
            max=".95"
            step="0.05"
            value={layer.volume}
            onChange={handleVolumeChange}
          />
        </label>
      </div>
      <div>
        <label>
          Carrier Frequency (Hz) {layer.carrierFrequency}
          <input
            type="range"
            min="1"
            max="500"
            value={layer.carrierFrequency}
            onChange={handleCarrierFrequencyChange}
          />
        </label>
      </div>
      <div>
        <label>
          Beat Frequency (Hz) {layer.beatFrequency}
          <input
            type="range"
            min="0.1"
            max="40"
            step="0.1"
            value={layer.beatFrequency}
            onChange={handleBeatFrequencyChange}
          />
        </label>
      </div>
      <div>
        <label>
          Waveform
          <select value={layer.waveform} onChange={handleWaveformChange}>
            <option value="sine">Sine</option>
            <option value="square">Square</option>
            <option value="sawtooth">Sawtooth</option>
            <option value="triangle">Triangle</option>
          </select>
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
