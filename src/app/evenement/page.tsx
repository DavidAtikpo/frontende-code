// "use client";

// import React, { useState, useEffect } from "react";
// import { FaCalendarAlt, FaClock, FaMapMarkerAlt, FaCreditCard, FaPlay } from "react-icons/fa";

// interface Event {
//   id: number;
//   title: string;
//   date: string;
//   time: string;
//   location: string;
//   country: string;
//   continent: string;
//   description: string;
//   price: number;
//   image: string;
//   isLive: boolean;
// }

// const BASE_URL = "http://localhost:5000/api";

// const EventPage = () => {
//   const [events, setEvents] = useState<Event[]>([]);
//   const [history, setHistory] = useState<Event[]>([]);
//   const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
//   const [filteredHistory, setFilteredHistory] = useState<Event[]>([]);

//   // Filtres
//   const [filters, setFilters] = useState({
//     location: "",
//     country: "",
//     continent: "",
//     date: "",
//     month: "",
//     year: "",
//   });

//   useEffect(() => {
//     const fetchEvents = async () => {
//       try {
//         const response = await fetch(`${BASE_URL}/events`);
//         const data = await response.json();

//         const upcomingEvents = data.filter((event: Event) => new Date(event.date) >= new Date());
//         const pastEvents = data.filter((event: Event) => new Date(event.date) < new Date());

//         setEvents(upcomingEvents);
//         setFilteredEvents(upcomingEvents);

//         setHistory(pastEvents);
//         setFilteredHistory(pastEvents);
//       } catch (error) {
//         console.error("Erreur lors de la récupération des événements :", error);
//       }
//     };

//     fetchEvents();
//   }, []);

//   // Filtrage des événements à venir
//   const applyFilters = () => {
//     const filtered = events.filter((event) => {
//       const eventDate = new Date(event.date);
//       const matchesLocation =
//         !filters.location || event.location.toLowerCase().includes(filters.location.toLowerCase());
//       const matchesCountry =
//         !filters.country || event.country.toLowerCase().includes(filters.country.toLowerCase());
//       const matchesContinent =
//         !filters.continent || event.continent.toLowerCase().includes(filters.continent.toLowerCase());
//       const matchesDate = !filters.date || event.date === filters.date;
//       const matchesMonth = !filters.month || eventDate.getMonth() + 1 === parseInt(filters.month);
//       const matchesYear = !filters.year || eventDate.getFullYear() === parseInt(filters.year);

//       return (
//         matchesLocation && matchesCountry && matchesContinent && matchesDate && matchesMonth && matchesYear
//       );
//     });

//     setFilteredEvents(filtered);
//   };

//   // Filtrage des événements passés
//   const applyHistoryFilters = () => {
//     const filtered = history.filter((event) => {
//       const eventDate = new Date(event.date);
//       const matchesLocation =
//         !filters.location || event.location.toLowerCase().includes(filters.location.toLowerCase());
//       const matchesCountry =
//         !filters.country || event.country.toLowerCase().includes(filters.country.toLowerCase());
//       const matchesContinent =
//         !filters.continent || event.continent.toLowerCase().includes(filters.continent.toLowerCase());
//       const matchesDate = !filters.date || event.date === filters.date;
//       const matchesMonth = !filters.month || eventDate.getMonth() + 1 === parseInt(filters.month);
//       const matchesYear = !filters.year || eventDate.getFullYear() === parseInt(filters.year);

//       return (
//         matchesLocation && matchesCountry && matchesContinent && matchesDate && matchesMonth && matchesYear
//       );
//     });

//     setFilteredHistory(filtered);
//   };

//   // Gérer les changements de filtres
//   const handleFilterChange = (key: string, value: string) => {
//     setFilters((prev) => ({ ...prev, [key]: value }));
//   };

//   return (
//     <div className="max-w-7xl mx-auto p-6">
//       <h1 className="text-3xl font-bold mb-8">Événements</h1>

//       {/* Filtres */}
//       <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
//         <input
//           type="text"
//           placeholder="Lieu"
//           className="border rounded px-4 py-2"
//           value={filters.location}
//           onChange={(e) => handleFilterChange("location", e.target.value)}
//         />
//         <input
//           type="text"
//           placeholder="Pays"
//           className="border rounded px-4 py-2"
//           value={filters.country}
//           onChange={(e) => handleFilterChange("country", e.target.value)}
//         />
//         <input
//           type="text"
//           placeholder="Continent"
//           className="border rounded px-4 py-2"
//           value={filters.continent}
//           onChange={(e) => handleFilterChange("continent", e.target.value)}
//         />
//         <input
//           type="date"
//           className="border rounded px-4 py-2"
//           value={filters.date}
//           onChange={(e) => handleFilterChange("date", e.target.value)}
//         />
//         <input
//           type="number"
//           placeholder="Mois (1-12)"
//           className="border rounded px-4 py-2"
//           value={filters.month}
//           onChange={(e) => handleFilterChange("month", e.target.value)}
//         />
//         <input
//           type="number"
//           placeholder="Année"
//           className="border rounded px-4 py-2"
//           value={filters.year}
//           onChange={(e) => handleFilterChange("year", e.target.value)}
//         />
//       </div>
//       <div className="flex gap-4 mb-6">
//         <button
//           className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
//           onClick={applyFilters}
//         >
//           Filtrer Événements
//         </button>
//         <button
//           className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
//           onClick={applyHistoryFilters}
//         >
//           Filtrer Historique
//         </button>
//       </div>

//       {/* Section Nouveaux événements */}
//       <section className="mb-12">
//         <h2 className="text-2xl font-bold mb-4">Événements à venir</h2>
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {filteredEvents.map((event) => (
//             <div
//               key={event.id}
//               className="border rounded-lg shadow hover:shadow-lg transition p-4 bg-white"
//             >
//               <img
//                 src={event.image}
//                 alt={event.title}
//                 className="w-full h-40 object-cover rounded-md mb-4"
//               />
//               <h3 className="text-xl font-bold mb-2">{event.title}</h3>
//               <p className="text-gray-600 mb-2 flex items-center">
//                 <FaCalendarAlt className="mr-2" /> {event.date}
//               </p>
//               <p className="text-gray-600 mb-2 flex items-center">
//                 <FaClock className="mr-2" /> {event.time}
//               </p>
//               <p className="text-gray-600 mb-4 flex items-center">
//                 <FaMapMarkerAlt className="mr-2" /> {event.location}
//               </p>
//               <p className="text-gray-800 mb-4">{event.description}</p>
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* Section Historique des événements */}
//       <section>
//         <h2 className="text-2xl font-bold mb-4">Historique des événements</h2>
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {filteredHistory.map((event) => (
//             <div
//               key={event.id}
//               className="border rounded-lg shadow p-4 bg-gray-50"
//             >
//               <h3 className="text-xl font-bold mb-2">{event.title}</h3>
//               <p className="text-gray-600 mb-2 flex items-center">
//                 <FaCalendarAlt className="mr-2" /> {event.date}
//               </p>
//               <p className="text-gray-600 mb-2 flex items-center">
//                 <FaClock className="mr-2" /> {event.time}
//               </p>
//               <p className="text-gray-600 mb-2 flex items-center">
//                 <FaMapMarkerAlt className="mr-2" /> {event.location}
//               </p>
//               <p className="text-gray-800 mb-4">{event.description}</p>
//             </div>
//           ))}
//         </div>
//       </section>
//     </div>
//   );
// };

// export default EventPage;


"use client";

import React, { useState } from "react";

const EventPage = () => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [events, setEvents] = useState([
    {
      id: 1,
      title: "Mariages Planifiés à la Perfection",
      category: "Mariages",
      date: "2024-12-15",
      location: "Cotonou, Bénin",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRxoljsgeMUKhxyPOxZBlUklYqQVtykK0M78g&s",
      description: "Organisez votre mariage de rêve avec nos experts.",
    },
    {
      id: 2,
      title: "Festival de Musique",
      category: "Fêtes et occasions",
      date: "2024-12-25",
      location: "Abomey-Calavi, Bénin",
      image: "data:image/jpeg;base64,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",
      description:
        "Un festival vibrant avec les meilleurs artistes et DJ de la région.",
    },
    {
      id: 3,
      title: "Conférence Internationale",
      category: "Conférences",
      date: "2025-01-10",
      location: "Porto-Novo, Bénin",
      image: "data:image/jpeg;base64,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",
      description:
        "Rejoignez des experts internationaux pour discuter des tendances technologiques.",
    },
  ]);

  const filteredEvents = events.filter(
    (event) =>
      (category === "All" || event.category === category) &&
      event.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      {/* Header */}
      <header className="mb-10 text-center">
        <h1 className="text-4xl font-bold">Organisation d'Événements</h1>
        <p className="text-gray-600 mt-4">
          Trouvez et planifiez les meilleurs événements à venir.
        </p>
      </header>

      {/* Filtres */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <input
          type="text"
          placeholder="Rechercher un événement"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded px-4 py-2 w-full sm:w-1/3 mb-4 sm:mb-0"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border rounded px-4 py-2 w-full sm:w-1/3"
        >
          <option value="All">Toutes les catégories</option>
          <option value="Mariages">Mariages</option>
          <option value="Fêtes et occasions">Fêtes et occasions</option>
          <option value="Conférences">Conférences</option>
        </select>
      </div>

      {/* Liste des événements */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.map((event) => (
          <div
            key={event.id}
            className="border rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition"
          >
            <img
              src={event.image}
              alt={event.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="font-bold text-lg">{event.title}</h3>
              <p className="text-gray-500 text-sm">{event.category}</p>
              <p className="mt-2 text-gray-600">{event.description}</p>
              <p className="mt-4 text-sm text-blue-600 font-semibold">
                📅 {event.date} | 📍 {event.location}
              </p>
              <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-800 transition w-full">
                Réserver maintenant
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Section Contact */}
      <section className="mt-12 bg-gray-100 p-6 rounded-lg">
        <h2 className="text-2xl font-bold text-center mb-4">Contactez-nous</h2>
        <p className="text-gray-600 text-center mb-6">
          Pour toute question ou demande d'organisation d'événement, contactez
          notre équipe.
        </p>
        <form className="max-w-lg mx-auto space-y-4">
          <input
            type="text"
            placeholder="Votre nom"
            className="w-full border rounded px-4 py-2"
          />
          <input
            type="email"
            placeholder="Votre email"
            className="w-full border rounded px-4 py-2"
          />
          <textarea
            placeholder="Votre message"
            className="w-full border rounded px-4 py-2"
            rows={5}
          ></textarea>
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-800 transition w-full">
            Envoyer le message
          </button>
        </form>
      </section>
    </div>
  );
};

export default EventPage;

