'use client';

import { useState, useRef, useEffect, useCallback } from 'react';

interface UseMicrophoneReturn {
  isListening: boolean;
  isSupported: boolean;
  permissionGranted: boolean | null;
  startListening: () => Promise<void>;
  stopListening: () => void;
  error: string | null;
}

export function useMicrophone(
  onTranscript: (text: string) => void
): UseMicrophoneReturn {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    // Check if Speech Recognition API is available
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
      setIsSupported(!!SpeechRecognition);

      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
          setIsListening(true);
          setError(null);
        };

        recognition.onresult = (event: SpeechRecognitionEvent) => {
          const transcript = Array.from(event.results)
            .map((result) => result[0].transcript)
            .join('');
          onTranscript(transcript);
        };

        recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
          // Handle different error types appropriately
          if (event.error === 'not-allowed') {
            console.error('Speech recognition error: Microphone permission denied');
            setError('Microphone permission denied. Please enable microphone access in your browser settings.');
            setPermissionGranted(false);
            setIsListening(false);
          } else if (event.error === 'no-speech') {
            // "no-speech" is expected when user doesn't speak - don't log as error
            // Just stop listening silently
            setIsListening(false);
            setError(null);
          } else if (event.error === 'aborted') {
            // User stopped manually or recognition was aborted - don't show error
            setIsListening(false);
            setError(null);
          } else if (event.error === 'network') {
            console.error('Speech recognition error: Network error');
            setError('Network error. Please check your connection and try again.');
            setIsListening(false);
          } else if (event.error === 'audio-capture') {
            console.error('Speech recognition error: No microphone found');
            setError('No microphone found. Please connect a microphone and try again.');
            setIsListening(false);
          } else {
            // Other errors - log as warning but don't show to user unless critical
            console.warn('Speech recognition warning:', event.error);
            setIsListening(false);
            setError(null);
          }
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [onTranscript]);

  const requestPermission = useCallback(async (): Promise<boolean> => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop()); // Stop the stream immediately
      setPermissionGranted(true);
      return true;
    } catch (err: any) {
      console.error('Microphone permission error:', err);
      setPermissionGranted(false);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setError('Microphone permission denied. Please enable microphone access in your browser settings.');
      } else {
        setError('Failed to access microphone. Please check your browser settings.');
      }
      return false;
    }
  }, []);

  const startListening = useCallback(async () => {
    if (!isSupported) {
      setError('Speech recognition is not supported in your browser. Please use Chrome, Edge, or Safari.');
      return;
    }

    if (!recognitionRef.current) {
      setError('Speech recognition not initialized.');
      return;
    }

    // Check permission first
    if (permissionGranted === null || permissionGranted === false) {
      const granted = await requestPermission();
      if (!granted) {
        return;
      }
    }

    try {
      recognitionRef.current.start();
    } catch (err: any) {
      if (err.name === 'InvalidStateError') {
        // Already started, ignore
        return;
      }
      console.error('Error starting speech recognition:', err);
      setError('Failed to start speech recognition. Please try again.');
      setIsListening(false);
    }
  }, [isSupported, permissionGranted, requestPermission]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  }, [isListening]);

  return {
    isListening,
    isSupported,
    permissionGranted,
    startListening,
    stopListening,
    error,
  };
}

