"use client";

import React, { useState } from "react";
import Link from "next/link";

const InscriptionPage = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1); // Étape courante
  const [formData, setFormData] = useState({
    accountName: "",
    country: "Bénin",
    timezone: "(UTC) Casablanca",
    educationLevel: "",
    document: null,
    signature: null,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    setFormData({ ...formData, [e.target.name]: file });
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!formData.educationLevel || !formData.document || !formData.signature) {
      alert("Tous les champs sont obligatoires !");
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("accountName", formData.accountName);
    formDataToSend.append("country", formData.country);
    formDataToSend.append("timezone", formData.timezone);
    formDataToSend.append("educationLevel", formData.educationLevel);
    formDataToSend.append("document", formData.document as File);
    formDataToSend.append("signature", formData.signature as File);

    try {
      const response = await fetch("http://localhost:5000/api/dossier", {
        method: "POST",
        body: formDataToSend,
      });

      if (response.ok) {
        alert("Dossier soumis avec succès !");
        setIsPopupOpen(false);
      } else {
        const data = await response.json();
        alert(`Erreur: ${data.message}`);
      }
    } catch (error) {
      console.error(error);
      alert("Erreur lors de la soumission du dossier.");
    }
  };

  return (
    <div>
       <nav className="text-gray-600 text-sm mb-6">
  <Link href="/" className="hover:underline">
    Accueil
  </Link>{" "}
  &gt;{" "}
  <Link href="/formation" className="hover:underline">
    Formation
  </Link>{" "}
  &gt;{" "}
  <Link href="/inscription" className="hover:underline">
    Formation
  </Link>{" "}
  {/* / {product.title} */}
</nav>
    <div className="max-w-4xl mx-auto py-12 px-6 bg-gray-50">
      {/* En-tête */}
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Vers la prochaine étape de votre carrière
      </h1>
      <p className="text-gray-600 mb-8">
        Grâce à votre dossier, nous pourrons vous guider vers la formation longue (6 à 24 mois) et
        le financement qui vous correspondent.
      </p>
      <button
        onClick={() => setIsPopupOpen(true)}
        className="bg-customBlue text-white px-6 py-3 rounded-lg mb-6 hover:bg-purple-700"
      >
        Commencer mon dossier
      </button>
      <ul className="text-gray-600 space-y-3">
        <li>✔ Sans frais de dossier</li>
        <li>✔ Commencez maintenant et terminez quand vous voulez</li>
        <li>✔ Vous aurez un premier retour par email sous 2 jours ouvrés</li>
      </ul>

      {/* Section : Les éléments à fournir */}
      <section className="mt-12">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Les éléments à fournir</h2>
        <p className="text-gray-600 mb-4">Pour votre dossier :</p>
        <ul className="list-disc pl-6 text-gray-600 space-y-2">
          <li>Votre CV ou profil LinkedIn à jour</li>
          <li>Votre motivation et votre projet professionnel en quelques phrases</li>
          <li>
            Si vous êtes demandeur d’emploi, votre avis de situation France Travail (anciennement
            Pôle Emploi)
          </li>
        </ul>
      </section>

      {/* Popup */}
      {isPopupOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-1/2 p-6 shadow-lg relative">
            {/* Bouton de fermeture */}
            <button
              onClick={() => setIsPopupOpen(false)}
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-800"
            >
              ✖
            </button>

            <h2 className="text-xl font-bold text-gray-800 mb-6">Activer votre compte</h2>

            {/* Étapes */}
            {currentStep === 1 && (
              <div>
                <h3 className="text-lg font-bold text-gray-700 mb-4">Votre compte</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-700">Nom du compte</label>
                    <input
                      type="text"
                      name="accountName"
                      value={formData.accountName}
                      onChange={handleInputChange}
                      placeholder="Mon Compte"
                      className="w-full border border-gray-300 px-3 py-2 rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700">Pays</label>
                    <select
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 px-3 py-2 rounded"
                    >
                      <option value="Bénin">Bénin</option>
                      <option value="France">France</option>
                      <option value="Côte d'Ivoire">Côte d&apos;Ivoire</option>
                      <option value="Sénégal">Sénégal</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-700">Fuseau horaire</label>
                    <select
                      name="timezone"
                      value={formData.timezone}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 px-3 py-2 rounded"
                    >
                      <option value="(UTC) Casablanca">(UTC) Casablanca</option>
                      <option value="(UTC+1) Paris">(UTC+1) Paris</option>
                      <option value="(UTC+3) Nairobi">(UTC+3) Nairobi</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div>
                <h3 className="text-lg font-bold text-gray-700 mb-4">Niveau d&apos;études</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-700">Niveau d&apos;études</label>
                    <input
                      type="text"
                      name="educationLevel"
                      value={formData.educationLevel}
                      onChange={handleInputChange}
                      placeholder="Ex: Bac+3, Bac+5"
                      className="w-full border border-gray-300 px-3 py-2 rounded"
                    />
                  </div>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div>
                <h3 className="text-lg font-bold text-gray-700 mb-4">Documents requis</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-700">Document PDF</label>
                    <input
                      type="file"
                      name="document"
                      accept=".pdf"
                      onChange={handleFileUpload}
                      className="w-full border border-gray-300 px-3 py-2 rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700">Signature PDF</label>
                    <input
                      type="file"
                      name="signature"
                      accept=".pdf"
                      onChange={handleFileUpload}
                      className="w-full border border-gray-300 px-3 py-2 rounded"
                    />
                  </div>
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div>
                <h3 className="text-lg font-bold text-gray-700 mb-4">Confirmation</h3>
                <p className="text-gray-600">
                  Veuillez vérifier toutes les informations fournies avant de soumettre.
                </p>
              </div>
            )}

            {/* Boutons */}
            <div className="mt-6 flex justify-between">
              {currentStep > 1 && (
                <button
                  onClick={handleBack}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                >
                  Retour
                </button>
              )}
              {currentStep < 4 && (
                <button
                  onClick={handleNext}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Continuer →
                </button>
              )}
              {currentStep === 4 && (
                <button
                  onClick={handleSubmit}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  Soumettre
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
    </div>
  );
};

export default InscriptionPage;
