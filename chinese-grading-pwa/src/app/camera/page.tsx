"use client";

import { useEffect, useRef, useState } from "react";
import { X, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CameraPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const router = useRouter();
  
  const [isGrading, setIsGrading] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function setupCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
        });

        if (!isMounted) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
        alert("Failed to access camera. Please grant camera permissions.");
      }
    }

    setupCamera();

    return () => {
      isMounted = false;
      stopCamera();
    };
  }, []);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current && videoRef.current.srcObject) {
      const mediaStream = videoRef.current.srcObject as MediaStream;
      mediaStream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  const handleClose = () => {
    stopCamera();
    router.push("/");
  };

  const takePhoto = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    setIsGrading(true); 

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const context = canvas.getContext("2d");
    if (!context) return;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(async (blob) => {
      if (!blob) {
        alert("Failed to capture photo.");
        setIsGrading(false);
        return;
      }

      const formData = new FormData();
      formData.append("file", blob, "worksheet.jpg");

      try {
        const res = await fetch("/api/grade", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "An error occurred during the grading process.");
        }

        stopCamera();
        router.push(`/results/${data.submissionId}`);

      } catch (error: any) {
        console.error(error);
        alert("Error: " + error.message);
        setIsGrading(false);
      }
    }, "image/jpeg", 0.8);
  };

  return (
    <div className="min-h-screen bg-black relative flex flex-col justify-center items-center overflow-hidden">
      
      
      {isGrading && (
        <div className="absolute inset-0 z-50 bg-black/80 flex flex-col items-center justify-center">
          <Loader2 className="w-12 h-12 text-white animate-spin mb-4" />
          <p className="text-white font-medium text-lg">AI is grading...</p>
          <p className="text-gray-400 text-sm mt-2">Please wait a moment</p>
        </div>
      )}

      <div className="absolute top-0 left-0 right-0 p-5 flex justify-between items-center z-10 mt-4">
        <button onClick={handleClose} disabled={isGrading} className="w-10 h-10 bg-black/50 rounded-full flex items-center justify-center text-white disabled:opacity-50">
          <X className="w-6 h-6" />
        </button>
        <span className="text-white text-sm font-medium bg-black/50 px-4 py-2 rounded-full">
          Align Worksheet
        </span>
        <div className="w-10" />
      </div>

      
      <video ref={videoRef} autoPlay playsInline className="absolute inset-0 w-full h-full object-cover" />
      
      
      <canvas ref={canvasRef} className="hidden" />

      <div className="relative w-[85%] max-w-sm aspect-[3/4] border-2 border-transparent z-10">
        <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-white rounded-tl-lg"></div>
        <div className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-white rounded-tr-lg"></div>
        <div className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-white rounded-bl-lg"></div>
        <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-white rounded-br-lg"></div>
      </div>

      <div className="absolute bottom-32 z-10 text-center w-full">
        <p className="text-white text-sm font-medium drop-shadow-md bg-black/30 inline-block px-4 py-1 rounded-full">
          Keep page flat and inside the brackets
        </p>
      </div>

      <div className="absolute bottom-8 z-10 w-full flex justify-center">
        <button 
          onClick={takePhoto}
          disabled={isGrading}
          className="w-16 h-16 rounded-full border-4 border-white flex items-center justify-center active:scale-95 transition-transform disabled:opacity-50"
        >
          <div className="w-12 h-12 bg-white rounded-full"></div>
        </button>
      </div>
    </div>
  );
}