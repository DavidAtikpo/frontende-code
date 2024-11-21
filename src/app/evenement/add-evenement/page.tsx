"use client";

import React, { useState } from "react";

const AddEventPage = () => {
    const [event, setEvent] = useState<{
        title: string;
        description: string;
        date: string;
        time: string;
        location: string;
        country: string;
        continent: string;
        price: string;
        imageUrl: string;
        imageFile: File | null; // Assurez-vous que le type est correct
        isLive: boolean;
        liveStreamLink: string;
        organizer: string;
        maxAttendees: string;
      }>({
        title: "",
        description: "",
        date: "",
        time: "",
        location: "",
        country: "",
        continent: "",
        price: "",
        imageUrl: "",
        imageFile: null, // File ou null
        isLive: false,
        liveStreamLink: "",
        organizer: "",
        maxAttendees: "",
      });
      
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Gérer le changement des champs du formulaire
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEvent({ ...event, [name]: value });
  };


  // Gérer le téléchargement d'un fichier image
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setEvent({ ...event, imageFile: file, imageUrl: "" });
      setImagePreview(URL.createObjectURL(file));
    }
  };
 
  

  // Gérer le champ d'URL pour l'image
  const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setEvent({ ...event, imageUrl: value, imageFile: null }); // Priorité à l'URL de l'image
    setImagePreview(value); // Prévisualisation de l'image via URL
  };

  const validateForm = () => {
    if (!event.title.trim()) return "Le titre est obligatoire.";
    if (!event.description.trim()) return "La description est obligatoire.";
    if (!event.date) return "La date est obligatoire.";
    if (!event.time) return "L'heure est obligatoire.";
    if (!event.location.trim()) return "Le lieu est obligatoire.";
    if (!event.country.trim()) return "Le pays est obligatoire.";
    if (!event.continent.trim()) return "Le continent est obligatoire.";
    if (!event.price || parseFloat(event.price) <= 0)
      return "Le prix doit être un montant positif.";
    return "";
  };
  // Soumettre le formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const validationError = validateForm();
    if (validationError) {
      setErrorMessage(validationError);
      setLoading(false);
      return;
    }
    setErrorMessage("");

    try {
        const formData = new FormData();
        console.log("Initial Event Data:", event); 

        Object.entries(event).forEach(([key, value]) => {
          if (value !== null && value !== undefined) {
            // Convertir les valeurs spécifiques si nécessaire
            if (key === "isLive") {
              formData.append(key, value ? "true" : "false"); // Convert boolean en string
            } else if (key === "maxAttendees" && parseInt(value as string) < 0) {
              formData.append(key, "0"); // Convertir une valeur négative en 0
            } else {
              formData.append(key, value as string);
            }
          }
        });
        
        // Ajouter le fichier ou l'URL de l'image
        if (event.imageFile) {
          formData.append("image", event.imageFile); // Fichier téléversé
        } else if (event.imageUrl) {
          formData.append("imageUrl", event.imageUrl); // URL de l'image
        }
        
        console.log('Event:',formData);
      const response = await fetch("http://localhost:5000/api/create-event", {
        method: "POST",
        body: formData,
      });
 
      if (!response.ok) {
        throw new Error("Échec de l'ajout de l'événement.");
      }

      setSuccessMessage("Événement ajouté avec succès !");
      setEvent({
        title: "",
        description: "",
        date: "",
        time: "",
        location: "",
        country: "",
        continent: "",
        price: "",
        imageUrl: "",
        imageFile: null,
        isLive: false,
        liveStreamLink: "",
        organizer: "",
        maxAttendees: "",
      });
      setImagePreview(null);
    } catch (error) {
      console.error(error);
      setSuccessMessage("Une erreur est survenue lors de l'ajout de l'événement.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Ajouter un événement</h1>
      {errorMessage && <p className="mb-4 text-red-600">{errorMessage}</p>}
      {successMessage && <p className="mb-4 text-green-600">{successMessage}</p>}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Titre */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-2">
            Titre de l'événement
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={event.title}
            onChange={handleInputChange}
            className="w-full border px-4 py-2 rounded"
            placeholder="Ex: Concert Live 2024"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium mb-2">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={event.description}
            onChange={handleInputChange}
            className="w-full border px-4 py-2 rounded"
            rows={4}
            placeholder="Détaillez l'événement..."
            required
          ></textarea>
        </div>

        {/* Date et Heure */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="date" className="block text-sm font-medium mb-2">
              Date
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={event.date}
              onChange={handleInputChange}
              className="w-full border px-4 py-2 rounded"
              required
            />
          </div>
          <div>
            <label htmlFor="time" className="block text-sm font-medium mb-2">
              Heure
            </label>
            <input
              type="time"
              id="time"
              name="time"
              value={event.time}
              onChange={handleInputChange}
              className="w-full border px-4 py-2 rounded"
              required
            />
          </div>
        </div>

        {/* Lieu, Pays et Continent */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="location" className="block text-sm font-medium mb-2">
              Lieu
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={event.location}
              onChange={handleInputChange}
              className="w-full border px-4 py-2 rounded"
              placeholder="Ex: Paris, Stade"
              required
            />
          </div>
          <div>
            <label htmlFor="country" className="block text-sm font-medium mb-2">
              Pays
            </label>
            <input
              type="text"
              id="country"
              name="country"
              value={event.country}
              onChange={handleInputChange}
              className="w-full border px-4 py-2 rounded"
              placeholder="Ex: France"
              required
            />
          </div>
          <div>
            <label htmlFor="continent" className="block text-sm font-medium mb-2">
              Continent
            </label>
            <input
              type="text"
              id="continent"
              name="continent"
              value={event.continent}
              onChange={handleInputChange}
              className="w-full border px-4 py-2 rounded"
              placeholder="Ex: Europe"
              required
            />
          </div>
        </div>

        {/* Prix */}
        <div>
          <label htmlFor="price" className="block text-sm font-medium mb-2">
            Prix (FCFA)
          </label>
          <input
            type="number"
            id="price"
            name="price"
            value={event.price}
            onChange={handleInputChange}
            className="w-full border px-4 py-2 rounded"
            placeholder="Ex: 10000"
            required
          />
        </div>

        {/* Image (URL ou fichier) */}
        <div>
          <label className="block text-sm font-medium mb-2">Image de l'événement</label>
          <div className="flex items-center space-x-4">
            {/* URL */}
            <input
              type="text"
              name="imageUrl"
              value={event.imageUrl}
              onChange={handleImageUrlChange}
              placeholder="Lien de l'image (URL)"
              className="w-full border px-4 py-2 rounded"
            />
            <span className="text-gray-500">ou</span>
            {/* Fichier */}
            <input
              type="file"
              onChange={handleFileChange}
              accept="image/*"
              className="block text-sm text-gray-600"
            />
          </div>
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Preview"
              className="mt-4 w-40 h-40 object-cover rounded"
            />
          )}
        </div>

        {/* Diffusion en direct */}
        <div>
          <input
            type="checkbox"
            id="isLive"
            name="isLive"
            checked={event.isLive}
            onChange={(e) => setEvent({ ...event, isLive: e.target.checked })}
          />
          <label htmlFor="isLive" className="ml-2">
            Diffusion en direct
          </label>
        </div>

        {/* Soumission */}
        {event.isLive && (
          <div>
            <label htmlFor="liveStreamLink" className="block text-sm font-medium text-gray-700">
              Lien de diffusion en direct
            </label>
            <input
              type="text"
              id="liveStreamLink"
              name="liveStreamLink"
              value={event.liveStreamLink}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            />
          </div>
        )}
        <div>
          <label htmlFor="imageFile" className="block text-sm font-medium text-gray-700">
            Télécharger une image
          </label>
          <input
            type="file"
            id="imageFile"
            name="imageFile"
            accept="image/*"
            onChange={handleFileChange}
            className="mt-1 block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer focus:outline-none focus:border-blue-500"
          />
        </div>
        <div>
          <label htmlFor="organizer" className="block text-sm font-medium text-gray-700">
            Organisateur
          </label>
          <input
            type="text"
            id="organizer"
            name="organizer"
            value={event.organizer}
            onChange={handleInputChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          />
        </div>
        <div>
          <label htmlFor="maxAttendees" className="block text-sm font-medium text-gray-700">
            Nombre maximum de participants
          </label>
          <input
            type="number"
            id="maxAttendees"
            name="maxAttendees"
            value={event.maxAttendees}
            onChange={handleInputChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          />
        </div>
        {imagePreview && <img src={imagePreview} alt="Prévisualisation" className="mt-4 max-h-48" />}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? "Ajout en cours..." : "Ajouter l'événement"}
        </button>
      </form>
    </div>
  );
};

export default AddEventPage;
