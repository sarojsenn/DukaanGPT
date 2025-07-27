"use client";

import { useState, useEffect, useRef } from "react";
import { processVoiceOrder, ProcessVoiceOrderOutput } from "@/ai/flows/process-voice-order";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Mic, FileAudio, Square, Play } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const toDataURI = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

export default function VoiceOrderPage() {
  const [file, setFile] = useState<File | null>(null);
  const [language, setLanguage] = useState("Hindi");
  const [data, setData] = useState<ProcessVoiceOrderOutput | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [running, setRunning] = useState(false);

  // Real-time recording state
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const { toast } = useToast();


  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const selectedFile = event.target.files[0];
      setFile(selectedFile);
      setAudioBlob(selectedFile);
      setAudioUrl(URL.createObjectURL(selectedFile));
      setData(null);
      setError(null);
    }
  };

  const startRecording = async () => {
    setError(null);
    setData(null);
    setAudioBlob(null);
    setAudioUrl(null);
    setFile(null);

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream);
            audioChunksRef.current = [];

            mediaRecorderRef.current.ondataavailable = (event) => {
                audioChunksRef.current.push(event.data);
            };

            mediaRecorderRef.current.onstop = () => {
                const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                setAudioBlob(blob);
                const url = URL.createObjectURL(blob);
                setAudioUrl(url);
            };

            mediaRecorderRef.current.start();
            setIsRecording(true);
             toast({ title: "Recording started..." });
        } catch (err) {
            console.error("Error accessing microphone:", err);
            setError(new Error("Could not access microphone. Please check permissions."));
            toast({ variant: "destructive", title: "Microphone Error", description: "Could not access microphone. Please check browser permissions." });
        }
    } else {
        setError(new Error("Your browser does not support audio recording."));
        toast({ variant: "destructive", title: "Unsupported Browser", description: "Your browser does not support audio recording." });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
        // Stop all media tracks to turn off the microphone indicator
        mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
        setIsRecording(false);
        toast({ title: "Recording stopped." });
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!audioBlob) {
      setError(new Error("Please record or upload an audio file first."));
      return;
    }
    setRunning(true);
    setData(null);
    setError(null);
    try {
      const voiceDataUri = await toDataURI(audioBlob);
      const result = await processVoiceOrder({ voiceDataUri, language });
      setData(result);
    } catch (e: any) {
      setError(e);
      toast({ variant: "destructive", title: "Processing Failed", description: e.message });
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="container py-12 space-y-12">
       <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">
          Voice Order Processing
        </h1>
        <p className="mt-2 text-lg text-foreground/80 max-w-2xl mx-auto">
          Record your order in any language or upload a voice note.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Place Your Voice Order</CardTitle>
            <CardDescription>
              Record your order or upload an audio file.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                    <Label>Option 1: Record Your Order</Label>
                    <div className="flex items-center justify-center gap-4 p-4 bg-secondary rounded-lg border">
                       <Button type="button" onClick={startRecording} disabled={isRecording} size="lg" variant="outline">
                           <Mic className="mr-2"/>
                           Start Recording
                       </Button>
                       <Button type="button" onClick={stopRecording} disabled={!isRecording} size="lg" variant="destructive">
                           <Square className="mr-2"/>
                           Stop
                       </Button>
                    </div>
                </div>

                 <div className="relative flex items-center justify-center py-2">
                    <div className="flex-grow border-t border-muted-foreground/20"></div>
                    <span className="flex-shrink mx-4 text-muted-foreground text-xs">OR</span>
                    <div className="flex-grow border-t border-muted-foreground/20"></div>
                </div>

              <div className="space-y-2">
                <Label htmlFor="audio-file">Option 2: Upload an Audio File</Label>
                 <Input
                    id="audio-file"
                    type="file"
                    accept="audio/*"
                    onChange={handleFileChange}
                    className="w-full"
                    disabled={isRecording}
                />
                 {file && <p className="text-sm text-muted-foreground">Selected: {file.name}</p>}
              </div>

               {audioUrl && (
                <div className="space-y-2">
                    <Label>Your Order Recording</Label>
                    <audio src={audioUrl} controls className="w-full" />
                </div>
               )}

              <div className="space-y-2">
                <Label htmlFor="language">Language of Order</Label>
                <Input
                  id="language"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  placeholder="e.g., Hindi, Tamil"
                />
              </div>

              <Button
                type="submit"
                disabled={running || (!audioBlob && !file)}
                className="w-full"
                size="lg"
              >
                {running ? (
                  <>
                    <div className="mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <Play className="mr-2" />
                    Process Order
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Structured Order</CardTitle>
            <CardDescription>
              This is what our AI understood from your voice order.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {running && (
                <div className="flex items-center justify-center p-8">
                  <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
              {error && (
                <div className="text-destructive p-4 bg-destructive/10 rounded-md">
                  <p className="font-bold">An error occurred:</p>
                  <p className="text-sm">{error.message}</p>
                </div>
              )}
              {data && (
                <Textarea
                  readOnly
                  value={data.structuredOrder}
                  className="min-h-[200px] bg-muted"
                  rows={8}
                />
              )}
              {!data && !running && !error && (
                <div className="text-center text-muted-foreground py-10 flex flex-col items-center justify-center">
                  <FileAudio className="w-10 h-10 mb-4 text-muted-foreground/50"/>
                  <p>Your processed order will appear here.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
