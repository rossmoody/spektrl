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
  setSlope: (id: string, slope: number) => void
  setPan: (id: string, pan: number) => void
  setFilterFrequency: (id: string, frequency: number) => void
  toggleBreathe: (id: string, enabled: boolean) => void
  setMute: (id: string, muted: boolean) => void
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

  setSlope: (id, slope) => {
    set((state) => ({
      layers: state.layers.map((layer) => {
        if (layer.id !== id) return layer
        if (layer.type !== 'noise') return layer

        return { ...layer, slope }
      }),
    }))
  },

  setPan: (id, pan) => {
    set((state) => ({
      layers: state.layers.map((layer) => {
        if (layer.id !== id) return layer
        if (layer.type === 'binaural') return layer
        layer.engine.applyPan(pan)
        return { ...layer, pan }
      }),
    }))
  },

  setFilterFrequency: (id, frequency) => {
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

  toggleBreathe: (id, enabled) => {
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
    const noise = new NoiseGenerator()
    const layer: NoiseLayer = {
      type: 'noise',
      id: crypto.randomUUID(),
      engine: noise,
      slope: 0,
      volume: 0.25,
      pan: 0,
      filterFrequency: 1,
      isPlaying: true,
      isBreathing: false,
      isMuted: false,
    }
    set((state) => ({ layers: [...state.layers, layer] }))
    return layer
  },

  addBinauralLayer: () => {
    const binaural = new BinauralGenerator()
    const layer: BinauralLayer = {
      type: 'binaural',
      id: crypto.randomUUID(),
      engine: binaural,
      volume: 0.25,
      pan: 0,
      isPlaying: true,
      isMuted: false,
      beatFrequency: 4,
      carrierFrequency: 200,
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
