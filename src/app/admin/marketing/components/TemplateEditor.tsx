"use client";

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Plus, Trash2, Save, Eye } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
}

interface TemplateEditorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTemplatesUpdate: () => void;
}

export default function TemplateEditor({ open, onOpenChange, onTemplatesUpdate }: TemplateEditorProps) {
  const { toast } = useToast();
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [currentTemplate, setCurrentTemplate] = useState<EmailTemplate | null>(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (open) {
      fetchTemplates();
    }
  }, [open]);

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

  const handleCreateTemplate = () => {
    setCurrentTemplate({
      id: '',
      name: 'Nouveau template',
      subject: '',
      content: ''
    });
    setPreviewMode(false);
  };

  const handleSaveTemplate = async () => {
    if (!currentTemplate) return;
    setIsLoading(true);

    try {
      const response = await fetch('/api/admin/marketing/email-templates', {
        method: currentTemplate.id ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentTemplate)
      });

      if (!response.ok) throw new Error('Erreur lors de la sauvegarde');

      toast({
        title: "Succès",
        description: "Template sauvegardé avec succès"
      });

      fetchTemplates();
      onTemplatesUpdate();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder le template",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteTemplate = async (templateId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce template ?')) return;

    try {
      const response = await fetch(`/api/admin/marketing/email-templates/${templateId}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Erreur lors de la suppression');

      toast({
        title: "Succès",
        description: "Template supprimé avec succès"
      });

      fetchTemplates();
      onTemplatesUpdate();
      setCurrentTemplate(null);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le template",
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[80vh]">
        <DialogHeader>
          <DialogTitle>Gestion des templates</DialogTitle>
        </DialogHeader>

        <div className="flex h-full gap-4">
          {/* Liste des templates */}
          <div className="w-1/4 border-r pr-4">
            <Button
              onClick={handleCreateTemplate}
              className="w-full mb-4"
              variant="outline"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nouveau template
            </Button>

            <ScrollArea className="h-[calc(100%-4rem)]">
              <div className="space-y-2">
                {templates.map((template) => (
                  <div
                    key={template.id}
                    className={`p-2 rounded cursor-pointer hover:bg-gray-100 flex justify-between items-center
                      ${currentTemplate?.id === template.id ? 'bg-gray-100' : ''}`}
                    onClick={() => setCurrentTemplate(template)}
                  >
                    <span className="truncate">{template.name}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteTemplate(template.id);
                      }}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Éditeur de template */}
          <div className="flex-1">
            {currentTemplate ? (
              <div className="h-full flex flex-col">
                <div className="flex justify-between items-center mb-4">
                  <div className="space-x-2">
                    <Button
                      variant={previewMode ? "outline" : "default"}
                      onClick={() => setPreviewMode(false)}
                    >
                      Éditer
                    </Button>
                    <Button
                      variant={previewMode ? "default" : "outline"}
                      onClick={() => setPreviewMode(true)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Aperçu
                    </Button>
                  </div>
                  <Button onClick={handleSaveTemplate} disabled={isLoading}>
                    <Save className="h-4 w-4 mr-2" />
                    Sauvegarder
                  </Button>
                </div>

                {!previewMode ? (
                  <div className="space-y-4 flex-1">
                    <Input
                      placeholder="Nom du template"
                      value={currentTemplate.name}
                      onChange={(e) => setCurrentTemplate({
                        ...currentTemplate,
                        name: e.target.value
                      })}
                    />
                    <Input
                      placeholder="Objet de l'email"
                      value={currentTemplate.subject}
                      onChange={(e) => setCurrentTemplate({
                        ...currentTemplate,
                        subject: e.target.value
                      })}
                    />
                    <Textarea
                      placeholder="Contenu HTML du template"
                      value={currentTemplate.content}
                      onChange={(e) => setCurrentTemplate({
                        ...currentTemplate,
                        content: e.target.value
                      })}
                      className="flex-1 min-h-[300px]"
                    />
                  </div>
                ) : (
                  <div className="flex-1 border rounded-lg p-4 overflow-auto">
                    <div dangerouslySetInnerHTML={{ __html: currentTemplate.content }} />
                  </div>
                )}
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500">
                Sélectionnez ou créez un template
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 