import { BinauralController } from '@components/binaural-controller'
import { NoiseController } from '@components/noise-controller'
import { createBinauralLayer } from '@generators/binaural-layer'
import { createNoiseLayer } from '@generators/noise-layer'
import { useSoundStore } from '@stores/sound-store'

const { addLayer, playAll, stopAll, reset } = useSoundStore.getState()

export function App() {
  const layers = useSoundStore((s) => s.layers)

  return (
    <div>
      {layers.map((layer) => {
        switch (layer.type) {
          case 'noise':
            return <NoiseController key={layer.id} layer={layer} />
          case 'binaural':
            return <BinauralController key={layer.id} layer={layer} />
        }
      })}

      <button onClick={() => addLayer(createNoiseLayer())}>Add Noise</button>
      <button onClick={() => addLayer(createBinauralLayer())}>
        Add Binaural
      </button>
      <button onClick={playAll}>Play</button>
      <button onClick={stopAll}>Pause</button>
      <button onClick={reset}>Reset</button>
    </div>
  )
}
