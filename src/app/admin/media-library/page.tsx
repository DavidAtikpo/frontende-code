"use client";

import { useState, useEffect, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoadingSpinner } from "@/components/ui/loading";
import { Image as ImageIcon, Trash2, Upload, Grid, List } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Image from 'next/image';
import { API_CONFIG } from "@/utils/config";
import { getCookie } from "cookies-next";
const { BASE_URL } = API_CONFIG;

interface MediaFile {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  folder: string;
  createdAt: string;
}

export default function MediaLibrary() {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedFile, setSelectedFile] = useState<MediaFile | null>(null);
  const [currentFolder, _setCurrentFolder] = useState('');
  const [uploading, setUploading] = useState(false);

  const fetchFiles = useCallback(async () => {
    try {
      const response = await fetch(
        `${BASE_URL}/api/admin/media?folder=${currentFolder}`,
        {
          headers: {
            'Authorization': `Bearer ${getCookie('token')}`,
          },
          credentials: 'include'
        }
      );
      const data = await response.json();
      if (data.success) {
        setFiles(data.data);
      }
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  }, [currentFolder]);

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    setUploading(true);
    const formData = new FormData();
    Array.from(files).forEach(file => {
      formData.append('files', file);
    });
    if (currentFolder) {
      formData.append('folder', currentFolder);
    }

    try {
      const response = await fetch(`${BASE_URL}/api/admin/media/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${getCookie('token')}`,
        },
        body: formData,
        credentials: 'include'
      });

      if (response.ok) {
        fetchFiles();
      }
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (fileId: string) => {
    try {
      const response = await fetch(`${BASE_URL}/api/admin/media/${fileId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${getCookie('token')}`,
        },
        credentials: 'include'
      });

      if (response.ok) {
        setFiles(files.filter(f => f.id !== fileId));
      }
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Bibliothèque multimédia</h1>
        <div className="flex gap-4">
          <Button
            variant="outline"
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
          >
            {viewMode === 'grid' ? <List className="h-4 w-4" /> : <Grid className="h-4 w-4" />}
          </Button>
          <div className="relative">
            <Input
              type="file"
              multiple
              className="hidden"
              id="file-upload"
              onChange={handleFileUpload}
            />
            <Button
              disabled={uploading}
              onClick={() => document.getElementById('file-upload')?.click()}
            >
              <Upload className="h-4 w-4 mr-2" />
              {uploading ? 'Téléchargement...' : 'Télécharger'}
            </Button>
          </div>
        </div>
      </div>

      <Card className="p-6">
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {files.map((file) => (
              <div
                key={file.id}
                className="relative group cursor-pointer"
                onClick={() => setSelectedFile(file)}
              >
                <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                  {file.type.startsWith('image/') ? (
                    <Image
                      src={file.url}
                      alt={file.name}
                      className="w-full h-full object-cover"
                      width={200}
                      height={200}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="h-12 w-12 text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(file.id);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <p className="mt-1 text-sm truncate">{file.name}</p>
              </div>
            ))}
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left">Nom</th>
                <th className="text-left">Type</th>
                <th className="text-left">Taille</th>
                <th className="text-left">Date</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {files.map((file) => (
                <tr key={file.id} className="hover:bg-gray-50">
                  <td className="py-2">{file.name}</td>
                  <td>{file.type}</td>
                  <td>{formatFileSize(file.size)}</td>
                  <td>{new Date(file.createdAt).toLocaleDateString()}</td>
                  <td className="text-right">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(file.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>

      {/* Dialog de prévisualisation */}
      <Dialog open={!!selectedFile} onOpenChange={() => setSelectedFile(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{selectedFile?.name}</DialogTitle>
          </DialogHeader>
          
          {selectedFile && (
            <div className="mt-4">
              {selectedFile.type.startsWith('image/') ? (
                <Image
                  src={selectedFile.url}
                  alt={selectedFile.name}
                  className="max-h-[60vh] mx-auto"
                  width={200}
                  height={200}
                />
              ) : (
                <div className="flex items-center justify-center p-12">
                  <ImageIcon className="h-24 w-24 text-gray-400" />
                </div>
              )}
              <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-medium">Type</p>
                  <p className="text-gray-500">{selectedFile.type}</p>
                </div>
                <div>
                  <p className="font-medium">Taille</p>
                  <p className="text-gray-500">{formatFileSize(selectedFile.size)}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
} 