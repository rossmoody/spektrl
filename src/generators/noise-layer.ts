import { NoiseGenerator } from './noise-generator'

export interface NoiseLayer {
  type: 'noise'
  id: string
  engine: NoiseGenerator
  volume: number
  pan: number
  slope: number
  filterFrequency: number
  isPlaying: boolean
  isMuted: boolean
  isBreathing: boolean
}

export const NOISE_DEFAULTS = {
  type: 'noise' as const,
  volume: 0.25,
  pan: 0,
  slope: 0,
  filterFrequency: 1,
  isPlaying: false,
  isMuted: false,
  isBreathing: false,
}

export function createNoiseLayer(): NoiseLayer {
  return {
    ...NOISE_DEFAULTS,
    id: crypto.randomUUID(),
    engine: new NoiseGenerator(),
  }
}

export function playNoiseLayer(layer: NoiseLayer) {
  layer.engine.play(layer.slope)
}

export function muteNoiseLayer(layer: NoiseLayer) {
  layer.engine.stop()
}

export function applyNoiseUpdates(
  layer: NoiseLayer,
  updates: Partial<NoiseLayer>,
) {
  if (updates.volume !== undefined) {
    layer.engine.applyVolume(updates.volume)
  }
  if (updates.pan !== undefined) {
    layer.engine.applyPan(updates.pan)
  }
  if (updates.filterFrequency !== undefined) {
    layer.engine.applyFilterFrequency(updates.filterFrequency)
  }
  if (updates.isBreathing !== undefined) {
    layer.engine.applyBreathe(updates.isBreathing)
  }
  if (updates.slope !== undefined && layer.isPlaying) {
    layer.engine.play(updates.slope)
  }
  if (updates.isMuted !== undefined) {
    if (updates.isMuted) {
      layer.engine.stop()
    } else if (layer.isPlaying) {
      layer.engine.play(layer.slope)
    }
  }
}
