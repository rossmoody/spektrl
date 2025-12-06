// App.tsx
import { NoiseLayer } from '@components/noise-layer'
import { useNoiseStore } from '@stores/noise-store'
import { useState } from 'react'

const { addLayer, playAll, stopAll } = useNoiseStore.getState()

export function App() {
  const [globalPlaying, setGlobalIsPlaying] = useState(false)
  const layers = useNoiseStore((s) => s.layers)

  const handlePlayChange = () => {
    if (globalPlaying) {
      stopAll()
    } else {
      playAll()
    }
    setGlobalIsPlaying(!globalPlaying)
  }

  const handleAddLayer = () => {
    const layer = addLayer()
    if (globalPlaying) {
      layer.noise.play()
    }
  }

  return (
    <div>
      {layers.map((layer) => (
        <NoiseLayer
          key={layer.id}
          layer={layer}
          globalPlaying={globalPlaying}
        />
      ))}
      <button onClick={handleAddLayer}>Add Layer</button>
      <button onClick={handlePlayChange}>
        {globalPlaying ? 'Stop' : 'Play'}
      </button>
    </div>
  )
}
