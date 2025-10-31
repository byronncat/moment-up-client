export async function trimAudioFile(
  file: File,
  startTime: number,
  endTime: number
): Promise<File> {
  const audioContext = new AudioContext();

  try {
    // Read the file as an ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();

    // Decode the audio data
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

    // Calculate the samples to extract
    const { sampleRate, numberOfChannels } = audioBuffer;
    const startSample = Math.floor(startTime * sampleRate);
    const endSample = Math.floor(endTime * sampleRate);
    const newLength = endSample - startSample;

    // Create a new buffer with the trimmed duration
    const trimmedBuffer = audioContext.createBuffer(
      numberOfChannels,
      newLength,
      sampleRate
    );

    // Copy the trimmed audio data to the new buffer
    for (let channel = 0; channel < numberOfChannels; channel++) {
      const originalData = audioBuffer.getChannelData(channel);
      const trimmedData = trimmedBuffer.getChannelData(channel);
      
      for (let i = 0; i < newLength; i++) {
        trimmedData[i] = originalData[startSample + i];
      }
    }

    // Convert the trimmed buffer to a WAV file
    const wavBlob = await audioBufferToWav(trimmedBuffer);
    
    // Create a new File object
    const originalName = file.name;
    const nameWithoutExt = originalName.substring(0, originalName.lastIndexOf('.')) || originalName;
    const trimmedFile = new File([wavBlob], `${nameWithoutExt}-trimmed.wav`, {
      type: 'audio/wav',
    });

    return trimmedFile;
  } finally {
    await audioContext.close();
  }
}

function audioBufferToWav(buffer: AudioBuffer): Promise<Blob> {
  const { numberOfChannels, sampleRate } = buffer;
  const format = 1; // PCM
  const bitDepth = 16;

  const bytesPerSample = bitDepth / 8;
  const blockAlign = numberOfChannels * bytesPerSample;

  const data = interleave(buffer);
  const dataLength = data.length * bytesPerSample;
  const bufferLength = 44 + dataLength;

  const arrayBuffer = new ArrayBuffer(bufferLength);
  const view = new DataView(arrayBuffer);

  // Write WAV header
  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + dataLength, true);
  writeString(view, 8, 'WAVE');
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true); // fmt chunk size
  view.setUint16(20, format, true); // audio format
  view.setUint16(22, numberOfChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * blockAlign, true); // byte rate
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitDepth, true);
  writeString(view, 36, 'data');
  view.setUint32(40, dataLength, true);

  // Write audio data
  let offset = 44;
  for (let i = 0; i < data.length; i++) {
    const sample = Math.max(-1, Math.min(1, data[i]));
    const intSample = sample < 0 ? sample * 0x8000 : sample * 0x7fff;
    view.setInt16(offset, intSample, true);
    offset += 2;
  }

  return Promise.resolve(new Blob([arrayBuffer], { type: 'audio/wav' }));
}

function interleave(buffer: AudioBuffer): Float32Array {
  const { numberOfChannels, length } = buffer;
  const totalLength = length * numberOfChannels;
  const result = new Float32Array(totalLength);

  let inputIndex = 0;
  for (let i = 0; i < length; i++) {
    for (let channel = 0; channel < numberOfChannels; channel++) {
      result[inputIndex++] = buffer.getChannelData(channel)[i];
    }
  }

  return result;
}

function writeString(view: DataView, offset: number, string: string): void {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}

