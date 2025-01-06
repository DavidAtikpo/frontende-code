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

interface SmsCampaignData {
  title: string;
  message: string;
  targetGroup: string;
  scheduledDate: Date | undefined;
}

export default function SmsCampaign() {
  const { toast } = useToast();
  const [campaign, setCampaign] = useState<SmsCampaignData>({
    title: '',
    message: '',
    targetGroup: '',
    scheduledDate: undefined
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/admin/marketing/sms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(campaign)
      });

      if (!response.ok) throw new Error('Erreur lors de l\'envoi');

      toast({
        title: "Succès",
        description: "Campagne SMS programmée avec succès"
      });

      setCampaign({
        title: '',
        message: '',
        targetGroup: '',
        scheduledDate: undefined
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de programmer la campagne SMS",
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
          placeholder="Titre de la campagne"
          value={campaign.title}
          onChange={(e) => setCampaign({...campaign, title: e.target.value})}
          required
        />

        <Select
          value={campaign.targetGroup}
          onValueChange={(value) => setCampaign({...campaign, targetGroup: value})}
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
          placeholder="Message SMS (160 caractères max)"
          value={campaign.message}
          onChange={(e) => setCampaign({...campaign, message: e.target.value})}
          maxLength={160}
          required
        />

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full justify-start text-left font-normal">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {campaign.scheduledDate ? (
                format(campaign.scheduledDate, "PPP", { locale: fr })
              ) : (
                <span>Choisir une date d'envoi</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={campaign.scheduledDate}
              onSelect={(date) => setCampaign({...campaign, scheduledDate: date})}
              locale={fr}
            />
          </PopoverContent>
        </Popover>
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Programmation..." : "Programmer la campagne SMS"}
      </Button>
    </form>
  );
} 