export class NoiseGenerator {
  /**
   * The AudioContext used for generating and playing noise.
   */
  private audioContext: AudioContext

  /**
   * The AudioBufferSourceNode used to play the generated noise.
   */
  private source: AudioBufferSourceNode | null = null

  /**
   * For controlling volume in the context of the AudioContext.
   */
  private gainNode: GainNode

  /**
   * To move sound between left and right audio channels.
   */
  private panner: StereoPannerNode

  constructor() {
    this.audioContext = new AudioContext()
    this.gainNode = this.audioContext.createGain()
    this.panner = this.audioContext.createStereoPanner()

    // Chain: source → panner → gainNode → destination
    this.panner.connect(this.gainNode)
    this.gainNode.connect(this.audioContext.destination)

    this.gainNode.gain.value = 0.25
    this.panner.pan.value = 0
  }

  /**
   * Sets the pan value for stereo output
   * @param value -1 (left) to 1 (right)
   */
  setPan(value: number) {
    this.panner.pan.value = value
  }

  /**
   * Bicorrelates and plays noise with the specified slope. We do this for
   * both left and right channels to create a stereo effect. Also because
   * independent noise for each channel sounds better and we pan them.
   */
  play(slope: number) {
    this.stop()

    const leftSamples = this.generateNoise(slope)
    const rightSamples = this.generateNoise(slope)

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
    this.gainNode.gain.value = value
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

  /**
   * Cleans up and releases audio resources
   */
  dispose() {
    this.stop()
    this.audioContext.close()
  }

  /**
   * Adds a low pass filter to the audio chain
   */
  addLowPassFilter(frequencyInput: number) {
    const frequency = 200 * Math.pow(15000 / 200, frequencyInput) // Map 0-1 to 200-15000 Hz
    console.log('Setting low pass filter frequency to:', frequency)
    const filter = this.audioContext.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.value = frequency

    this.gainNode.disconnect()
    this.gainNode.connect(filter)
    filter.connect(this.audioContext.destination)
  }
}
