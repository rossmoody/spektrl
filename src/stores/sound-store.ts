import {
  applyBinauralUpdates,
  type BinauralLayer,
  playBinauralLayer,
} from '@generators/binaural-layer'
import {
  applyNoiseUpdates,
  type NoiseLayer,
  playNoiseLayer,
} from '@generators/noise-layer'
import { create } from 'zustand'

export type SoundLayer = NoiseLayer | BinauralLayer

export interface SoundStore {
  layers: SoundLayer[]
  addLayer: (layer: SoundLayer) => void
  removeLayer: (id: string) => void
  updateLayer: (id: string, updates: Partial<SoundLayer>) => void
  playAll: () => void
  stopAll: () => void
  reset: () => void
}

function playLayer(layer: SoundLayer) {
  switch (layer.type) {
    case 'noise':
      return playNoiseLayer(layer)
    case 'binaural':
      return playBinauralLayer(layer)
  }
}

function applyUpdates(layer: SoundLayer, updates: Partial<SoundLayer>) {
  switch (layer.type) {
    case 'noise':
      return applyNoiseUpdates(layer, updates as Partial<NoiseLayer>)
    case 'binaural':
      return applyBinauralUpdates(layer, updates as Partial<BinauralLayer>)
  }
}

export const useSoundStore = create<SoundStore>((set, get) => ({
  layers: [],

  addLayer: (layer) => {
    set((state) => ({ layers: [...state.layers, layer] }))
  },

  removeLayer: (id) => {
    const layer = get().layers.find((l) => l.id === id)
    layer?.engine.stop()
    set((state) => ({ layers: state.layers.filter((l) => l.id !== id) }))
  },

  updateLayer: (id, updates) => {
    set((state) => ({
      layers: state.layers.map((layer) => {
        if (layer.id !== id) return layer
        applyUpdates(layer, updates)
        return layer
      }),
    }))
  },

  playAll: () => {
    set((state) => ({
      layers: state.layers.map((layer) => {
        if (layer.isMuted) return layer
        playLayer(layer)
        return { ...layer, isPlaying: true }
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

  reset: () => {
    get().layers.forEach((layer) => layer.engine.stop())
    set({ layers: [] })
  },
}))
