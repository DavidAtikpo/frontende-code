"use client";

import { useDropzone } from "react-dropzone";
import { X } from "lucide-react";
import Image from "next/image";

interface ImageUploadProps {
  value: string[];
  onChange: (files: FileList) => void;
  maxFiles?: number;
}

export function ImageUpload({ value, onChange, maxFiles = 5 }: ImageUploadProps) {
  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp']
    },
    maxFiles,
    onDrop: (acceptedFiles) => {
      const fileList = new DataTransfer();
      acceptedFiles.forEach(file => fileList.items.add(file));
      onChange(fileList.files);
    }
  });

  const handleRemove = (index: number) => {
    const fileList = new DataTransfer();
    value.forEach((url, i) => {
      if (i !== index) {
        fetch(url)
          .then(res => res.blob())
          .then(blob => {
            const file = new File([blob], `image-${i}.jpg`, { type: 'image/jpeg' });
            fileList.items.add(file);
          });
      }
    });
    onChange(fileList.files);
  };

  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-4">
        {value.map((url, index) => (
          <div key={index} className="relative w-24 h-24">
            <Image
              src={url}
              alt="Image"
              className="object-cover rounded-lg"
              width={96}
              height={96}
              style={{ width: '100%', height: '100%' }}
            />
            <button
              type="button"
              onClick={() => handleRemove(index)}
              className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1"
            >
              <X className="h-4 w-4 text-white" />
            </button>
          </div>
        ))}
      </div>
      
      <div
        {...getRootProps()}
        className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-gray-400 transition"
      >
        <input {...getInputProps()} />
        <p>Glissez des images ici ou cliquez pour sélectionner</p>
        <p className="text-sm text-gray-500">
          {maxFiles} images maximum • PNG, JPG, JPEG jusqu'à 5MB
        </p>
      </div>
    </div>
  );
} 