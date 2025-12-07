import type { BinauralGenerator } from '@scripts/binaural-generator'
import type { NoiseGenerator } from '@scripts/noise-generator'

export interface AudioEngine {
  stop(): void
  applyVolume(value: number): void
  play(...args: any[]): void
}

export interface BaseLayer {
  id: string
  engine: AudioEngine
  volume: number
  pan: number
  isPlaying: boolean
  isMuted: boolean
}

export interface NoiseLayer extends BaseLayer {
  type: 'noise'
  engine: NoiseGenerator
  slope: number
  filterFrequency: number
  isBreathing: boolean
}

export interface BinauralLayer extends BaseLayer {
  type: 'binaural'
  engine: BinauralGenerator
  carrierFrequency: number
  beatFrequency: number
  waveform: OscillatorType
}

export type SoundLayer = NoiseLayer | BinauralLayer
