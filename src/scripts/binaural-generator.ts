import { audioContext } from '@consts/audio-context'

export class BinauralGenerator {
  private audioContext: AudioContext
  private leftOscillator: OscillatorNode | null = null
  private rightOscillator: OscillatorNode | null = null

  // Signal chain
  private leftGain: GainNode
  private rightGain: GainNode
  private merger: ChannelMergerNode
  private volumeNode: GainNode
  private filter: BiquadFilterNode

  // Track current values for updates while playing
  private currentCarrier: number = 200
  private currentBeat: number = 10
  private currentWaveform: OscillatorType = 'sine'

  constructor() {
    this.audioContext = audioContext

    // Create nodes
    this.leftGain = this.audioContext.createGain()
    this.rightGain = this.audioContext.createGain()
    this.merger = this.audioContext.createChannelMerger(2)
    this.volumeNode = this.audioContext.createGain()
    this.filter = this.audioContext.createBiquadFilter()

    // Signal chain: oscillators → gains → merger → filter → volume → destination
    this.leftGain.connect(this.merger, 0, 0) // left channel
    this.rightGain.connect(this.merger, 0, 1) // right channel
    this.merger.connect(this.filter)
    this.filter.connect(this.volumeNode)
    this.volumeNode.connect(this.audioContext.destination)

    // Defaults
    this.leftGain.gain.value = 1
    this.rightGain.gain.value = 1
    this.volumeNode.gain.value = 0.15 // quieter than noise by default
    this.filter.type = 'lowpass'
    this.filter.frequency.value = 1000 // soften the tone
  }

  // Playback

  play(carrierFrequency: number = 200, beatFrequency: number = 10) {
    this.stop()

    this.currentCarrier = carrierFrequency
    this.currentBeat = beatFrequency

    // Left oscillator: carrier frequency
    this.leftOscillator = this.audioContext.createOscillator()
    this.leftOscillator.type = this.currentWaveform
    this.leftOscillator.frequency.value = carrierFrequency
    this.leftOscillator.connect(this.leftGain)

    // Right oscillator: carrier + beat frequency
    this.rightOscillator = this.audioContext.createOscillator()
    this.rightOscillator.type = this.currentWaveform
    this.rightOscillator.frequency.value = carrierFrequency + beatFrequency
    this.rightOscillator.connect(this.rightGain)

    this.leftOscillator.start()
    this.rightOscillator.start()
  }

  stop() {
    if (this.leftOscillator) {
      this.leftOscillator.stop()
      this.leftOscillator.disconnect()
      this.leftOscillator = null
    }
    if (this.rightOscillator) {
      this.rightOscillator.stop()
      this.rightOscillator.disconnect()
      this.rightOscillator = null
    }
  }

  // Parameter Controls

  applyVolume(value: number) {
    this.volumeNode.gain.value = value
  }

  applyCarrierFrequency(hz: number) {
    this.currentCarrier = hz
    if (this.leftOscillator && this.rightOscillator) {
      this.leftOscillator.frequency.value = hz
      this.rightOscillator.frequency.value = hz + this.currentBeat
    }
  }

  applyBeatFrequency(hz: number) {
    this.currentBeat = hz
    if (this.rightOscillator) {
      this.rightOscillator.frequency.value = this.currentCarrier + hz
    }
  }

  applyWaveform(type: OscillatorType) {
    this.currentWaveform = type
    if (this.leftOscillator && this.rightOscillator) {
      this.leftOscillator.type = type
      this.rightOscillator.type = type
    }
  }

  applyFilterFrequency(value: number) {
    const frequency = 200 * Math.pow(5000 / 200, value)
    this.filter.frequency.value = frequency
  }
}
