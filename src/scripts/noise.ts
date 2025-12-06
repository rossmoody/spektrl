import { audioContext } from '@consts/audio-context'

export class Noise {
  audioContext: AudioContext
  private source: AudioBufferSourceNode | null = null

  // Signal chain
  private panner: StereoPannerNode
  private lowPassFilter: BiquadFilterNode
  private compressor: DynamicsCompressorNode
  private volumeNode: GainNode

  // Breathe LFO
  private breatheOscillator: OscillatorNode
  private breatheGain: GainNode

  constructor() {
    this.audioContext = audioContext

    // Create nodes
    this.panner = this.audioContext.createStereoPanner()
    this.lowPassFilter = this.audioContext.createBiquadFilter()
    this.compressor = this.audioContext.createDynamicsCompressor()
    this.volumeNode = this.audioContext.createGain()
    this.breatheOscillator = this.audioContext.createOscillator()
    this.breatheGain = this.audioContext.createGain()

    // Signal chain: source → panner → filter → compressor → volume → destination
    this.panner.connect(this.lowPassFilter)
    this.lowPassFilter.connect(this.compressor)
    this.compressor.connect(this.volumeNode)
    this.volumeNode.connect(this.audioContext.destination)

    // Breathe LFO: oscillator → gain → volume.gain
    this.breatheOscillator.connect(this.breatheGain)
    this.breatheGain.connect(this.volumeNode.gain)
    this.breatheOscillator.start()

    // Defaults
    this.lowPassFilter.type = 'lowpass'
    this.lowPassFilter.frequency.value = 15000
    this.volumeNode.gain.value = 0.25
    this.panner.pan.value = 0

    this.breatheOscillator.frequency.value = 0.1
    this.breatheGain.gain.value = 0

    this.compressor.threshold.value = -24
    this.compressor.knee.value = 12
    this.compressor.ratio.value = 4
    this.compressor.attack.value = 0.005
    this.compressor.release.value = 0.1
  }

  // Playback

  play(slope: number = 0) {
    this.stop()

    const leftSamples = this.generateNoise(slope)
    const rightSamples = this.generateNoise(slope)
    this.applyStereoWidth(leftSamples, rightSamples, 2)

    const buffer = this.audioContext.createBuffer(
      2,
      leftSamples.length,
      this.audioContext.sampleRate,
    )
    buffer.getChannelData(0).set(leftSamples)
    buffer.getChannelData(1).set(rightSamples)

    this.source = this.audioContext.createBufferSource()
    this.source.buffer = buffer
    this.source.loop = true
    this.source.connect(this.panner)
    this.source.start()
  }

  stop() {
    if (this.source) {
      this.source.stop()
      this.source = null
    }
  }

  // Parameter Controls

  applyVolume(value: number) {
    this.volumeNode.gain.value = value
  }

  applyPan(value: number) {
    this.panner.pan.value = value
  }

  applyFilterFrequency(value: number) {
    const frequency = 200 * Math.pow(15000 / 200, value)
    this.lowPassFilter.frequency.value = frequency
  }

  applyBreathe(enabled: boolean) {
    this.breatheGain.gain.value = enabled ? 0.05 : 0
  }

  // Audio Processing

  private applyStereoWidth(
    left: Float32Array,
    right: Float32Array,
    width: number,
  ) {
    for (let i = 0; i < left.length; i++) {
      const mid = (left[i] + right[i]) / 2
      const side = left[i] - mid
      left[i] = mid + side * width
      right[i] = mid - side * width
    }
  }

  private generateNoise(slope: number): Float32Array {
    const length = this.audioContext.sampleRate * 2
    const buffer = new Float32Array(length)
    const white = new Float32Array(length)

    for (let i = 0; i < length; i++) {
      white[i] = Math.random() * 2 - 1
    }

    if (Math.abs(slope) < 0.1) {
      return white
    }

    if (slope < 0) {
      this.generateWarmNoise(white, buffer, slope)
    } else {
      this.generateBrightNoise(white, buffer, slope)
    }

    this.normalizeBuffer(buffer)
    return buffer
  }

  private generateWarmNoise(
    white: Float32Array,
    buffer: Float32Array,
    slope: number,
  ) {
    const length = white.length
    const normalizedSlope = Math.abs(slope) / 6

    // Brown noise
    let brownValue = 0
    const brown = new Float32Array(length)
    for (let i = 0; i < length; i++) {
      brownValue += white[i] * 0.1
      brownValue = Math.max(-1, Math.min(1, brownValue))
      brown[i] = brownValue
    }

    // Pink noise
    let b0 = 0,
      b1 = 0,
      b2 = 0,
      b3 = 0,
      b4 = 0,
      b5 = 0,
      b6 = 0
    const pink = new Float32Array(length)
    for (let i = 0; i < length; i++) {
      const w = white[i]
      b0 = 0.99886 * b0 + w * 0.0555179
      b1 = 0.99332 * b1 + w * 0.0750759
      b2 = 0.969 * b2 + w * 0.153852
      b3 = 0.8665 * b3 + w * 0.3104856
      b4 = 0.55 * b4 + w * 0.5329522
      b5 = -0.7616 * b5 - w * 0.016898
      pink[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + w * 0.5362) * 0.11
      b6 = w * 0.115926
    }

    // Interpolate: white → pink → brown
    for (let i = 0; i < length; i++) {
      if (normalizedSlope <= 0.5) {
        const t = normalizedSlope * 2
        buffer[i] = white[i] * (1 - t) + pink[i] * t
      } else {
        const t = (normalizedSlope - 0.5) * 2
        buffer[i] = pink[i] * (1 - t) + brown[i] * t
      }
    }
  }

  private generateBrightNoise(
    white: Float32Array,
    buffer: Float32Array,
    slope: number,
  ) {
    const length = white.length
    const factor = slope / 6

    // Blue: first derivative
    const blue = new Float32Array(length)
    for (let i = 1; i < length; i++) {
      blue[i] = white[i] - white[i - 1]
    }

    // Violet: second derivative
    const violet = new Float32Array(length)
    for (let i = 1; i < length; i++) {
      violet[i] = blue[i] - blue[i - 1]
    }

    // Normalize blue and violet
    this.normalizeBuffer(blue)
    this.normalizeBuffer(violet)

    // Interpolate: white → blue → violet
    for (let i = 0; i < length; i++) {
      if (factor <= 0.5) {
        const t = factor * 2
        buffer[i] = white[i] * (1 - t) + blue[i] * t
      } else {
        const t = (factor - 0.5) * 2
        buffer[i] = blue[i] * (1 - t) + violet[i] * t
      }
    }
  }

  private normalizeBuffer(buffer: Float32Array) {
    let max = 0
    for (let i = 0; i < buffer.length; i++) {
      max = Math.max(max, Math.abs(buffer[i]))
    }
    if (max > 0) {
      for (let i = 0; i < buffer.length; i++) {
        buffer[i] /= max
      }
    }
  }
}
