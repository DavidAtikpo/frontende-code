"use client";

import React, { useState } from "react";

const CreateTrainingPage = () => {
  const [training, setTraining] = useState<{
    title: string;
    description: string;
    price: string;
    category: string;
    startDate: string;
    durationInDays: string;
    isOnline: boolean;
    instructor: string;
  }>({
    title: "",
    description: "",
    price: "",
    category: "",
    startDate: "",
    durationInDays: "",
    isOnline: false,
    instructor: "",
  });

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setTraining({ ...training, [name]: value });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setTraining({ ...training, [name]: checked });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Validation simple
    if (
      !training.title ||
      !training.price ||
      !training.category ||
      !training.startDate ||
      !training.durationInDays ||
      !training.instructor
    ) {
      setErrorMessage("Tous les champs obligatoires doivent être remplis.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/add-training", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...training,
          price: parseFloat(training.price),
          durationInDays: parseInt(training.durationInDays, 10),
        }),
      });

      if (!response.ok) {
        throw new Error("Échec de la création de la formation.");
      }

      setSuccessMessage("Formation créée avec succès !");
      setTraining({
        title: "",
        description: "",
        price: "",
        category: "",
        startDate: "",
        durationInDays: "",
        isOnline: false,
        instructor: "",
      });
    } catch (error) {
      console.error("Erreur lors de la création :", error);
      setErrorMessage("Une erreur est survenue lors de la création de la formation.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Créer une Formation</h1>

      {errorMessage && <p className="mb-4 text-red-600">{errorMessage}</p>}
      {successMessage && <p className="mb-4 text-green-600">{successMessage}</p>}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Titre */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-2">
            Titre de la formation <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={training.title}
            onChange={handleInputChange}
            className="w-full border px-4 py-2 rounded"
            placeholder="Ex: Développement Web"
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
            value={training.description}
            onChange={handleInputChange}
            className="w-full border px-4 py-2 rounded"
            rows={4}
            placeholder="Décrivez la formation..."
          ></textarea>
        </div>

        {/* Prix */}
        <div>
          <label htmlFor="price" className="block text-sm font-medium mb-2">
            Prix (FCFA) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            id="price"
            name="price"
            value={training.price}
            onChange={handleInputChange}
            className="w-full border px-4 py-2 rounded"
            placeholder="Ex: 200000"
            required
          />
        </div>

        {/* Catégorie */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium mb-2">
            Catégorie <span className="text-red-500">*</span>
          </label>
          <select
            id="category"
            name="category"
            value={training.category}
            onChange={handleInputChange}
            className="w-full border px-4 py-2 rounded"
            required
          >
            <option value="">-- Sélectionnez une catégorie --</option>
            <option value="cuisine">Cuisine</option>
            <option value="management">Management</option>
            <option value="informatique">Informatique</option>
            <option value="développement personnel">Développement Personnel</option>
          </select>
        </div>

        {/* Date de Début */}
        <div>
          <label htmlFor="startDate" className="block text-sm font-medium mb-2">
            Date de début <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            value={training.startDate}
            onChange={handleInputChange}
            className="w-full border px-4 py-2 rounded"
            required
          />
        </div>

        {/* Durée */}
        <div>
          <label htmlFor="durationInDays" className="block text-sm font-medium mb-2">
            Durée (en jours) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            id="durationInDays"
            name="durationInDays"
            value={training.durationInDays}
            onChange={handleInputChange}
            className="w-full border px-4 py-2 rounded"
            placeholder="Ex: 30"
            required
          />
        </div>

        {/* En ligne ou en présentiel */}
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="isOnline"
            name="isOnline"
            checked={training.isOnline}
            onChange={handleCheckboxChange}
            className="h-4 w-4"
          />
          <label htmlFor="isOnline" className="text-sm">
            Formation en ligne
          </label>
        </div>

        {/* Instructeur */}
        <div>
          <label htmlFor="instructor" className="block text-sm font-medium mb-2">
            Instructeur <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="instructor"
            name="instructor"
            value={training.instructor}
            onChange={handleInputChange}
            className="w-full border px-4 py-2 rounded"
            placeholder="Nom de l'instructeur"
            required
          />
        </div>

        {/* Bouton de Soumission */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? "Enregistrement..." : "Créer la Formation"}
        </button>
      </form>
    </div>
  );
};

export default CreateTrainingPage;
