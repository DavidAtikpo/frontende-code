"use client";

export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center w-full p-8">
      <div className="relative">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-[#1D4ED8] border-t-transparent"></div>
        <div className="h-16 w-16 animate-ping absolute inset-0 rounded-full border-4 border-solid border-[#1D4ED8] opacity-20"></div>
      </div>
    </div>
  );
} 