import { BINAURAL_DEFAULTS, NOISE_DEFAULTS } from '@consts/defaults'
import type { BinauralLayer, NoiseLayer, SoundLayer } from '@consts/types'
import { BinauralGenerator } from '@scripts/binaural-generator'
import { NoiseGenerator } from '@scripts/noise-generator'
import { create } from 'zustand'

export interface SoundStore {
  layers: SoundLayer[]
  addNoiseLayer: () => NoiseLayer
  addBinauralLayer: () => BinauralLayer
  removeLayer: (id: string) => void
  playAll: () => void
  stopAll: () => void
  setVolume: (id: string, volume: number) => void
  setMute: (id: string, muted: boolean) => void
  setNoiseSlope: (id: string, slope: number) => void
  setNoisePan: (id: string, pan: number) => void
  setNoiseFilterFrequency: (id: string, frequency: number) => void
  toggleNoiseBreathe: (id: string, enabled: boolean) => void
}

export const useSoundStore = create<SoundStore>((set, get) => ({
  layers: [],

  setMute: (id, muted) => {
    set((state) => ({
      layers: state.layers.map((layer) => {
        if (layer.id === id) {
          return { ...layer, isMuted: muted }
        }
        return layer
      }),
    }))
  },

  setVolume: (id, volume) => {
    set((state) => ({
      layers: state.layers.map((layer) => {
        if (layer.id === id) {
          layer.engine.applyVolume(volume)
          return { ...layer, volume }
        }
        return layer
      }),
    }))
  },

  setNoiseSlope: (id, slope) => {
    set((state) => ({
      layers: state.layers.map((layer) => {
        if (layer.id !== id) return layer
        if (layer.type !== 'noise') return layer

        return { ...layer, slope }
      }),
    }))
  },

  setNoisePan: (id, pan) => {
    set((state) => ({
      layers: state.layers.map((layer) => {
        if (layer.id !== id) return layer
        if (layer.type === 'binaural') return layer
        layer.engine.applyPan(pan)
        return { ...layer, pan }
      }),
    }))
  },

  setNoiseFilterFrequency: (id, frequency) => {
    set((state) => ({
      layers: state.layers.map((layer) => {
        if (layer.id === id) {
          layer.engine.applyFilterFrequency(frequency)
          return { ...layer, filterFrequency: frequency }
        }
        return layer
      }),
    }))
  },

  toggleNoiseBreathe: (id, enabled) => {
    set((state) => ({
      layers: state.layers.map((layer) => {
        if (layer.id !== id) return layer
        if (layer.type !== 'noise') return layer

        layer.engine.applyBreathe(enabled)
        return { ...layer, isBreathing: enabled }
      }),
    }))
  },

  addNoiseLayer: () => {
    const layer: NoiseLayer = {
      id: crypto.randomUUID(),
      engine: new NoiseGenerator(),
      ...NOISE_DEFAULTS,
    }
    set((state) => ({ layers: [...state.layers, layer] }))
    return layer
  },

  addBinauralLayer: () => {
    const layer: BinauralLayer = {
      id: crypto.randomUUID(),
      engine: new BinauralGenerator(),
      ...BINAURAL_DEFAULTS,
    }
    set((state) => ({ layers: [...state.layers, layer] }))
    return layer
  },

  removeLayer: (id) => {
    const layer = get().layers.find((l) => l.id === id)
    layer?.engine.stop()
    set((state) => ({ layers: state.layers.filter((l) => l.id !== id) }))
  },

  playAll: () => {
    set((state) => ({
      layers: state.layers.map((layer) => {
        if (layer.isMuted) return layer

        switch (layer.type) {
          case 'binaural': {
            layer.engine.play(layer.carrierFrequency, layer.beatFrequency)
            return { ...layer, isPlaying: true }
          }
          case 'noise': {
            layer.engine.play(layer.slope)
            return { ...layer, isPlaying: true }
          }
        }
      }),
    }))
  },

  stopAll: () => {
    set((state) => ({
      layers: state.layers.map((layer) => {
        layer.engine.stop()
        return { ...layer, isPlaying: false }
      }),
    }))
  },
}))
