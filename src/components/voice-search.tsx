"use client";

import { useState, useRef, useEffect } from "react";
import { Mic, MicOff, Loader2, Bot, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getSpeech, searchContent } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { ContentCard } from "./content-card";
import type { Content } from "@/types";

export function VoiceSearch() {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [transcript, setTranscript] = useState("");
  const [searchResults, setSearchResults] = useState<Content[]>([]);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const { toast } = useToast();

  useEffect(() => {
    if (audioUrl && audioRef.current) {
      audioRef.current.play();
    }
  }, [audioUrl]);

  const resetState = () => {
    setTranscript("");
    setAudioUrl(null);
    setSearchResults([]);
    setIsProcessing(false);
    setIsRecording(false);
  };

  const handleStartRecording = async () => {
    resetState();
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = async () => {
        setIsProcessing(true);
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        
        // In a real app, you would send this audioBlob to a speech-to-text API.
        // For this POC, we'll just use a placeholder transcript to trigger the agent.
        const placeholderTranscript = "Show me movies like The Matrix.";
        setTranscript(placeholderTranscript);

        // 1. Get text response from agent
        const searchResult = await searchContent({ query: placeholderTranscript });

        if (searchResult.success && searchResult.data) {
          setSearchResults(searchResult.data as Content[]);
        } else {
           toast({
            variant: "destructive",
            title: "Search Error",
            description: searchResult.error || "Could not fetch search results.",
          });
        }

        // 2. Get audio response
        const speechResult = await getSpeech(
          `I found a few results for: ${placeholderTranscript}`
        );
        
        if (speechResult.success && speechResult.data) {
          setAudioUrl(speechResult.data);
        } else {
          toast({
            variant: "destructive",
            title: "Speech Generation Error",
            description: speechResult.error,
          });
        }
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
    <section id="voice-search" className="space-y-8">
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
          disabled={isProcessing}
        >
          {isRecording ? (
            <MicOff className="w-8 h-8" />
          ) : isProcessing ? (
            <Loader2 className="w-8 h-8 animate-spin" />
          ) : (
            <Mic className="w-8 h-8" />
          )}
        </Button>
        {isProcessing && !isRecording && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="animate-spin" />
            <span>Thinking...</span>
          </div>
        )}
      </div>

      {transcript && (
         <Card className="max-w-4xl mx-auto">
          <CardContent className="p-4 space-y-4">
             <div className="flex items-center justify-center gap-2 font-medium">
                <Search className="text-primary"/>
                <span>Your query: &quot;{transcript}&quot;</span>
            </div>

            {audioUrl && (
              <div className="flex flex-col items-center justify-center gap-4 border-t pt-4">
                 <div className="flex items-center gap-2 font-medium">
                    <Bot className="text-primary"/>
                    <span>Agent Response:</span>
                </div>
                <audio ref={audioRef} src={audioUrl} controls className="w-full max-w-md" />
              </div>
            )}
           </CardContent>
         </Card>
      )}

      {searchResults.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {searchResults.map((content) => (
            <ContentCard key={content.id} content={content} />
          ))}
        </div>
      )}
    </section>
  );
}
