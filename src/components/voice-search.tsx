// src/components/voice-search.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { Mic, MicOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface VoiceSearchProps {
  onTranscriptChanged: (transcript: string) => void;
}

export function VoiceSearch({ onTranscriptChanged }: VoiceSearchProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const { toast } = useToast();

  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = async () => {
        setIsProcessing(true);
        // In a real app, you would send this audioBlob to a speech-to-text API.
        // For this POC, we'll just use a placeholder transcript to trigger the agent.
        const placeholderTranscript = "a movie about a friendly robot";

        // Update the main search query
        onTranscriptChanged(placeholderTranscript);

        setIsProcessing(false);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
      toast({
        variant: "destructive",
        title: "Microphone Error",
        description: "Could not access the microphone. Please check permissions.",
      });
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      handleStopRecording();
    } else {
      handleStartRecording();
    }
  };

  return (
    <Button
      onClick={toggleRecording}
      size="icon"
      className="h-12 w-12"
      disabled={isProcessing}
      type="button"
    >
      {isRecording ? (
        <MicOff />
      ) : isProcessing ? (
        <Loader2 className="animate-spin" />
      ) : (
        <Mic />
      )}
      <span className="sr-only">Toggle Voice Search</span>
    </Button>
  );
}
