import { Noise } from '@scripts/noise'
import { create } from 'zustand'

export interface NoiseLayer {
  id: string
  noise: Noise
  slope: number
  volume: number
  pan: number
  filterFrequency: number
  isPlaying: boolean
  isBreathing: boolean
  isMuted: boolean
}

export interface NoiseStore {
  layers: NoiseLayer[]
  addLayer: () => NoiseLayer
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

export const useNoiseStore = create<NoiseStore>((set, get) => ({
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
          layer.noise.applyVolume(volume)
          return { ...layer, volume }
        }
        return layer
      }),
    }))
  },

  setSlope: (id, slope) => {
    set((state) => ({
      layers: state.layers.map((layer) => {
        if (layer.id === id) {
          return { ...layer, slope }
        }
        return layer
      }),
    }))
  },

  setPan: (id, pan) => {
    set((state) => ({
      layers: state.layers.map((layer) => {
        if (layer.id === id) {
          layer.noise.applyPan(pan)
          return { ...layer, pan }
        }
        return layer
      }),
    }))
  },

  setFilterFrequency: (id, frequency) => {
    set((state) => ({
      layers: state.layers.map((layer) => {
        if (layer.id === id) {
          layer.noise.applyFilterFrequency(frequency)
          return { ...layer, filterFrequency: frequency }
        }
        return layer
      }),
    }))
  },

  toggleBreathe: (id, enabled) => {
    set((state) => ({
      layers: state.layers.map((layer) => {
        if (layer.id === id) {
          layer.noise.applyBreathe(enabled)
          return { ...layer, isBreathing: enabled }
        }
        return layer
      }),
    }))
  },

  addLayer: () => {
    const noise = new Noise()
    const layer: NoiseLayer = {
      id: crypto.randomUUID(),
      noise,
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

  removeLayer: (id) => {
    const layer = get().layers.find((l) => l.id === id)
    layer?.noise.stop()
    set((state) => ({ layers: state.layers.filter((l) => l.id !== id) }))
  },

  playAll: () => {
    set((state) => ({
      layers: state.layers.map((layer) => {
        if (!layer.isMuted) {
          layer.noise.play(layer.slope)
          return { ...layer, isPlaying: true }
        }
        return layer
      }),
    }))
  },

  stopAll: () => {
    set((state) => ({
      layers: state.layers.map((layer) => {
        layer.noise.stop()
        return { ...layer, isPlaying: false }
      }),
    }))
  },
}))
