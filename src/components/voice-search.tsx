"use client";

import { useState, useRef, useEffect } from "react";
import { Mic, MicOff, Loader2, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getSpeech } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";

export function VoiceSearch() {
  const [isRecording, setIsRecording] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [transcript, setTranscript] = useState("");
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const { toast } = useToast();

  useEffect(() => {
    if (audioUrl && audioRef.current) {
      audioRef.current.play();
    }
  }, [audioUrl]);

  const handleStartRecording = async () => {
    setTranscript("");
    setAudioUrl(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        // In a real app, you would send this audioBlob to a speech-to-text API.
        // For this POC, we'll just use a placeholder transcript.
        const placeholderTranscript = "Show me movies like The Matrix.";
        setTranscript(placeholderTranscript);
        setIsGenerating(true);
        const result = await getSpeech(`Searching for: ${placeholderTranscript}`);
        setIsGenerating(false);
        if (result.success && result.data) {
          setAudioUrl(result.data);
        } else {
          toast({
            variant: "destructive",
            title: "Speech Generation Error",
            description: result.error,
          });
        }
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
    <section id="voice-search" className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tight font-headline">
          Or, Just Ask
        </h2>
        <p className="mt-2 text-lg text-muted-foreground">
          Press the button and speak to find content with your voice.
        </p>
      </div>
      <div className="flex flex-col items-center gap-4">
        <Button
          onClick={toggleRecording}
          size="lg"
          className="rounded-full w-20 h-20"
          disabled={isGenerating}
        >
          {isRecording ? (
            <MicOff className="w-8 h-8" />
          ) : (
            <Mic className="w-8 h-8" />
          )}
        </Button>
        {isGenerating && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="animate-spin" />
            <span>Thinking...</span>
          </div>
        )}
      </div>

      {(transcript || audioUrl) && (
        <Card className="max-w-2xl mx-auto">
          <CardContent className="p-4">
            {transcript && (
              <p className="text-center text-muted-foreground">
                You said: &quot;{transcript}&quot;
              </p>
            )}
            {audioUrl && (
              <div className="mt-4 flex flex-col items-center justify-center gap-4">
                 <div className="flex items-center gap-2 font-medium">
                    <Bot className="text-primary"/>
                    <span>Agent Response:</span>
                </div>
                <audio ref={audioRef} src={audioUrl} controls className="w-full" />
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </section>
  );
}
