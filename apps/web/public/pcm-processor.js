class PCMProcessor extends AudioWorkletProcessor {
  process(inputs) {
    const input = inputs[0];
    if (!input.length || !input[0].length) return true;

    const channelData = input[0];
    const ratio = sampleRate / 16000;
    const outputLen = Math.ceil(channelData.length / ratio);
    const int16 = new Int16Array(outputLen);

    for (let i = 0; i < outputLen; i++) {
      const idx = Math.min(Math.round(i * ratio), channelData.length - 1);
      const s = Math.max(-1, Math.min(1, channelData[idx]));
      int16[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
    }

    this.port.postMessage(int16.buffer, [int16.buffer]);
    return true;
  }
}

registerProcessor("pcm-processor", PCMProcessor);
