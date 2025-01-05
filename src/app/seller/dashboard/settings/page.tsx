"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { 
  Store, 
  MapPin, 
  CreditCard, 
  Bell, 
  Shield, 
  Smartphone,
  Mail,
  Building,
  Clock,
  Globe,
  Image as ImageIcon,
  Upload,
  X,
  Lock,
  Key,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

interface _SettingsData {
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
  preferences: {
    language: string;
    currency: string;
  };
}

interface SettingUpdate {
  key: string;
  value: string | number | boolean;
}

interface SellerProfile {
  storeName?: string;
  description?: string;
  bankInfo?: string;
  data?: {
    [key: string]: any;
  };
}

export default function SettingsPage() {
  const { toast } = useToast();
  const [profile, setProfile] = useState<SellerProfile>({});
  const [activeTab, setActiveTab] = useState("business");
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      // Appel API pour sauvegarder les paramètres
      toast({
        title: "Succès",
        description: "Vos paramètres ont été mis à jour",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour les paramètres",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="business" className="space-y-4">
        <TabsList>
          <TabsTrigger value="business">
            <Store className="h-4 w-4 mr-2" />
            Entreprise
          </TabsTrigger>
          <TabsTrigger value="payments">
            <CreditCard className="h-4 w-4 mr-2" />
            Paiements
          </TabsTrigger>
          {/* ... autres tabs ... */}
        </TabsList>

        {/* ... reste du contenu ... */}
      </Tabs>
    </div>
  );
}

