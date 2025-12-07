import { BinauralGenerator } from './binaural-generator'

export interface BinauralLayer {
  type: 'binaural'
  id: string
  engine: BinauralGenerator
  volume: number
  carrierFrequency: number
  beatFrequency: number
  waveform: OscillatorType
  isMuted: boolean
}

export const BINAURAL_DEFAULTS: Omit<BinauralLayer, 'id' | 'engine'> = {
  type: 'binaural' as const,
  volume: 0.15,
  carrierFrequency: 200,
  beatFrequency: 10,
  waveform: 'sine' as OscillatorType,
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
  if (updates.volume !== undefined) {
    layer.engine.applyVolume(updates.volume)
  }
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
  if (updates.waveform !== undefined) {
    layer.engine.applyWaveform(updates.waveform)
  }

  if (updates.isMuted !== undefined) {
    if (updates.isMuted) {
      layer.engine.stop()
    } else {
      layer.engine.play(
        layer.carrierFrequency,
        layer.beatFrequency,
        layer.waveform,
      )
    }
    layer.isMuted = updates.isMuted
  }
}
