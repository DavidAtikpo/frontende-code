"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface AdPreviewProps {
  imageUrl: string;
  type: 'banner' | 'popup' | 'sidebar';
  location: string;
}

const PREVIEW_CONTAINERS = {
  banner: {
    width: 'w-full',
    height: 'h-24',
    position: 'relative',
    className: 'shadow-lg rounded-lg overflow-hidden'
  },
  popup: {
    width: 'w-96',
    height: 'h-96',
    position: 'fixed',
    className: 'shadow-2xl rounded-lg overflow-hidden'
  },
  sidebar: {
    width: 'w-64',
    height: 'h-screen',
    position: 'fixed',
    className: 'shadow-lg overflow-hidden'
  }
};

export default function AdPreview({ imageUrl, type, location }: AdPreviewProps) {
  const [isMounted, setIsMounted] = useState(false);
  const container = PREVIEW_CONTAINERS[type];

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <div className="border rounded-lg p-4 bg-gray-50">
      <h3 className="text-sm font-medium mb-4">
        Prévisualisation - {location} ({type})
      </h3>
      
      <div className="relative bg-white p-4 rounded-lg">
        <div className={`${container.width} ${container.height} ${container.className}`}>
          <div className="relative w-full h-full">
            <Image
              src={imageUrl}
              alt="Prévisualisation publicitaire"
              width={100}
              height={100}
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        </div>
      </div>
    </div>
  );
} 