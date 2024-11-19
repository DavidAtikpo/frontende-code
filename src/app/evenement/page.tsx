"use client";

import React, { useState, useEffect } from "react";
import { FaCalendarAlt, FaClock, FaMapMarkerAlt, FaCreditCard, FaPlay } from "react-icons/fa";

interface Event {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  country: string;
  continent: string;
  description: string;
  price: number;
  image: string;
  isLive: boolean;
}

const BASE_URL = "http://localhost:5000/api";

const EventPage = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [history, setHistory] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [filteredHistory, setFilteredHistory] = useState<Event[]>([]);

  // Filtres
  const [filters, setFilters] = useState({
    location: "",
    country: "",
    continent: "",
    date: "",
    month: "",
    year: "",
  });

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(`${BASE_URL}/events`);
        const data = await response.json();

        const upcomingEvents = data.filter((event: Event) => new Date(event.date) >= new Date());
        const pastEvents = data.filter((event: Event) => new Date(event.date) < new Date());

        setEvents(upcomingEvents);
        setFilteredEvents(upcomingEvents);

        setHistory(pastEvents);
        setFilteredHistory(pastEvents);
      } catch (error) {
        console.error("Erreur lors de la récupération des événements :", error);
      }
    };

    fetchEvents();
  }, []);

  // Filtrage des événements à venir
  const applyFilters = () => {
    const filtered = events.filter((event) => {
      const eventDate = new Date(event.date);
      const matchesLocation =
        !filters.location || event.location.toLowerCase().includes(filters.location.toLowerCase());
      const matchesCountry =
        !filters.country || event.country.toLowerCase().includes(filters.country.toLowerCase());
      const matchesContinent =
        !filters.continent || event.continent.toLowerCase().includes(filters.continent.toLowerCase());
      const matchesDate = !filters.date || event.date === filters.date;
      const matchesMonth = !filters.month || eventDate.getMonth() + 1 === parseInt(filters.month);
      const matchesYear = !filters.year || eventDate.getFullYear() === parseInt(filters.year);

      return (
        matchesLocation && matchesCountry && matchesContinent && matchesDate && matchesMonth && matchesYear
      );
    });

    setFilteredEvents(filtered);
  };

  // Filtrage des événements passés
  const applyHistoryFilters = () => {
    const filtered = history.filter((event) => {
      const eventDate = new Date(event.date);
      const matchesLocation =
        !filters.location || event.location.toLowerCase().includes(filters.location.toLowerCase());
      const matchesCountry =
        !filters.country || event.country.toLowerCase().includes(filters.country.toLowerCase());
      const matchesContinent =
        !filters.continent || event.continent.toLowerCase().includes(filters.continent.toLowerCase());
      const matchesDate = !filters.date || event.date === filters.date;
      const matchesMonth = !filters.month || eventDate.getMonth() + 1 === parseInt(filters.month);
      const matchesYear = !filters.year || eventDate.getFullYear() === parseInt(filters.year);

      return (
        matchesLocation && matchesCountry && matchesContinent && matchesDate && matchesMonth && matchesYear
      );
    });

    setFilteredHistory(filtered);
  };

  // Gérer les changements de filtres
  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Événements</h1>

      {/* Filtres */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        <input
          type="text"
          placeholder="Lieu"
          className="border rounded px-4 py-2"
          value={filters.location}
          onChange={(e) => handleFilterChange("location", e.target.value)}
        />
        <input
          type="text"
          placeholder="Pays"
          className="border rounded px-4 py-2"
          value={filters.country}
          onChange={(e) => handleFilterChange("country", e.target.value)}
        />
        <input
          type="text"
          placeholder="Continent"
          className="border rounded px-4 py-2"
          value={filters.continent}
          onChange={(e) => handleFilterChange("continent", e.target.value)}
        />
        <input
          type="date"
          className="border rounded px-4 py-2"
          value={filters.date}
          onChange={(e) => handleFilterChange("date", e.target.value)}
        />
        <input
          type="number"
          placeholder="Mois (1-12)"
          className="border rounded px-4 py-2"
          value={filters.month}
          onChange={(e) => handleFilterChange("month", e.target.value)}
        />
        <input
          type="number"
          placeholder="Année"
          className="border rounded px-4 py-2"
          value={filters.year}
          onChange={(e) => handleFilterChange("year", e.target.value)}
        />
      </div>
      <div className="flex gap-4 mb-6">
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={applyFilters}
        >
          Filtrer Événements
        </button>
        <button
          className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
          onClick={applyHistoryFilters}
        >
          Filtrer Historique
        </button>
      </div>

      {/* Section Nouveaux événements */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">Événements à venir</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <div
              key={event.id}
              className="border rounded-lg shadow hover:shadow-lg transition p-4 bg-white"
            >
              <img
                src={event.image}
                alt={event.title}
                className="w-full h-40 object-cover rounded-md mb-4"
              />
              <h3 className="text-xl font-bold mb-2">{event.title}</h3>
              <p className="text-gray-600 mb-2 flex items-center">
                <FaCalendarAlt className="mr-2" /> {event.date}
              </p>
              <p className="text-gray-600 mb-2 flex items-center">
                <FaClock className="mr-2" /> {event.time}
              </p>
              <p className="text-gray-600 mb-4 flex items-center">
                <FaMapMarkerAlt className="mr-2" /> {event.location}
              </p>
              <p className="text-gray-800 mb-4">{event.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Section Historique des événements */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Historique des événements</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHistory.map((event) => (
            <div
              key={event.id}
              className="border rounded-lg shadow p-4 bg-gray-50"
            >
              <h3 className="text-xl font-bold mb-2">{event.title}</h3>
              <p className="text-gray-600 mb-2 flex items-center">
                <FaCalendarAlt className="mr-2" /> {event.date}
              </p>
              <p className="text-gray-600 mb-2 flex items-center">
                <FaClock className="mr-2" /> {event.time}
              </p>
              <p className="text-gray-600 mb-2 flex items-center">
                <FaMapMarkerAlt className="mr-2" /> {event.location}
              </p>
              <p className="text-gray-800 mb-4">{event.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default EventPage;
