"use client";

import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface StepperProps {
  steps: string[];
  currentStep: number;
  onStepClick?: (step: number) => void;
}

export function Stepper({ steps, currentStep, onStepClick }: StepperProps) {
  return (
    <div className="relative">
      <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200">
        <div
          className="absolute h-full bg-primary transition-all duration-300"
          style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
        />
      </div>

      <div className="relative flex justify-between">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;

          return (
            <div
              key={step}
              className={cn(
                "flex flex-col items-center cursor-pointer",
                (onStepClick && (isCompleted || isCurrent)) && "hover:opacity-80"
              )}
              onClick={() => {
                if (onStepClick && (isCompleted || isCurrent)) {
                  onStepClick(index);
                }
              }}
            >
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 mb-2",
                  isCompleted
                    ? "bg-primary border-primary text-white"
                    : isCurrent
                    ? "border-primary text-primary"
                    : "border-gray-300 text-gray-300"
                )}
              >
                {isCompleted ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>
              <span
                className={cn(
                  "text-xs text-center max-w-[80px]",
                  isCompleted || isCurrent ? "text-primary" : "text-gray-400"
                )}
              >
                {step}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
} 