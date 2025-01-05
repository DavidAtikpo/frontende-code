"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Camera, Video, X } from "lucide-react";
import { SellerFormData } from "../page";


interface VideoVerificationFormProps {
  data: SellerFormData;
  onUpdate: (data: SellerFormData) => void;
  onNext: () => void;
  onBack: () => void;
}

interface StoredVideo {
  blob: Blob;
  url: string;
  completed: boolean;
}

export function VideoVerificationForm({ data, onUpdate, onNext, onBack }: VideoVerificationFormProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState("");
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);



  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
        console.log(err);
        
      setError("Impossible d'accéder à la caméra. Veuillez vérifier vos permissions.");
    }
  };

  const startRecording = () => {
    if (!stream) return;

    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;
    chunksRef.current = [];

    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        chunksRef.current.push(e.data);
      }
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: "video/webm" });
      const url = URL.createObjectURL(blob);
      handleRecordingComplete(blob);
    };

    mediaRecorder.start();
    setIsRecording(true);
    setTimeout(() => stopRecording(), 30000); // 30 secondes max
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      const blob = new Blob(chunksRef.current, { type: 'video/webm' });
      handleRecordingComplete(blob);
    }
  };

  const resetRecording = () => {
    if (data.videoVerification.recordingUrl) {
      URL.revokeObjectURL(data.videoVerification.recordingUrl);
    }
    onUpdate({
      ...data,
      videoVerification: {
        completed: false,
        recordingBlob: undefined,
        recordingUrl: undefined
      }
    });
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const saveToLocalStorage = (updatedData: SellerFormData) => {
    const dataToSave = {
      ...updatedData,
      videoVerification: {
        completed: updatedData.videoVerification.completed,
        recordingUrl: updatedData.videoVerification.recordingUrl
      }
    };
    localStorage.setItem('sellerFormData', JSON.stringify(dataToSave));
  };

  const handleRecordingComplete = (blob: Blob) => {
    const updatedData = {
      ...data,
      videoVerification: {
        completed: true,
        recordingBlob: blob,
        recordingUrl: URL.createObjectURL(blob)
      }
    };
    onUpdate(updatedData);
    saveToLocalStorage(updatedData);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (data.videoVerification.completed) {
      saveToLocalStorage(data);
      onNext();
    } else {
      setError("Veuillez compléter la vérification vidéo");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="font-medium mb-2">Instructions pour la vérification vidéo :</h3>
          <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600">
            <li>Assurez-vous d&apos;être dans un endroit bien éclairé</li>
            <li>Présentez votre pièce d&apos;identité face caméra</li>
            <li>Montrez le contrat signé</li>
            <li>La session sera enregistrée pour vérification</li>
          </ol>
        </div>

        <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden relative">
          {!stream && !data.videoVerification.recordingUrl && (
            <Button
              type="button"
              onClick={startCamera}
              className="absolute inset-0 w-full h-full flex items-center justify-center"
            >
              <Camera className="h-8 w-8 mr-2" />
              Démarrer la caméra
            </Button>
          )}
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className={`w-full h-full ${!stream && 'hidden'}`}
          />
          {data.videoVerification.recordingUrl && (
            <video
              src={data.videoVerification.recordingUrl}
              controls
              className="w-full h-full"
            />
          )}
        </div>

        <div className="flex justify-center space-x-4">
          {stream && !isRecording && !data.videoVerification.completed && (
            <Button
              type="button"
              onClick={startRecording}
              className="bg-red-500 hover:bg-red-600"
            >
              <Video className="h-4 w-4 mr-2" />
              Commencer l&apos;enregistrement
            </Button>
          )}
          {isRecording && (
            <Button
              type="button"
              onClick={stopRecording}
              variant="destructive"
            >
              <X className="h-4 w-4 mr-2" />
              Arrêter l&apos;enregistrement
            </Button>
          )}
          {data.videoVerification.completed && (
            <Button
              type="button"
              variant="outline"
              onClick={resetRecording}
            >
              Recommencer
            </Button>
          )}
        </div>

        {error && <p className="text-sm text-red-500 text-center">{error}</p>}
      </div>

      <div className="flex justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
        >
          Retour
        </Button>
        <Button
          type="submit"
          className="bg-[#1D4ED8] hover:bg-[#1e40af]"
          disabled={!data.videoVerification.completed}
        >
          Suivant
        </Button>
      </div>
    </form>
  );
} 