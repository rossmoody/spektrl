import { useState } from 'react'
import { NoiseCard } from './components/noise-card'
import { Noise } from './scripts/noise'

export function App() {
  const [layers, setLayers] = useState<Noise[]>([])
  const [isPlaying, setIsPlaying] = useState(false)

  const addLayer = () => {
    const noise = new Noise()
    setLayers((prevLayers) => [...prevLayers, noise])

    if (isPlaying) {
      noise.play()
    }
  }

  const toggle = () => {
    if (isPlaying) {
      layers.forEach((n) => n.stop())
    } else {
      layers.forEach((n) => n.play())
    }
    setIsPlaying(!isPlaying)
  }

  return (
    <div>
      {layers.map((layer, index) => (
        <NoiseCard key={index} noise={layer} />
      ))}
      <button onClick={addLayer}>Add Layer</button>
      <button onClick={toggle}>{isPlaying ? 'Pause' : 'Play'}</button>
    </div>
  )
}
