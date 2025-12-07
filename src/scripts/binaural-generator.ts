import { audioContext } from '@consts/audio-context'
import { BINAURAL_DEFAULTS } from '@consts/defaults'

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

  constructor() {
    this.audioContext = audioContext

    // Create nodes
    this.leftGain = this.audioContext.createGain()
    this.rightGain = this.audioContext.createGain()
    this.merger = this.audioContext.createChannelMerger(2)
    this.volumeNode = this.audioContext.createGain()
    this.filter = this.audioContext.createBiquadFilter()

    // Signal chain: oscillators → gains → merger → filter → volume → destination
    this.leftGain.connect(this.merger, 0, 0)
    this.rightGain.connect(this.merger, 0, 1)
    this.merger.connect(this.filter)
    this.filter.connect(this.volumeNode)
    this.volumeNode.connect(this.audioContext.destination)

    // Defaults
    this.leftGain.gain.value = 1
    this.rightGain.gain.value = 1
    this.volumeNode.gain.value = BINAURAL_DEFAULTS.volume
    this.filter.type = 'lowpass'
    this.filter.frequency.value = 1000
  }

  play(
    carrierFrequency: number = BINAURAL_DEFAULTS.carrierFrequency,
    beatFrequency: number = BINAURAL_DEFAULTS.beatFrequency,
    waveform: OscillatorType = BINAURAL_DEFAULTS.waveform,
  ) {
    this.stop()

    this.leftOscillator = this.audioContext.createOscillator()
    this.leftOscillator.type = waveform
    this.leftOscillator.frequency.value = carrierFrequency
    this.leftOscillator.connect(this.leftGain)

    this.rightOscillator = this.audioContext.createOscillator()
    this.rightOscillator.type = waveform
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

  applyVolume(value: number) {
    this.volumeNode.gain.value = value
  }

  /**
   * Changes the pitch of the tone you hear.
   * 100 Hz: Deep hum (like a low bass note)
   * 300 Hz: Mid-range hum (like a cello)
   * 500 Hz: Higher hum (more present, can get annoying)
   */
  applyCarrierFrequency(carrier: number, beat: number) {
    if (this.leftOscillator && this.rightOscillator) {
      this.leftOscillator.frequency.value = carrier
      this.rightOscillator.frequency.value = carrier + beat
    }
  }

  /**
   * Changes how fast the perceived pulse is — the brain entrainment part.
   * 1–4 Hz Delta — deep sleep, healing
   * 4–8 Hz Theta — meditation, drowsiness, creativity
   * 8–13 Hz Alpha — relaxed focus, calm
   * 13–30 Hz Beta — alertness, concentration
   * 30–40 Hz Gamma — peak focus, learning
   */
  applyBeatFrequency(carrier: number, beat: number) {
    if (this.rightOscillator) {
      this.rightOscillator.frequency.value = carrier + beat
    }
  }

  /**
   * Changes the timbre/texture of the tone.
   * sine:     ∿∿∿∿  Pure, smooth, clinical (standard for binaural)
   * triangle: /\/\  Slightly brighter, softer edges
   * square:   ▔▁▔▁  Harsh, buzzy, hollow (like old video games)
   * sawtooth: /|/|  Bright, aggressive, rich in harmonics
   */
  applyWaveform(type: OscillatorType) {
    if (this.leftOscillator && this.rightOscillator) {
      this.leftOscillator.type = type
      this.rightOscillator.type = type
    }
  }

  /**
   * Softens or brightens the tone by cutting high frequencies.
   * Low filter (200 Hz):   Muffled, dark, gentle on the ears
   * Mid filter (1000 Hz):  Natural, balanced
   * High filter (5000 Hz): Bright, present, full tone
   */
  applyFilterFrequency(value: number) {
    const frequency = 200 * Math.pow(5000 / 200, value)
    this.filter.frequency.value = frequency
  }
}
