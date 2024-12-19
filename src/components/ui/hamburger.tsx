"use client";

import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

interface HamburgerProps {
  onClick: () => void;
  className?: string;
}

export function Hamburger({ onClick, className }: HamburgerProps) {
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={onClick}
      className={className}
      aria-label="Toggle Menu"
    >
      <Menu className="h-6 w-6" />
    </Button>
  );
} 