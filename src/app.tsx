import { useState } from 'react'
import { NoiseCard } from './components/noise-card'
import { Noise } from './scripts/noise'

export function App() {
  const [layers, setLayers] = useState<Noise[]>([])
  const [globalPlaying, setGlobalPlaying] = useState(false)

  const addLayer = () => {
    const noise = new Noise()
    setLayers((prevLayers) => [...prevLayers, noise])

    if (globalPlaying) {
      noise.play()
    }
  }

  const toggle = () => {
    if (globalPlaying) {
      layers.forEach((n) => n.stop())
    } else {
      layers.forEach((n) => {
        if (n.active) n.play()
      })
    }
    setGlobalPlaying(!globalPlaying)
  }

  return (
    <div>
      {layers.map((layer) => (
        <NoiseCard key={layer.id} noise={layer} globalPlaying={globalPlaying} />
      ))}
      <button onClick={addLayer}>Add Layer</button>
      <button onClick={toggle}>{globalPlaying ? 'Pause' : 'Play'}</button>
    </div>
  )
}
