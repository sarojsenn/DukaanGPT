
"use client";

import { useRef } from "react";
import { useCamera } from "@/hooks/use-camera";
import { Button } from "@/components/ui/button";
import { AlertCircle, Video, Camera as CameraIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface CameraCaptureProps {
  onCapture: (imageDataUri: string) => void;
}

export function CameraCapture({ onCapture }: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { hasPermission, isLoading, error } = useCamera(videoRef);

  const handleCapture = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext("2d");
    if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUri = canvas.toDataURL("image/jpeg");
        onCapture(dataUri);
    }
  };

  return (
    <div className="space-y-4">
        <div className="relative aspect-video w-full bg-secondary rounded-lg overflow-hidden border">
            <video
            ref={videoRef}
            className="w-full h-full object-cover"
            autoPlay
            muted
            playsInline
            />
            <canvas ref={canvasRef} className="hidden" />
            {isLoading && (
                 <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 text-center p-4">
                     <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                     <p className="mt-4 text-muted-foreground">Requesting camera access...</p>
                </div>
            )}
            {!isLoading && !hasPermission && (
                 <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 text-center p-4">
                     <Alert variant="destructive" className="max-w-sm">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>{error?.title || 'Camera Access Required'}</AlertTitle>
                        <AlertDescription>
                           {error?.description || 'Please allow camera access in your browser to use this feature.'}
                        </AlertDescription>
                    </Alert>
                </div>
            )}
             {!isLoading && hasPermission === null && !error && (
                 <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 text-center p-4">
                     <Video className="h-12 w-12 text-muted-foreground" />
                     <p className="mt-4 text-muted-foreground">Waiting for camera...</p>
                 </div>
             )}
        </div>
        <Button onClick={handleCapture} disabled={!hasPermission} size="lg" className="w-full">
            <CameraIcon className="mr-2 h-5 w-5" />
            Capture Photo
        </Button>
    </div>
  );
}
