import { audioContext } from '@/consts/audio-context'

export class Noise {
  private audioContext: AudioContext
  private source: AudioBufferSourceNode | null = null
  private volume: GainNode
  private panner: StereoPannerNode
  private lowPassFilter: BiquadFilterNode
  private breatheOscillator: OscillatorNode
  private breatheGain: GainNode
  private compressor: DynamicsCompressorNode

  constructor() {
    this.audioContext = audioContext
    this.volume = this.audioContext.createGain()
    this.panner = this.audioContext.createStereoPanner()
    this.lowPassFilter = this.audioContext.createBiquadFilter()
    this.breatheOscillator = this.audioContext.createOscillator()
    this.breatheGain = this.audioContext.createGain()
    this.compressor = this.audioContext.createDynamicsCompressor()

    // Chain: source → panner → filter → compressor → volume → destination
    this.panner.connect(this.lowPassFilter)
    this.lowPassFilter.connect(this.compressor)
    this.compressor.connect(this.volume)
    this.volume.connect(this.audioContext.destination)

    // Breathe LFO modulates volume | breatheOscillator → breatheGain → volume gain
    this.breatheOscillator.connect(this.breatheGain)
    this.breatheGain.connect(this.volume.gain)
    this.breatheOscillator.start()

    // Default values
    this.lowPassFilter.type = 'lowpass'
    this.lowPassFilter.frequency.value = 15000 // fully open
    this.volume.gain.value = 0.25
    this.panner.pan.value = 0
    this.breatheOscillator.frequency.value = 0.1 // one cycle per 10 seconds
    this.breatheGain.gain.value = 0

    // Compressor defaults
    this.compressor.threshold.value = -24
    this.compressor.knee.value = 12
    this.compressor.ratio.value = 4
    this.compressor.attack.value = 0.005
    this.compressor.release.value = 0.1
  }

  toggleBreathe(enabled: boolean) {
    this.breatheGain.gain.value = enabled ? 0.05 : 0
  }

  setPan(value: number) {
    this.panner.pan.value = value
  }

  play(slope: number) {
    this.stop()

    const leftSamples = this.generateNoise(slope)
    const rightSamples = this.generateNoise(slope)

    // Apply stereo width
    for (let i = 0; i < leftSamples.length; i++) {
      const mid = (leftSamples[i] + rightSamples[i]) / 2
      const side = leftSamples[i] - mid
      leftSamples[i] = mid + side * 2
      rightSamples[i] = mid - side * 2
    }

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

  setVolume(value: number) {
    this.volume.gain.value = value
  }

  setFilterFrequency(frequencyInput: number) {
    const frequency = 200 * Math.pow(15000 / 200, frequencyInput)
    this.lowPassFilter.frequency.value = frequency
  }

  private generateNoise(slope: number): Float32Array {
    const length = this.audioContext.sampleRate * 2
    const buffer = new Float32Array(length)

    const white = new Float32Array(length)
    for (let i = 0; i < length; i++) {
      white[i] = Math.random() * 2 - 1 // A number between -1 and 1
    }

    switch (true) {
      case slope < 0: {
      }
    }

    if (Math.abs(slope) < 0.1) {
      return white
    }

    if (slope < 0) {
      const normalizedSlope = Math.abs(slope) / 6

      let brownValue = 0
      const brown = new Float32Array(length)
      for (let i = 0; i < length; i++) {
        brownValue += white[i] * 0.1
        brownValue = Math.max(-1, Math.min(1, brownValue))
        brown[i] = brownValue
      }

      // Pink: weighted memory algorithm
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

      // Interpolate: white -> pink -> brown
      for (let i = 0; i < length; i++) {
        if (normalizedSlope <= 0.5) {
          const t = normalizedSlope * 2
          buffer[i] = white[i] * (1 - t) + pink[i] * t
        } else {
          const t = (normalizedSlope - 0.5) * 2
          buffer[i] = pink[i] * (1 - t) + brown[i] * t
        }
      }
    } else {
      // Differentiation pathway (toward violet)
      const factor = slope / 6

      // Blue: first derivative
      const blue = new Float32Array(length)
      for (let i = 1; i < length; i++) {
        blue[i] = white[i] - white[i - 1]
      }
      blue[0] = 0

      // Violet: second derivative
      const violet = new Float32Array(length)
      for (let i = 1; i < length; i++) {
        violet[i] = blue[i] - blue[i - 1]
      }
      violet[0] = 0

      // Normalize blue and violet
      let maxBlue = 0,
        maxViolet = 0
      for (let i = 0; i < length; i++) {
        maxBlue = Math.max(maxBlue, Math.abs(blue[i]))
        maxViolet = Math.max(maxViolet, Math.abs(violet[i]))
      }
      for (let i = 0; i < length; i++) {
        if (maxBlue > 0) blue[i] /= maxBlue
        if (maxViolet > 0) violet[i] /= maxViolet
      }

      // Interpolate: white -> blue -> violet
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

    // Normalize final buffer
    let max = 0
    for (let i = 0; i < length; i++) {
      max = Math.max(max, Math.abs(buffer[i]))
    }
    if (max > 0) {
      for (let i = 0; i < length; i++) {
        buffer[i] /= max
      }
    }

    return buffer
  }
}
