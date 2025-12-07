// App.tsx
import { BinauralController } from '@components/binaural-controller'
import { NoiseController } from '@components/noise-controller'
import { useSoundStore } from '@stores/noise-store'
import { useState } from 'react'

const { addNoiseLayer, addBinauralLayer, playAll, stopAll, reset } =
  useSoundStore.getState()

export function App() {
  const [globalPlaying, setGlobalIsPlaying] = useState(false)
  const layers = useSoundStore((s) => s.layers)

  const handlePlayChange = () => {
    if (globalPlaying) {
      stopAll()
    } else {
      playAll()
    }
    setGlobalIsPlaying(!globalPlaying)
  }

  const handleAddNoiseLayer = () => {
    const layer = addNoiseLayer()
    if (globalPlaying) {
      layer.engine.play()
    }
  }

  const handleAddBinauralLayer = () => {
    const layer = addBinauralLayer()
    if (globalPlaying) {
      layer.engine.play()
    }
  }

  const handleReset = () => {
    reset()
    setGlobalIsPlaying(false)
  }

  return (
    <div>
      {layers.map((layer) => {
        switch (layer.type) {
          case 'noise': {
            return (
              <NoiseController
                key={layer.id}
                layer={layer}
                globalPlaying={globalPlaying}
              />
            )
          }
          case 'binaural': {
            return (
              <BinauralController
                key={layer.id}
                layer={layer}
                globalPlaying={globalPlaying}
              />
            )
          }
          default:
            return null
        }
      })}

      <div>
        <button onClick={handleAddNoiseLayer}>Add Noise Layer</button>
        <button onClick={handleAddBinauralLayer}>Add Binaural Layer</button>
      </div>

      <div>
        <button onClick={handlePlayChange}>
          {globalPlaying ? 'Stop' : 'Play'}
        </button>
        <button onClick={handleReset}>Reset</button>
      </div>
    </div>
  )
}
