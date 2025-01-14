"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, X } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

interface ImageDropzoneProps {
  onImagesChange: (files: File[]) => void;
  maxFiles?: number;
  acceptedTypes?: string[];
  maxSize?: number;
}

export default function ImageDropzone({
  onImagesChange,
  maxFiles = 1,
  acceptedTypes = ["image/jpeg", "image/png", "image/gif"],
  maxSize = 5242880 // 5MB
}: ImageDropzoneProps) {
  const { toast } = useToast();
  const [previews, setPreviews] = useState<string[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    // Vérification des dimensions selon le type de publicité
    acceptedFiles.forEach(file => {
      const img = document.createElement('img');
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        // Exemple de validation pour une bannière
        if (img.width < 728 || img.height < 90) {
          toast({
            title: "Erreur",
            description: "L'image doit être au minimum de 728x90px pour une bannière",
            variant: "destructive"
          });
          return;
        }
      };
    });

    // Mise à jour des prévisualisations
    const newPreviews = acceptedFiles.map(file => URL.createObjectURL(file));
    setPreviews(prev => [...prev, ...newPreviews]);
    onImagesChange(acceptedFiles);
  }, [onImagesChange, toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': acceptedTypes
    },
    maxFiles,
    maxSize
  });

  const removeImage = (index: number) => {
    setPreviews(prev => prev.filter((_, i) => i !== index));
    onImagesChange([]);
  };

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-primary bg-primary/10' : 'border-gray-300 hover:border-primary'}`}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto h-12 w-12 text-gray-400" />
        <div className="mt-4">
          {isDragActive ? (
            <p className="text-sm text-gray-600">Déposez les fichiers ici...</p>
          ) : (
            <div className="space-y-1">
              <p className="text-sm text-gray-600">
                Glissez-déposez vos images ici, ou cliquez pour sélectionner
              </p>
              <p className="text-xs text-gray-500">
                PNG, JPG ou GIF jusqu'à {maxSize / 1024 / 1024}MB
              </p>
            </div>
          )}
        </div>
      </div>

      {previews.length > 0 && (
        <div className="grid grid-cols-2 gap-4">
          {previews.map((preview, index) => (
            <div key={index} className="relative group">
              <Image
                src={preview}
                alt={`Preview ${index + 1}`}
                width={300}
                height={200}
                className="rounded-lg object-cover w-full h-40"
              />
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => removeImage(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 