"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

interface ValidationStatusFormProps {
  onNext: () => void;
  onBack: () => void;
}

export const ValidationStatusForm: React.FC<ValidationStatusFormProps> = ({ onNext, onBack }) => {
  const router = useRouter();

  useEffect(() => {
    // Fetch or determine the validation status
    const status = localStorage.getItem('validationStatus');
    console.log("Validation Status:", status); // Debugging line

    if (status === 'approved') {
      // Redirect to the seller dashboard if approved
      router.push('/seller/dashboard');
    }
  }, [router]);

  return (
    <div>
      <h2>Validation Status</h2>
      <p>Checking your validation status...</p>
      <button onClick={onBack}>Back</button>
    </div>
  );
}; 