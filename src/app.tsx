// App.tsx
import { NoiseLayer } from '@components/noise-layer'
import { useNoiseStore } from '@stores/noise-store'

const {} = useNoiseStore.getState()

export function App() {
  const layers = useNoiseStore((s) => s.layers)
  const addLayer = useNoiseStore((s) => s.addLayer)
  const playAll = useNoiseStore((s) => s.playAll)
  const stopAll = useNoiseStore((s) => s.stopAll)

  const isPlaying = layers.some((l) => l.isPlaying)

  return (
    <div>
      {layers.map((layer) => (
        <NoiseLayer key={layer.id} layer={layer} />
      ))}
      <button onClick={addLayer}>Add Layer</button>
      <button onClick={isPlaying ? stopAll : playAll}>
        {isPlaying ? 'Stop' : 'Play'}
      </button>
    </div>
  )
}
