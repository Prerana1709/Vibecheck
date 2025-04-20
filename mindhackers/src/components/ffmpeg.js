import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';

const ffmpeg = createFFmpeg({ log: true });

const convertToWav = async (audioBlob) => {
  await ffmpeg.load();

  // Create a temporary file from the Blob
  const audioFileName = 'audio.mp3'; // Example filename
  ffmpeg.FS('writeFile', audioFileName, await fetchFile(audioBlob));

  // Run FFmpeg to convert the file to WAV format
  await ffmpeg.run('-i', audioFileName, 'output.wav');

  // Read the output file back from FFmpeg's virtual filesystem
  const wavFile = ffmpeg.FS('readFile', 'output.wav');

  // Convert the result to a Blob and then to a base64 string
  const wavBlob = new Blob([wavFile.buffer], { type: 'audio/wav' });
  const reader = new FileReader();
  reader.onloadend = () => {
    const base64Audio = reader.result.split(',')[1]; // Remove the metadata part of base64
    resolve(fixBase64Padding(base64Audio)); // Add padding if needed
  };
  reader.readAsDataURL(wavBlob);
};

const captureAndConvertAudio = async () => {
  return new Promise((resolve, reject) => {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        const mediaRecorder = new MediaRecorder(stream);
        const chunks = [];

        mediaRecorder.ondataavailable = event => {
          chunks.push(event.data);
        };

        mediaRecorder.onstop = () => {
          const audioBlob = new Blob(chunks, { type: 'audio/webm' });

          // Convert the audio blob to WAV format
          convertToWav(audioBlob).then(resolvedAudio => {
            resolve(resolvedAudio); // Send the converted audio to the backend
          }).catch(reject);
        };

        mediaRecorder.start();

        // Stop recording after 5 seconds (for example)
        setTimeout(() => {
          mediaRecorder.stop();
        }, 5000);
      })
      .catch(reject);
  });
};
