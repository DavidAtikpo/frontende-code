"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import ImageDropzone from "./ImageDropzone";
import ImageValidator from "./ImageValidator";
import AdPreview from "./AdPreview";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface AdFormProps {
  onSubmit: (data: any) => void;
  loading?: boolean;
}

type AdType = 'banner' | 'popup' | 'sidebar';

export default function AdForm({ onSubmit, loading }: AdFormProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    type: 'banner' as AdType,
    location: '',
    startDate: undefined as Date | undefined,
    endDate: undefined as Date | undefined,
    targetUrl: '',
    file: null as File | null,
    imagePreview: null as string | null
  });
  
  const [isValid, setIsValid] = useState(false);

  const handleImageChange = (files: File[]) => {
    if (files.length > 0) {
      const file = files[0];
      setFormData(prev => ({
        ...prev,
        file,
        imagePreview: URL.createObjectURL(file)
      }));
    }
  };

  const handleValidation = (valid: boolean) => {
    setIsValid(valid);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid || !formData.file) {
      toast({
        title: "Erreur",
        description: "Veuillez vérifier les dimensions de l'image",
        variant: "destructive"
      });
      return;
    }

    const submitData = new FormData();
    submitData.append('image', formData.file);
    submitData.append('data', JSON.stringify({
      name: formData.name,
      type: formData.type,
      location: formData.location,
      startDate: formData.startDate,
      endDate: formData.endDate,
      targetUrl: formData.targetUrl
    }));

    onSubmit(submitData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid grid-cols-2 gap-6">
        {/* Informations de base */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Nom de la publicité</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Ex: Promotion été 2024"
              required
            />
          </div>

          <div>
            <Label htmlFor="type">Type de publicité</Label>
            <Select
              value={formData.type}
              onValueChange={(value: AdType) => setFormData(prev => ({ ...prev, type: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="banner">Bannière</SelectItem>
                <SelectItem value="popup">Pop-up</SelectItem>
                <SelectItem value="sidebar">Barre latérale</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="location">Emplacement</Label>
            <Select
              value={formData.location}
              onValueChange={(value) => setFormData(prev => ({ ...prev, location: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choisir l'emplacement" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="homepage">Page d'accueil</SelectItem>
                <SelectItem value="search">Page de recherche</SelectItem>
                <SelectItem value="product">Pages produits</SelectItem>
                <SelectItem value="checkout">Panier</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Dates et URL */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Date de début</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.startDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.startDate ? (
                      format(formData.startDate, "P", { locale: fr })
                    ) : (
                      <span>Choisir une date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.startDate}
                    onSelect={(date) => setFormData(prev => ({ ...prev, startDate: date }))}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <Label>Date de fin</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.endDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.endDate ? (
                      format(formData.endDate, "P", { locale: fr })
                    ) : (
                      <span>Choisir une date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.endDate}
                    onSelect={(date) => setFormData(prev => ({ ...prev, endDate: date }))}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div>
            <Label htmlFor="targetUrl">URL de destination</Label>
            <Input
              id="targetUrl"
              type="url"
              value={formData.targetUrl}
              onChange={(e) => setFormData(prev => ({ ...prev, targetUrl: e.target.value }))}
              placeholder="https://"
              required
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <Label>Image publicitaire</Label>
        <ImageDropzone
          onImagesChange={handleImageChange}
          maxFiles={1}
          acceptedTypes={["image/jpeg", "image/png", "image/gif"]}
        />

        {formData.file && formData.type && (
          <ImageValidator
            file={formData.file}
            type={formData.type}
            onValidation={handleValidation}
          />
        )}

        {formData.imagePreview && (
          <AdPreview
            imageUrl={formData.imagePreview}
            type={formData.type}
            location={formData.location}
          />
        )}
      </div>

      <div className="flex justify-end space-x-4">
        <Button type="submit" disabled={loading || !isValid}>
          {loading ? "Création en cours..." : "Créer la publicité"}
        </Button>
      </div>
    </form>
  );
} 