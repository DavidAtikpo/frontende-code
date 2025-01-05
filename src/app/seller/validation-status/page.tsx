"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ValidationStatusForm } from "@/app/seller/onboarding/components/ValidationStatusForm";

export default function ValidationStatusPage() {
  const router = useRouter();

  const handleNext = () => {
    // Define what should happen on next
  };

  const handleBack = () => {
    // Navigate to the user dashboard
    router.push('/user/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <ValidationStatusForm onNext={handleNext} onBack={handleBack} />
      </div>
    </div>
  );
} 