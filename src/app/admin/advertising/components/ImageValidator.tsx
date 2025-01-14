"use client";

import { useEffect, useState } from "react";

interface ImageValidatorProps {
  file: File;
  type: string;
  onValidation: (isValid: boolean) => void;
}

export default function ImageValidator({ file, type, onValidation }: ImageValidatorProps) {
  const [validating, setValidating] = useState(true);
  const [error] = useState<string | null>(null);

  useEffect(() => {
    const validateImage = async () => {
      const img = new Image();
      const objectUrl = URL.createObjectURL(file);
      
      img.onload = () => {
        URL.revokeObjectURL(objectUrl);
        const isValid = validateDimensions(img.width, img.height, type);
        onValidation(isValid);
        setValidating(false);
      };
      
      img.src = objectUrl;
    };

    validateImage();
  }, [file, type, onValidation]);

  return (
    <div className="text-sm">
      {validating ? (
        <p>Validation de l'image...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <p className="text-green-500">Image valide</p>
      )}
    </div>
  );
}

function validateDimensions(width: number, height: number, type: string): boolean {
  const ratios = {
    banner: 6,
    popup: 1,
    sidebar: 0.33
  };
  
  const ratio = width / height;
  const expectedRatio = ratios[type as keyof typeof ratios];
  
  return Math.abs(ratio - expectedRatio) < 0.1;
} 