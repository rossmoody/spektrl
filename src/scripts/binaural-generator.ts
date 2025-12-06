import { audioContext } from '@consts/audio-context'

export class BinauralGenerator {
  private audioContext: AudioContext

  constructor() {
    this.audioContext = audioContext
  }
}
