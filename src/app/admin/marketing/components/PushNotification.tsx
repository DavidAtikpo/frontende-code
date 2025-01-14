"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";

interface PushNotificationData {
  title: string;
  message: string;
  targetGroup: string;
  scheduledDate: Date | undefined;
  link?: string;
  icon?: string;
}

export default function PushNotification() {
  const { toast } = useToast();
  const [notification, setNotification] = useState<PushNotificationData>({
    title: '',
    message: '',
    targetGroup: '',
    scheduledDate: undefined,
    link: '',
    icon: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/admin/marketing/push', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(notification)
      });

      if (!response.ok) throw new Error('Erreur lors de l\'envoi');

      toast({
        title: "Succès",
        description: "Notification push programmée avec succès"
      });

      setNotification({
        title: '',
        message: '',
        targetGroup: '',
        scheduledDate: undefined,
        link: '',
        icon: ''
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de programmer la notification",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <Input
          placeholder="Titre de la notification"
          value={notification.title}
          onChange={(e) => setNotification({...notification, title: e.target.value})}
          required
        />

        <Select
          value={notification.targetGroup}
          onValueChange={(value) => setNotification({...notification, targetGroup: value})}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner le groupe cible" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les utilisateurs</SelectItem>
            <SelectItem value="users">Clients</SelectItem>
            <SelectItem value="sellers">Vendeurs</SelectItem>
          </SelectContent>
        </Select>

        <Textarea
          placeholder="Message de la notification"
          value={notification.message}
          onChange={(e) => setNotification({...notification, message: e.target.value})}
          required
        />

        <Input
          placeholder="Lien (optionnel)"
          value={notification.link}
          onChange={(e) => setNotification({...notification, link: e.target.value})}
        />

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full justify-start text-left font-normal">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {notification.scheduledDate ? (
                format(notification.scheduledDate, "PPP", { locale: fr })
              ) : (
                <span>Choisir une date d'envoi</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={notification.scheduledDate}
              onSelect={(date) => setNotification({...notification, scheduledDate: date})}
              locale={fr}
            />
          </PopoverContent>
        </Popover>
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Programmation..." : "Programmer la notification"}
      </Button>
    </form>
  );
} 