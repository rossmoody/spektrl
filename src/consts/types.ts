import type { Noise } from '@scripts/noise'

export interface BaseLayer {
  id: string
  volume: number
  pan: number
  isPlaying: boolean
  isMuted: boolean
  type: 'noise' | 'binaural'
}

export interface NoiseLayer extends BaseLayer {
  type: 'noise'
  engine: Noise
  slope: number
  filterFrequency: number
  isBreathing: boolean
}

export interface BinauralLayer extends BaseLayer {
  type: 'binaural'
  //   engine: Binaural
  carrierFrequency: number
  beatFrequency: number
}

export type SoundLayer = NoiseLayer | BinauralLayer
