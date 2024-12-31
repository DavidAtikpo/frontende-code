"use client";

import * as React from "react";
import { TimePickerInput } from "./time-picker-input";

interface TimePickerProps {
  date: Date;
  setDate: (date: Date) => void;
  label?: string;
}

export function TimePicker({ date, setDate, label }: TimePickerProps) {
  const minuteRef = React.useRef<HTMLInputElement>(null);
  const hourRef = React.useRef<HTMLInputElement>(null);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2 items-center">
        <TimePickerInput
          picker="hours"
          date={date}
          setDate={(date) => setDate(date)}
          ref={hourRef}
          onRightFocus={() => minuteRef.current?.focus()}
        />
        <span className="text-sm text-gray-600">:</span>
        <TimePickerInput
          picker="minutes"
          date={date}
          setDate={(date) => setDate(date)}
          ref={minuteRef}
          onLeftFocus={() => hourRef.current?.focus()}
        />
      </div>
    </div>
  );
} 