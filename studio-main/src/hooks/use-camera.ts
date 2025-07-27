
"use client";

import { useState, useEffect, RefObject } from "react";
import { useToast } from "@/hooks/use-toast";

interface CameraError {
    title: string;
    description: string;
}

export function useCamera(videoRef: RefObject<HTMLVideoElement>) {
  const { toast } = useToast();
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<CameraError | null>(null);

  useEffect(() => {
    const getCameraPermission = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setHasPermission(true);
      } catch (err) {
        console.error("Error accessing camera:", err);
        setHasPermission(false);
        const cameraError = {
             title: "Camera Access Denied",
             description: "Please enable camera permissions in your browser settings to use this feature."
        };
        setError(cameraError);
        toast({
          variant: "destructive",
          title: cameraError.title,
          description: cameraError.description,
        });
      } finally {
        setIsLoading(false);
      }
    };

    getCameraPermission();

    // Cleanup function to stop the camera stream when the component unmounts
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 

  return { hasPermission, isLoading, error };
}
