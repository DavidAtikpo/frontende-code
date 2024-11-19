"use client";

import React, { useState } from "react";

const AddEventPage = () => {
  const [event, setEvent] = useState({
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
    tags: "",
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEvent({ ...event, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setEvent({ ...event, imageFile: file, imageUrl: "" });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setEvent({ ...event, imageUrl: value, imageFile: null });
    setImagePreview(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      Object.entries(event).forEach(([key, value]) => {
        if (value && key !== "imageFile" && key !== "imageUrl") {
          formData.append(key, value as string);
        }
      });

      if (event.imageFile) {
        formData.append("image", event.imageFile);
      } else if (event.imageUrl) {
        formData.append("imageUrl", event.imageUrl);
      }

      console.log("FormData:", Array.from(formData.entries())); // Log toutes les données envoyées

      const response = await fetch("http://localhost:5000/api/create-event", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Échec de l'ajout de l'événement.");
      }

      const data = await response.json();
      console.log("Réponse API:", data);

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
        tags: "",
      });
      setImagePreview(null);
    } catch (error) {
      console.error("Erreur API:", error);
      setSuccessMessage("Une erreur est survenue lors de l'ajout de l'événement.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Ajouter un événement</h1>

      {successMessage && <p className="mb-4 text-green-600">{successMessage}</p>}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Champs de Formulaire */}
        {/* Ajoutez ici les champs du formulaire comme dans votre code précédent */}

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
