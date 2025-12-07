import type { BinauralLayer, NoiseLayer } from './types'

export const NOISE_DEFAULTS: Omit<NoiseLayer, 'id' | 'engine'> = {
  type: 'noise',
  volume: 0.25,
  pan: 0,
  slope: 0,
  filterFrequency: 1,
  isPlaying: true,
  isMuted: false,
  isBreathing: false,
} as const

export const BINAURAL_DEFAULTS: Omit<BinauralLayer, 'id' | 'engine'> = {
  type: 'binaural',
  volume: 0.15,
  pan: 0,
  isPlaying: true,
  isMuted: false,
  carrierFrequency: 200,
  beatFrequency: 10,
  waveform: 'sine' as OscillatorType,
} as const
