// Binaural/BinauralLayer.ts
import { BinauralGenerator } from './binaural-generator'

export interface BinauralLayer {
  type: 'binaural'
  id: string
  engine: BinauralGenerator
  volume: number
  carrierFrequency: number
  beatFrequency: number
  waveform: OscillatorType
  isPlaying: boolean
  isMuted: boolean
}

export const BINAURAL_DEFAULTS = {
  type: 'binaural' as const,
  volume: 0.15,
  carrierFrequency: 200,
  beatFrequency: 10,
  waveform: 'sine' as OscillatorType,
  isPlaying: false,
  isMuted: false,
}

export function createBinauralLayer(): BinauralLayer {
  return {
    ...BINAURAL_DEFAULTS,
    id: crypto.randomUUID(),
    engine: new BinauralGenerator(),
  }
}

export function playBinauralLayer(layer: BinauralLayer) {
  layer.engine.play(layer.carrierFrequency, layer.beatFrequency, layer.waveform)
}

export function muteBinauralLayer(layer: BinauralLayer) {
  layer.engine.stop()
}

export function applyBinauralUpdates(
  layer: BinauralLayer,
  updates: Partial<BinauralLayer>,
) {
  if (updates.volume !== undefined) layer.engine.applyVolume(updates.volume)
  if (updates.carrierFrequency !== undefined) {
    layer.engine.applyCarrierFrequency(
      updates.carrierFrequency,
      layer.beatFrequency,
    )
  }
  if (updates.beatFrequency !== undefined) {
    layer.engine.applyBeatFrequency(
      layer.carrierFrequency,
      updates.beatFrequency,
    )
  }
  if (updates.waveform !== undefined)
    layer.engine.applyWaveform(updates.waveform)
}
