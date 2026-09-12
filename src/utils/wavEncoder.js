/**
 * Universal 16kHz 16-bit Mono Linear PCM WAV Encoder
 * Compatible with Bhashini Bodhan ASR (requires 16kHz mono WAV)
 * and Groq Whisper Large v3 (natively accepts 16kHz WAV).
 */

function writeString(view, offset, string) {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}

function floatTo16BitPCM(output, offset, input) {
  for (let i = 0; i < input.length; i++, offset += 2) {
    const s = Math.max(-1, Math.min(1, input[i]));
    output.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
  }
}

/**
 * Encodes Float32Array PCM samples into a standard 44-byte RIFF/WAVE 16-bit PCM Blob
 */
export function encodeWAV(samples, sampleRate = 16000) {
  const buffer = new ArrayBuffer(44 + samples.length * 2);
  const view = new DataView(buffer);

  // 1. "RIFF" Header
  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + samples.length * 2, true);
  writeString(view, 8, 'WAVE');

  // 2. "fmt " Subchunk
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true); // Subchunk1Size (16 for PCM)
  view.setUint16(20, 1, true);  // AudioFormat (1 = Linear PCM)
  view.setUint16(22, 1, true);  // NumChannels (1 = Mono)
  view.setUint32(24, sampleRate, true); // SampleRate (16000)
  view.setUint32(28, sampleRate * 2, true); // ByteRate (SampleRate * NumChannels * BitsPerSample/8 = 32000)
  view.setUint16(32, 2, true);  // BlockAlign (NumChannels * BitsPerSample/8 = 2)
  view.setUint16(34, 16, true); // BitsPerSample (16)

  // 3. "data" Subchunk
  writeString(view, 36, 'data');
  view.setUint32(40, samples.length * 2, true);

  // 4. Write 16-bit PCM samples
  floatTo16BitPCM(view, 44, samples);

  return new Blob([view], { type: 'audio/wav' });
}

/**
 * Resamples Float32 audio samples from sourceSampleRate to targetSampleRate (default: 16000Hz)
 */
export function resampleAudioBuffer(audioChunks, sourceSampleRate, targetSampleRate = 16000) {
  // Merge chunks into single Float32Array
  let totalLength = 0;
  for (const chunk of audioChunks) {
    totalLength += chunk.length;
  }

  const merged = new Float32Array(totalLength);
  let offset = 0;
  for (const chunk of audioChunks) {
    merged.set(chunk, offset);
    offset += chunk.length;
  }

  if (sourceSampleRate === targetSampleRate) {
    return merged;
  }

  // Linear interpolation resampling
  const ratio = sourceSampleRate / targetSampleRate;
  const newLength = Math.round(merged.length / ratio);
  const result = new Float32Array(newLength);

  for (let i = 0; i < newLength; i++) {
    const origIndex = i * ratio;
    const indexFloor = Math.floor(origIndex);
    const indexCeil = Math.min(merged.length - 1, indexFloor + 1);
    const fraction = origIndex - indexFloor;
    result[i] = merged[indexFloor] * (1 - fraction) + merged[indexCeil] * fraction;
  }

  return result;
}
