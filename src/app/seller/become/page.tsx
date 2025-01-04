"use client";

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { API_CONFIG } from '@/utils/config';

const { BASE_URL } = API_CONFIG;

// Types d'entreprise et leurs catégories associées
const businessTypes = {
  retail: "Commerce de détail",
  wholesale: "Commerce de gros",
  manufacturer: "Fabricant",
  service: "Prestataire de services",
  distributor: "Distributeur"
};

const employeeRanges = [
  "1-5",
  "6-25",
  "26-100",
  "101-500",
  "500+"
];

const revenueRanges = [
  "< 50,000 €",
  "50,000 € - 200,000 €",
  "200,000 € - 1M €",
  "> 1M €"
];

interface SellerFormData {
  // Informations personnelles
  fullName: string;
  email: string;
  phone: string;
  
  // Informations entreprise
  companyName: string;
  registrationNumber: string; // SIRET/SIREN
  vatNumber: string;         // Numéro TVA
  businessType: string;
  yearEstablished: string;
  employeeCount: string;
  annualRevenue: string;
  
  // Documents légaux
  identityDocument: File | null;
  businessLicense: File | null;
  taxDocument: File | null;
  
  // Capacités
  mainProducts: string[];
  categories: string[];
  exportCapability: boolean;
  
  // Adresse
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

const BecomeSellerPage = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<SellerFormData>({
    fullName: '',
    email: '',
    phone: '',
    companyName: '',
    registrationNumber: '',
    vatNumber: '',
    businessType: '',
    yearEstablished: '',
    employeeCount: '',
    annualRevenue: '',
    identityDocument: null,
    businessLicense: null,
    taxDocument: null,
    mainProducts: [],
    categories: [],
    exportCapability: false,
    address: '',
    city: '',
    postalCode: '',
    country: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [availableCategories, setAvailableCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/categories`);
        setAvailableCategories(response.data.categories);
      } catch (error) {
        console.error('Erreur chargement catégories:', error);
        toast.error('Erreur lors du chargement des catégories');
      }
    };
    fetchCategories();
  }, []);

  const handleFileChange = (field: keyof SellerFormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        [field]: file
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      
      // Ajouter tous les champs au FormData
      Object.entries(formData).forEach(([key, value]) => {
        if (value instanceof File) {
          formDataToSend.append(key, value);
        } else if (Array.isArray(value)) {
          formDataToSend.append(key, JSON.stringify(value));
        } else if (typeof value === 'boolean') {
          formDataToSend.append(key, value.toString());
        } else if (value) {
          formDataToSend.append(key, value);
        }
      });

      const response = await axios.post(`${BASE_URL}/api/seller-request`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        toast.success('Demande soumise avec succès');
        router.push('/seller/request-status');
      }
    } catch (error) {
      console.error('Erreur soumission:', error);
      toast.error('Erreur lors de la soumission');
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Informations personnelles</h2>
            <div className="grid gap-4">
              <div>
                <label className="block font-medium mb-1">Nom complet</label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Email professionnel</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Téléphone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Adresse</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium mb-1">Ville</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({...formData, city: e.target.value})}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">Code postal</label>
                  <input
                    type="text"
                    value={formData.postalCode}
                    onChange={(e) => setFormData({...formData, postalCode: e.target.value})}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
              </div>
            </div>
          </div>
        );
      
      case 2:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Informations entreprise</h2>
            <div className="grid gap-4">
              <div>
                <label className="block font-medium mb-1">Nom de l'entreprise</label>
                <input
                  type="text"
                  value={formData.companyName}
                  onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Numéro SIRET/SIREN</label>
                <input
                  type="text"
                  value={formData.registrationNumber}
                  onChange={(e) => setFormData({...formData, registrationNumber: e.target.value})}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Numéro de TVA</label>
                <input
                  type="text"
                  value={formData.vatNumber}
                  onChange={(e) => setFormData({...formData, vatNumber: e.target.value})}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Type d'activité</label>
                <select
                  value={formData.businessType}
                  onChange={(e) => setFormData({...formData, businessType: e.target.value})}
                  className="w-full p-2 border rounded"
                  required
                >
                  <option value="">Sélectionner un type</option>
                  {Object.entries(businessTypes).map(([key, value]) => (
                    <option key={key} value={key}>{value}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium mb-1">Année de création</label>
                  <input
                    type="number"
                    value={formData.yearEstablished}
                    onChange={(e) => setFormData({...formData, yearEstablished: e.target.value})}
                    className="w-full p-2 border rounded"
                    min="1900"
                    max={new Date().getFullYear()}
                    required
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">Nombre d'employés</label>
                  <select
                    value={formData.employeeCount}
                    onChange={(e) => setFormData({...formData, employeeCount: e.target.value})}
                    className="w-full p-2 border rounded"
                    required
                  >
                    <option value="">Sélectionner</option>
                    {employeeRanges.map(range => (
                      <option key={range} value={range}>{range}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Documents légaux</h2>
            <div className="grid gap-6">
              <div>
                <label className="block font-medium mb-1">
                  Pièce d'identité (Carte d'identité, Passeport)
                </label>
                <input
                  type="file"
                  onChange={handleFileChange('identityDocument')}
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="w-full p-2 border rounded"
                  required
                />
                <p className="text-sm text-gray-500 mt-1">
                  Format accepté : PDF, JPG, PNG (Max 5MB)
                </p>
              </div>
              
              <div>
                <label className="block font-medium mb-1">
                   Document d'enregistrement
                </label>
                <input
                  type="file"
                  onChange={handleFileChange('businessLicense')}
                  accept=".pdf"
                  className="w-full p-2 border rounded"
                  required
                />
                <p className="text-sm text-gray-500 mt-1">
                  Format accepté : PDF uniquement (Max 5MB)
                </p>
              </div>

              <div>
                <label className="block font-medium mb-1">
                  Attestation fiscale
                </label>
                <input
                  type="file"
                  onChange={handleFileChange('taxDocument')}
                  accept=".pdf"
                  className="w-full p-2 border rounded"
                  required
                />
                <p className="text-sm text-gray-500 mt-1">
                  Format accepté : PDF uniquement (Max 5MB)
                </p>
              </div>
            </div>
          </div>
        );
      
      case 4:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Capacités et produits</h2>
            <div className="grid gap-4">
              <div>
                <label className="block font-medium mb-1">Catégories de produits</label>
                <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto p-2 border rounded">
                  {availableCategories.map((category: any) => (
                    <label key={category.id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.categories.includes(category.id)}
                        onChange={(e) => {
                          const newCategories = e.target.checked
                            ? [...formData.categories, category.id]
                            : formData.categories.filter(id => id !== category.id);
                          setFormData({...formData, categories: newCategories});
                        }}
                        className="rounded"
                      />
                      <span>{category.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-medium mb-1">Chiffre d'affaires annuel</label>
                <select
                  value={formData.annualRevenue}
                  onChange={(e) => setFormData({...formData, annualRevenue: e.target.value})}
                  className="w-full p-2 border rounded"
                  required
                >
                  <option value="">Sélectionner</option>
                  {revenueRanges.map(range => (
                    <option key={range} value={range}>{range}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.exportCapability}
                    onChange={(e) => setFormData({...formData, exportCapability: e.target.checked})}
                    className="rounded"
                  />
                  <span>Capacité d'exportation internationale</span>
                </label>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-4">Devenir vendeur</h1>
        <div className="flex justify-between mb-8">
          {[1, 2, 3, 4].map((step) => (
            <div
              key={step}
              className={`flex items-center ${
                step <= currentStep ? 'text-blue-600' : 'text-gray-400'
              }`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 
                ${step <= currentStep ? 'border-blue-600 bg-blue-50' : 'border-gray-300'}`}
              >
                {step}
              </div>
              {step < 4 && <div className={`w-full h-1 ${step < currentStep ? 'bg-blue-600' : 'bg-gray-300'}`} />}
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {renderStep()}

        <div className="flex justify-between mt-8">
          {currentStep > 1 && (
            <button
              type="button"
              onClick={() => setCurrentStep(prev => prev - 1)}
              className="px-4 py-2 border rounded hover:bg-gray-50"
            >
              Précédent
            </button>
          )}
          
          {currentStep < 4 ? (
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
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Envoi en cours...' : 'Soumettre la demande'}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default BecomeSellerPage; 