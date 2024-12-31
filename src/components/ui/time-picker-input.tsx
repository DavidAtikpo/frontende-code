"use client";

import * as React from "react";
import { Input } from "./input";

export interface TimePickerInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  picker: "hours" | "minutes";
  date: Date;
  setDate: (date: Date) => void;
  onLeftFocus?: () => void;
  onRightFocus?: () => void;
}

export const TimePickerInput = React.forwardRef<
  HTMLInputElement,
  TimePickerInputProps
>(({ picker, date, setDate, onLeftFocus, onRightFocus, ...props }, ref) => {
  const [value, setValue] = React.useState<string>(
    picker === "hours"
      ? String(date.getHours()).padStart(2, "0")
      : String(date.getMinutes()).padStart(2, "0")
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowRight" && onRightFocus) {
      onRightFocus();
    }
    if (e.key === "ArrowLeft" && onLeftFocus) {
      onLeftFocus();
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      const newValue = (parseInt(value) + 1) % (picker === "hours" ? 24 : 60);
      updateValue(String(newValue).padStart(2, "0"));
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      const newValue =
        (parseInt(value) - 1 + (picker === "hours" ? 24 : 60)) %
        (picker === "hours" ? 24 : 60);
      updateValue(String(newValue).padStart(2, "0"));
    }
  };

  const updateValue = (newValue: string) => {
    setValue(newValue);
    const newDate = new Date(date);
    if (picker === "hours") {
      newDate.setHours(parseInt(newValue));
    } else {
      newDate.setMinutes(parseInt(newValue));
    }
    setDate(newDate);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (newValue.length <= 2 && /^\d*$/.test(newValue)) {
      const numValue = parseInt(newValue || "0");
      if (
        numValue >= 0 &&
        numValue < (picker === "hours" ? 24 : 60)
      ) {
        updateValue(newValue.padStart(2, "0"));
      }
    }
  };

  const handleBlur = () => {
    setValue(value.padStart(2, "0"));
  };

  return (
    <Input
      {...props}
      ref={ref}
      value={value}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      onBlur={handleBlur}
      className="w-14 text-center"
      maxLength={2}
    />
  );
});

TimePickerInput.displayName = "TimePickerInput"; 