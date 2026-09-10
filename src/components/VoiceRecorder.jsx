import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Mic,
  Square,
  RotateCcw,
  Clock,
  AlertCircle,
  Sparkles,
  Activity
} from 'lucide-react';
import './VoiceRecorder.css';

/**
 * Utility: Converts an AudioBuffer to a standard 16kHz mono 16-bit PCM WAV ArrayBuffer
 */
function audioBufferToWav16kHzMono(audioBuffer) {
  const channelData = audioBuffer.getChannelData(0);
  const sampleRate = 16000;
  const numSamples = channelData.length;
  const buffer = new ArrayBuffer(44 + numSamples * 2);
  const view = new DataView(buffer);

  const writeString = (v, offset, string) => {
    for (let i = 0; i < string.length; i++) {
      v.setUint8(offset + i, string.charCodeAt(i));
    }
  };

  /* RIFF identifier */
  writeString(view, 0, 'RIFF');
  /* file length */
  view.setUint32(4, 36 + numSamples * 2, true);
  /* RIFF type */
  writeString(view, 8, 'WAVE');
  /* format chunk identifier */
  writeString(view, 12, 'fmt ');
  /* format chunk length */
  view.setUint32(16, 16, true);
  /* sample format (raw PCM = 1) */
  view.setUint16(20, 1, true);
  /* channel count (1 = mono) */
  view.setUint16(22, 1, true);
  /* sample rate (16000) */
  view.setUint32(24, sampleRate, true);
  /* byte rate (sampleRate * 1 channel * 2 bytes/sample) */
  view.setUint32(28, sampleRate * 2, true);
  /* block align (1 channel * 2 bytes/sample) */
  view.setUint16(32, 2, true);
  /* bits per sample */
  view.setUint16(34, 16, true);
  /* data chunk identifier */
  writeString(view, 36, 'data');
  /* data chunk length */
  view.setUint32(40, numSamples * 2, true);

  // Write 16-bit PCM samples
  let offset = 44;
  for (let i = 0; i < numSamples; i++) {
    let s = Math.max(-1, Math.min(1, channelData[i]));
    s = s < 0 ? s * 0x8000 : s * 0x7FFF;
    view.setInt16(offset, s, true);
    offset += 2;
  }

  return buffer;
}

/**
 * Resamples any audio blob to exact 16kHz mono WAV and returns Base64 string
 */
async function resampleBlobToBase64Wav16k(audioBlob) {
  const arrayBuffer = await audioBlob.arrayBuffer();
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) {
    throw new Error("Web Audio API is not supported in this browser.");
  }

  const audioCtx = new AudioCtx();
  let decodedBuffer;
  try {
    decodedBuffer = await audioCtx.decodeAudioData(arrayBuffer);
  } finally {
    if (audioCtx.state !== 'closed') {
      audioCtx.close().catch(() => {});
    }
  }

  const targetSampleRate = 16000;
  const targetLength = Math.max(1, Math.ceil(decodedBuffer.duration * targetSampleRate));

  const OfflineAudioCtx = window.OfflineAudioContext || window.webkitOfflineAudioContext;
  const offlineCtx = new OfflineAudioCtx(1, targetLength, targetSampleRate);

  const source = offlineCtx.createBufferSource();
  source.buffer = decodedBuffer;
  source.connect(offlineCtx.destination);
  source.start(0);

  const renderedBuffer = await offlineCtx.startRendering();
  const wavArrayBuffer = audioBufferToWav16kHzMono(renderedBuffer);

  const bytes = new Uint8Array(wavArrayBuffer);
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export default function VoiceRecorder({
  onRecordingComplete,
  onRecordingStart,
  onRecordingCancel,
  isProcessing = false,
  isElderly = false,
  language = 'hi',
  languageName = 'Hindi',
  disabled = false,
  onNotify
}) {
  const [recorderState, setRecorderState] = useState('idle'); // 'idle' | 'recording' | 'converting'
  const [recordDuration, setRecordDuration] = useState(0);
  const [audioLevel, setAudioLevel] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const streamRef = useRef(null);
  const timerRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const animFrameRef = useRef(null);

  const cleanupRecording = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
    setAudioLevel(0);
  }, []);

  // Clean up resources on unmount
  useEffect(() => {
    return () => {
      cleanupRecording();
    };
  }, [cleanupRecording]);

  // Format mm:ss
  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Start 16kHz mono audio recording
  const startRecording = async () => {
    if (disabled || isProcessing) return;
    setErrorMessage('');
    audioChunksRef.current = [];

    try {
      // Request 16kHz mono audio stream
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          sampleRate: 16000,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });
      streamRef.current = stream;

      // Web Audio Analyser for live visual feedback
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        const audioCtx = new AudioCtx();
        audioContextRef.current = audioCtx;
        const source = audioCtx.createMediaStreamSource(stream);
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 64;
        analyser.smoothingTimeConstant = 0.8;
        source.connect(analyser);
        analyserRef.current = analyser;

        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        const updateVisualizer = () => {
          if (analyserRef.current) {
            analyserRef.current.getByteFrequencyData(dataArray);
            let sum = 0;
            for (let i = 0; i < dataArray.length; i++) {
              sum += dataArray[i];
            }
            const avg = sum / dataArray.length;
            setAudioLevel(Math.min(100, Math.round((avg / 128) * 100)));
            animFrameRef.current = requestAnimationFrame(updateVisualizer);
          }
        };
        updateVisualizer();
      }

      // Determine supported mimeType
      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : MediaRecorder.isTypeSupported('audio/webm')
        ? 'audio/webm'
        : MediaRecorder.isTypeSupported('audio/mp4')
        ? 'audio/mp4'
        : '';

      const mediaRecorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const duration = recordDuration;
        const rawBlob = new Blob(audioChunksRef.current, { type: mimeType || 'audio/webm' });
        cleanupRecording();

        if (rawBlob.size === 0) {
          setRecorderState('idle');
          setErrorMessage('No audio recorded. Please try speaking again.');
          return;
        }

        try {
          setRecorderState('converting');
          // Resample to exact 16kHz mono WAV and convert to Base64
          const base64Audio = await resampleBlobToBase64Wav16k(rawBlob);
          setRecorderState('idle');
          setRecordDuration(0);

          if (onRecordingComplete) {
            onRecordingComplete(base64Audio, duration);
          }
        } catch (convErr) {
          console.error('Audio conversion error:', convErr);
          setRecorderState('idle');
          setErrorMessage('Failed to encode 16kHz audio: ' + convErr.message);
          if (onNotify) {
            onNotify('Audio processing error. Please try again.', 'error');
          }
        }
      };

      mediaRecorder.start(200);
      setRecorderState('recording');
      setRecordDuration(0);

      timerRef.current = setInterval(() => {
        setRecordDuration((prev) => {
          // Auto stop at 60 seconds
          if (prev >= 60) {
            stopRecording();
            return prev;
          }
          return prev + 1;
        });
      }, 1000);

      if (onRecordingStart) onRecordingStart();
      if (onNotify) {
        onNotify(isElderly ? 'माइक चालू है, बोलिए…' : 'Microphone recording active. Speak naturally.', 'info');
      }

    } catch (err) {
      console.warn('Microphone permission or start error:', err);
      setRecorderState('idle');
      cleanupRecording();
      setErrorMessage('Microphone access is required. Please grant microphone permissions.');
      if (onNotify) {
        onNotify('Microphone access denied or unavailable.', 'warning');
      }
    }
  };

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
  };

  // Cancel recording
  const cancelRecording = () => {
    cleanupRecording();
    setRecorderState('idle');
    setRecordDuration(0);
    audioChunksRef.current = [];
    if (onRecordingCancel) onRecordingCancel();
    if (onNotify) onNotify('Recording cancelled.', 'info');
  };

  return (
    <div className={`voice-recorder-card ${isElderly ? 'is-elderly-mode' : ''}`}>
      {/* Visual Header / Indicator */}
      <div className="recorder-top-bar">
        <div className="recorder-engine-pill">
          <Activity size={13} />
          <span>16kHz Mono Indic Audio Capture</span>
        </div>
        <div className="recorder-lang-tag">
          <span>Language: <strong>{languageName} ({language})</strong></span>
        </div>
      </div>

      {/* Main Recording Center */}
      <div className="recorder-center-stage">
        {recorderState === 'idle' && !isProcessing && (
          <div className="recorder-action-prompt">
            <button
              type="button"
              className="recorder-mic-btn idle-mic"
              onClick={startRecording}
              disabled={disabled}
              aria-label={isElderly ? "बोलने के लिए माइक दबाएं" : "Click to Speak"}
            >
              <div className="mic-halo-glow"></div>
              <div className="mic-circle-inner">
                <Mic size={isElderly ? 52 : 44} />
              </div>
              <span className="mic-btn-caption">
                {isElderly ? "माइक दबाएं और बोलें" : "Tap to Speak"}
              </span>
            </button>
            <p className="recorder-hint-text">
              {isElderly
                ? "अपनी भाषा में अपनी परेशानी बताएं (छाती में दर्द, बुखार, पेट दर्द आदि)"
                : `Speak your clinical symptoms in ${languageName}. Bhashini & Groq dual-engine will transcribe in real-time.`}
            </p>
          </div>
        )}

        {recorderState === 'recording' && (
          <div className="recorder-active-prompt">
            {/* Live Audio Waves and Timer */}
            <div className="recorder-live-meter">
              <div className="meter-wave-bars">
                <span className="meter-bar" style={{ height: `${Math.max(14, audioLevel * 0.9)}%` }}></span>
                <span className="meter-bar" style={{ height: `${Math.max(22, audioLevel * 1.4)}%` }}></span>
                <span className="meter-bar" style={{ height: `${Math.max(30, audioLevel * 1.8)}%` }}></span>
                <span className="meter-bar" style={{ height: `${Math.max(18, audioLevel * 1.1)}%` }}></span>
                <span className="meter-bar" style={{ height: `${Math.max(26, audioLevel * 1.5)}%` }}></span>
                <span className="meter-bar" style={{ height: `${Math.max(12, audioLevel * 0.7)}%` }}></span>
              </div>
              <div className="meter-timer-pill">
                <span className="recording-live-dot"></span>
                <Clock size={15} />
                <span>{formatTimer(recordDuration)} / 01:00</span>
              </div>
            </div>

            {/* Stop & Cancel Controls */}
            <div className="recorder-btn-group">
              <button
                type="button"
                className="recorder-mic-btn active-recording-mic"
                onClick={stopRecording}
                aria-label="Finish Recording"
              >
                <div className="mic-stop-ring"></div>
                <div className="mic-circle-inner recording-pulse">
                  <Square size={isElderly ? 38 : 30} fill="currentColor" />
                </div>
                <span className="mic-btn-caption">
                  {isElderly ? "रोकें / पूरा करें" : "Finish Recording"}
                </span>
              </button>

              <button
                type="button"
                className="recorder-cancel-btn"
                onClick={cancelRecording}
                title="Cancel Recording"
                aria-label="Cancel Recording"
              >
                <RotateCcw size={16} />
                <span>Cancel</span>
              </button>
            </div>

            <p className="recorder-listening-text">
              {isElderly ? "माइक सुन रहा है… साफ आवाज में बोलें" : "Listening… Speak clearly into the microphone."}
            </p>
          </div>
        )}

        {(recorderState === 'converting' || isProcessing) && (
          <div className="recorder-processing-prompt">
            <div className="processing-rings-container">
              <div className="processing-spinner">
                <Sparkles size={34} className="pulse-sparkle" />
              </div>
            </div>
            <h4 className="processing-title">
              {recorderState === 'converting'
                ? "Encoding 16kHz High-Clarity Audio…"
                : "Dual-Engine Indic ASR & Gemini Normalization…"}
            </h4>
            <p className="processing-desc">
              Racing Bhashini ULCA against Groq Whisper fallback & preserving Ayurvedic/medical entities.
            </p>
          </div>
        )}

        {errorMessage && (
          <div className="recorder-error-alert" role="alert">
            <AlertCircle size={18} />
            <span>{errorMessage}</span>
          </div>
        )}
      </div>
    </div>
  );
}
