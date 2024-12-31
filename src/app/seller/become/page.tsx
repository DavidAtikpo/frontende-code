"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { API_CONFIG } from '@/utils/config';

const { BASE_URL } = API_CONFIG;

interface SellerRequestForm {
  businessType: 'products' | 'restaurant' | 'training' | 'events' | 'services';
  businessName: string;
  businessAddress: string;
  idCard: FileList;
  addressProof: FileList;
  businessDocument: FileList;
  videoPresentation: File | null;
  signedContract: File | null;
}

const STORAGE_KEY = 'seller_request_form';

const BecomeSeller = () => {
  const router = useRouter();
  const { register, handleSubmit, setValue, watch } = useForm<SellerRequestForm>();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [recording, setRecording] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const [videoBlob, setVideoBlob] = useState<Blob | null>(null);
  const [language, _setLanguage] = useState('fr'); // ou 'en'

  // Charger les données sauvegardées au démarrage
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      setCurrentStep(parsedData.currentStep || 1);
      Object.keys(parsedData.formData || {}).forEach(key => {
        setValue(key as keyof SellerRequestForm, parsedData.formData[key]);
      });
    }
  }, [setValue]);

  // Sauvegarder les données à chaque changement
  const saveToLocalStorage = (data: Partial<SellerRequestForm>) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      currentStep,
      formData: data
    }));
  };

  // Gérer l'enregistrement vidéo
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      mediaRecorderRef.current = new MediaRecorder(stream);
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' });
        setVideoBlob(blob);
        const videoFile = new File([blob], 'presentation.webm', { type: 'video/webm' });
        setValue('videoPresentation', videoFile);
        saveToLocalStorage(watch());
      };

      chunksRef.current = [];
      mediaRecorderRef.current.start();
      setRecording(true);
    } catch (error) {
      console.error('Erreur lors de l\'accès à la caméra:', error);
      toast.error('Impossible d\'accéder à la caméra');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      const tracks = (videoRef.current?.srcObject as MediaStream)?.getTracks();
      tracks?.forEach(track => track.stop());
      setRecording(false);
    }
  };

  // Télécharger et afficher le contrat
  const downloadContract = () => {
    const contractPath = `/contracts/${language}/seller_contract.pdf`;
    window.open(contractPath, '_blank');
  };

  const onSubmit = async (data: SellerRequestForm) => {
    try {
      setLoading(true);
      const formData = new FormData();
      
      Object.entries(data).forEach(([key, value]) => {
        if (value instanceof FileList && value[0]) {
          formData.append(key, value[0]);
        } else if (value instanceof File) {
          formData.append(key, value);
        } else if (value) {
          formData.append(key, value.toString());
        }
      });

      const response = await axios.post(
        `${BASE_URL}/api/seller-request/submit`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (response.data.success) {
        localStorage.removeItem(STORAGE_KEY); // Supprimer les données sauvegardées
        toast.success('Demande soumise avec succès');
        router.push('/seller/request-status');
      }
    } catch (error) {
      toast.error('Erreur lors de la soumission de la demande');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Ajouter l'étape de la vidéo et du contrat
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Devenir Vendeur sur Dubon</h1>
      
      <div className="mb-8">
        <div className="flex justify-between mb-4">
          {[1, 2, 3].map((step) => (
            <div
              key={step}
              className={`w-1/3 text-center ${
                currentStep === step ? 'text-blue-600' : 'text-gray-400'
              }`}
            >
              <div className="mb-2">Étape {step}</div>
              <div className="h-2 bg-gray-200 rounded">
                <div
                  className={`h-full rounded ${
                    currentStep >= step ? 'bg-blue-600' : ''
                  }`}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {currentStep === 1 && (
          <div className="space-y-4">
            <div>
              <label className="block mb-2">Type d'activité</label>
              <select
                {...register('businessType', { required: true })}
                className="w-full p-2 border rounded"
              >
                <option value="">Sélectionner une activité</option>
                <option value="products">Vente de produits</option>
                <option value="restaurant">Restaurant</option>
                <option value="training">Formation</option>
                <option value="events">Événementiel</option>
                <option value="services">Services</option>
              </select>
            </div>

            <div>
              <label className="block mb-2">Nom de l'entreprise</label>
              <input
                {...register('businessName', { required: true })}
                className="w-full p-2 border rounded"
              />
            </div>

            <div>
              <label className="block mb-2">Adresse professionnelle</label>
              <input
                {...register('businessAddress', { required: true })}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-4">
            <div>
              <label className="block mb-2">Pièce d'identité</label>
              <input
                type="file"
                {...register('idCard', { required: true })}
                className="w-full p-2 border rounded"
              />
            </div>

            <div>
              <label className="block mb-2">Justificatif de domicile</label>
              <input
                type="file"
                {...register('addressProof', { required: true })}
                className="w-full p-2 border rounded"
              />
            </div>

            <div>
              <label className="block mb-2">Document professionnel (optionnel)</label>
              <input
                type="file"
                {...register('businessDocument')}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="border rounded p-4">
              <h3 className="font-bold mb-4">Enregistrement vidéo de présentation</h3>
              <video ref={videoRef} autoPlay muted className="w-full mb-4" />
              {!videoBlob ? (
                <button
                  type="button"
                  onClick={recording ? stopRecording : startRecording}
                  className={`px-4 py-2 rounded ${
                    recording ? 'bg-red-600' : 'bg-blue-600'
                  } text-white`}
                >
                  {recording ? 'Arrêter l\'enregistrement' : 'Commencer l\'enregistrement'}
                </button>
              ) : (
                <div className="space-y-2">
                  <p className="text-green-600">✓ Vidéo enregistrée</p>
                  <button
                    type="button"
                    onClick={() => {
                      setVideoBlob(null);
                      setValue('videoPresentation', null);
                    }}
                    className="px-4 py-2 bg-gray-600 text-white rounded"
                  >
                    Recommencer
                  </button>
                </div>
              )}
            </div>

            <div className="border rounded p-4">
              <h3 className="font-bold mb-4">Contrat de vendeur</h3>
              <div className="space-y-4">
                <button
                  type="button"
                  onClick={downloadContract}
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                  Télécharger le contrat
                </button>
                <div>
                  <label className="block mb-2">Contrat signé (PDF)</label>
                  <input
                    type="file"
                    accept=".pdf"
                    {...register('signedContract', { required: true })}
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        setValue('signedContract', e.target.files[0]);
                        saveToLocalStorage(watch());
                      }
                    }}
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-between mt-8">
          {currentStep > 1 && (
            <button
              type="button"
              onClick={() => setCurrentStep(prev => prev - 1)}
              className="px-4 py-2 text-gray-600 border rounded hover:bg-gray-100"
            >
              Précédent
            </button>
          )}
          
          {currentStep < 3 ? (
            <button
              type="button"
              onClick={() => setCurrentStep(prev => prev + 1)}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Suivant
            </button>
          ) : (
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400"
            >
              {loading ? 'Envoi...' : 'Soumettre la demande'}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default BecomeSeller; 