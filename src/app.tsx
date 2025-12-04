const AUDIO_CONTEXT = new AudioContext();
const SAMPLE_RATE = AUDIO_CONTEXT.sampleRate;
let source: AudioBufferSourceNode | null = null;

function generateWhiteNoise(sampleRate: number): Float32Array {
  const buffer = new Float32Array(sampleRate);

  for (let i = 0; i < sampleRate; i++) {
    buffer[i] = Math.random() * 2 - 1;
  }

  return buffer;
}

function playWhiteNoise() {
  const samples = generateWhiteNoise(SAMPLE_RATE);

  const audioBuffer = AUDIO_CONTEXT.createBuffer(
    1,
    samples.length,
    SAMPLE_RATE
  );
  audioBuffer.getChannelData(0).set(samples);

  source = AUDIO_CONTEXT.createBufferSource();
  source.buffer = audioBuffer;
  source.loop = true;
  source.connect(AUDIO_CONTEXT.destination);
  source.start();
}

function pauseWhiteNoise() {
  if (!source) return;
  source.stop();
  source = null;
}

export const App = () => {
  return (
    <div>
      <button onClick={playWhiteNoise}>Play</button>
      <button onClick={pauseWhiteNoise}>Pause</button>
    </div>
  );
};
