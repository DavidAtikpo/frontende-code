"use client";

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useToast } from "@/components/ui/use-toast";
import { Calendar as CalendarIcon,  Edit } from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TemplateEditor from './TemplateEditor';

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
}

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

export default function EmailCampaign() {
  const { toast } = useToast();
  const [campaign, setCampaign] = useState({
    title: '',
    subject: '',
    content: '',
    targetGroup: '',
    scheduledDate: undefined as Date | undefined,
    template: 'default',
    selectedUsers: [] as string[]
  });

  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showTemplateEditor, setShowTemplateEditor] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);

  useEffect(() => {
    fetchTemplates();
    fetchUsers();
  }, []);

  const fetchTemplates = async () => {
    try {
      const response = await fetch('/api/admin/marketing/email-templates');
      if (response.ok) {
        const data = await response.json();
        setTemplates(data);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des templates:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/users');
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des utilisateurs:', error);
    }
  };

  const handleTemplateSelect = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setCampaign({
        ...campaign,
        subject: template.subject,
        content: template.content,
        template: templateId
      });
    }
  };

  const handleUserSelection = (userId: string) => {
    setCampaign(prev => ({
      ...prev,
      selectedUsers: prev.selectedUsers.includes(userId)
        ? prev.selectedUsers.filter(id => id !== userId)
        : [...prev.selectedUsers, userId]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/admin/marketing/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(campaign)
      });

      if (!response.ok) throw new Error('Erreur lors de l\'envoi');

      toast({
        title: "Succès",
        description: "Campagne email programmée avec succès"
      });

      setCampaign({
        title: '',
        subject: '',
        content: '',
        targetGroup: '',
        scheduledDate: undefined,
        template: 'default',
        selectedUsers: []
      });
    } catch (error) {
      console.error('Erreur lors de la programmation de la campagne:', error);
      toast({
        title: "Erreur",
        description: "Impossible de programmer la campagne",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Tabs defaultValue="general">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="general">Général</TabsTrigger>
          <TabsTrigger value="content">Contenu</TabsTrigger>
          <TabsTrigger value="recipients">Destinataires</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Input
            placeholder="Titre de la campagne"
            value={campaign.title}
            onChange={(e) => setCampaign({...campaign, title: e.target.value})}
            required
          />

          <div className="grid gap-4">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {campaign.scheduledDate ? (
                    format(campaign.scheduledDate, "PPP à HH:mm", { locale: fr })
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
        </TabsContent>

        <TabsContent value="content" className="space-y-4">
          <div className="flex justify-between items-center">
            <Select
              value={campaign.template}
              onValueChange={handleTemplateSelect}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Choisir un template" />
              </SelectTrigger>
              <SelectContent>
                {templates.map((template) => (
                  <SelectItem key={template.id} value={template.id}>
                    {template.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              type="button"
              variant="outline"
              onClick={() => setShowTemplateEditor(true)}
            >
              <Edit className="h-4 w-4 mr-2" />
              Gérer les templates
            </Button>
          </div>

          <Input
            placeholder="Objet de l'email"
            value={campaign.subject}
            onChange={(e) => setCampaign({...campaign, subject: e.target.value})}
            required
          />

          <Textarea
            placeholder="Contenu de l'email (HTML supporté)"
            value={campaign.content}
            onChange={(e) => setCampaign({...campaign, content: e.target.value})}
            className="min-h-[300px]"
            required
          />
        </TabsContent>

        <TabsContent value="recipients" className="space-y-4">
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
              <SelectItem value="custom">Sélection personnalisée</SelectItem>
            </SelectContent>
          </Select>

          {campaign.targetGroup === 'custom' && (
            <div className="border rounded-lg p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">Sélectionner les destinataires</h3>
                <span className="text-sm text-muted-foreground">
                  {campaign.selectedUsers.length} sélectionné(s)
                </span>
              </div>
              
              <div className="max-h-[300px] overflow-y-auto space-y-2">
                {users.map((user) => (
                  <div key={user.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={user.id}
                      checked={campaign.selectedUsers.includes(user.id)}
                      onCheckedChange={() => handleUserSelection(user.id)}
                    />
                    <label htmlFor={user.id} className="text-sm">
                      {user.name} ({user.email})
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>

      <TemplateEditor
        open={showTemplateEditor}
        onOpenChange={setShowTemplateEditor}
        onTemplatesUpdate={fetchTemplates}
      />

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Programmation..." : "Programmer la campagne"}
      </Button>
    </form>
  );
} 