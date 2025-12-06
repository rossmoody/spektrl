// App.tsx
import { NoiseController } from '@components/noise-controller'
import { useSoundStore } from '@stores/noise-store'
import { useState } from 'react'

const { addLayer, playAll, stopAll } = useSoundStore.getState()

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

  const handleAddLayer = () => {
    const layer = addLayer()
    if (globalPlaying) {
      layer.engine.play()
    }
  }

  return (
    <div>
      {layers.map((layer) => (
        <NoiseController
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
