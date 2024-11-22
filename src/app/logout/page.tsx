"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function LogoutPage() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(true);
  }, []);

  const handleCancel = () => {
    const previousPage = document.referrer;
    if (previousPage && previousPage.includes(window.location.origin)) {
      router.back();
    } else {
      router.push("/dashboard");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/");
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirmation de déconnexion</DialogTitle>
          <DialogDescription>
            Êtes-vous sûr de vouloir vous déconnecter ?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleCancel}
          >
            Annuler
          </Button>
          <Button
            className="bg-[#1D4ED8] hover:bg-[#1e40af]"
            onClick={handleLogout}
          >
            Se déconnecter
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 