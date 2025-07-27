"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Camera, Loader2, Microscope, Sparkles, AlertCircle, CheckCircle, CircleDotDashed, Upload, X } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { analyzeFoodSafety, AnalyzeFoodSafetyOutput } from "@/ai/flows/analyze-food-safety";
import { Progress } from "@/components/ui/progress";
import Image from "next/image";

export default function FoodSafetyPage() {
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalyzeFoodSafetyOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  useEffect(() => {
    if (uploadedImage) return; // Don't activate camera if an image is uploaded

    const getCameraPermission = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setHasCameraPermission(true);
      } catch (error) {
        console.error("Error accessing camera:", error);
        setHasCameraPermission(false);
        toast({
          variant: "destructive",
          title: "Camera Access Denied",
          description: "Please enable camera permissions in your browser settings.",
        });
      }
    };
    getCameraPermission();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [toast, uploadedImage]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
        setAnalysisResult(null);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    setLoading(true);
    setError(null);
    setAnalysisResult(null);

    let photoDataUri: string | undefined;

    if (uploadedImage) {
      photoDataUri = uploadedImage;
    } else if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext("2d");
      context?.drawImage(video, 0, 0, canvas.width, canvas.height);
      photoDataUri = canvas.toDataURL("image/jpeg");
    }

    if (!photoDataUri) {
      setError("Could not get an image to analyze.");
      setLoading(false);
      return;
    }

    try {
      const result = await analyzeFoodSafety({ photoDataUri });
      setAnalysisResult(result);
    } catch (e: any) {
      console.error("Analysis failed:", e);
      setError("AI analysis failed. Please try again.");
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: e.message || "An unknown error occurred.",
      });
    } finally {
      setLoading(false);
    }
  };

  const isAnalyzeDisabled = loading || (!uploadedImage && !hasCameraPermission);

  return (
    <div className="container py-12 space-y-12">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">
          Visual Food Safety Check
        </h1>
        <p className="mt-2 text-lg text-foreground/80 max-w-2xl mx-auto">
          Use your camera or upload a photo to get an AI analysis of your food's freshness, quantity, and hygiene.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <Card>
          <CardHeader>
            <CardTitle>Capture or Upload Image</CardTitle>
            <CardDescription>Point your camera at ingredients or upload a photo.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative aspect-video w-full bg-secondary rounded-lg overflow-hidden border">
              {uploadedImage ? (
                <>
                  <Image src={uploadedImage} alt="Uploaded food" layout="fill" objectFit="cover" />
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 h-8 w-8 rounded-full z-10"
                    onClick={() => {
                      setUploadedImage(null);
                      if(fileInputRef.current) fileInputRef.current.value = "";
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </>
              ) : (
                <>
                  <video
                    ref={videoRef}
                    className="w-full h-full object-cover"
                    autoPlay
                    muted
                    playsInline
                  />
                  <canvas ref={canvasRef} className="hidden" />
                  {hasCameraPermission === false && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 text-center p-4">
                      <Alert variant="destructive" className="max-w-sm">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Camera Access Required</AlertTitle>
                        <AlertDescription>
                          Please allow camera access in your browser to use this feature.
                        </AlertDescription>
                      </Alert>
                    </div>
                  )}
                  {hasCameraPermission === null && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 text-center p-4">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      <p className="mt-4 text-muted-foreground">Requesting camera access...</p>
                    </div>
                  )}
                </>
              )}
            </div>
            
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept="image/*"
            />
            
            <div className="grid grid-cols-2 gap-4 mt-6">
                <Button onClick={() => fileInputRef.current?.click()} variant="outline" size="lg">
                    <Upload className="mr-2 h-5 w-5" />
                    Upload Photo
                </Button>
                 <Button onClick={handleAnalyze} disabled={isAnalyzeDisabled} size="lg">
                  {loading ? (
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  ) : (
                    <Microscope className="mr-2 h-5 w-5" />
                  )}
                  Analyze Food
                </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:sticky lg:top-24">
          <CardHeader>
            <CardTitle>AI Analysis Results</CardTitle>
            <CardDescription>The AI's assessment will appear below.</CardDescription>
          </CardHeader>
          <CardContent className="min-h-[24rem] flex items-center justify-center">
            {loading && (
              <div className="flex flex-col items-center text-primary gap-4">
                <Sparkles className="h-12 w-12" />
                <p className="font-medium text-muted-foreground">AI is inspecting your items...</p>
              </div>
            )}
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Analysis Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {analysisResult && (
              <div className="space-y-6 w-full">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    {analysisResult.spoilage.detected ? (
                      <AlertCircle className="h-6 w-6 text-destructive" />
                    ) : (
                      <CheckCircle className="h-6 w-6 text-green-500" />
                    )}
                    <h3 className="text-lg font-semibold">Spoilage Check</h3>
                  </div>
                  <p className="text-muted-foreground">{analysisResult.spoilage.assessment}</p>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <CircleDotDashed className="h-6 w-6 text-primary" />
                    <h3 className="text-lg font-semibold">Quantity Estimation</h3>
                  </div>
                  <p className="text-muted-foreground">{analysisResult.quantity.estimation}</p>
                </div>

                <div>
                  <div className="text-lg font-semibold mb-2">
                    <div className="flex justify-between items-center mb-1">
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-6 w-6 text-primary" />
                        <h3>Hygiene Score</h3>
                      </div>
                      <span className="font-bold text-primary">{analysisResult.hygiene.score}/100</span>
                    </div>
                    <Progress value={analysisResult.hygiene.score} className="h-2" />
                  </div>
                  <p className="text-muted-foreground">{analysisResult.hygiene.assessment}</p>
                </div>
              </div>
            )}
            {!analysisResult && !loading && !error && (
              <div className="text-center text-muted-foreground p-8">
                <Camera className="h-12 w-12 mx-auto mb-4 opacity-30" />
                <p>Point, shoot, and let AI do the rest.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
