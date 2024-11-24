// "use client";

// import { useState, useEffect } from "react";
// import Link from "next/link";
// import { Search, Plus, Calendar, Book, Users, Clock } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Card } from "@/components/ui/card";

// const BASE_URL = "http://localhost:5000/api";

// interface Training {
//   id: string;
//   title: string;
//   description: string;
//   startDate: string;
//   duration: string;
//   instructor: string;
//   maxParticipants: number;
//   currentParticipants: number;
//   price: number;
//   level: "Débutant" | "Intermédiaire" | "Avancé";
//   image: string;
//   status: "À venir" | "En cours" | "Terminé";
// }

// export default function TrainingsPage() {
//   const [trainings, setTrainings] = useState<Training[]>([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [ setIsLoading] = useState(true);
//   const [ setError] = useState("");

//   useEffect(() => {
//     const fetchTrainings = async () => {
//       try {
//         const response = await fetch(`${BASE_URL}/trainings`, {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("authToken")}`,
//           },
//         });

//         if (!response.ok) {
//           throw new Error("Erreur lors du chargement des formations");
//         }

//         const data = await response.json();
//         setTrainings(data);
//       } catch (err: unknown) {
//         setError(err.message);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchTrainings();
//   }, []);

//   const getLevelColor = (level: string) => {
//     switch (level) {
//       case "Débutant": return "bg-green-100 text-green-800";
//       case "Intermédiaire": return "bg-yellow-100 text-yellow-800";
//       case "Avancé": return "bg-red-100 text-red-800";
//       default: return "bg-gray-100 text-gray-800";
//     }
//   };

//   return (
//     <div className="space-y-6">
//       <div className="flex justify-between items-center">
//         <h1 className="text-2xl font-bold">Formations</h1>
//         <Link href="/admin/trainings/add">
//           <Button className="bg-[#1D4ED8] hover:bg-[#1e40af]">
//             <Plus className="h-4 w-4 mr-2" />
//             Ajouter une formation
//           </Button>
//         </Link>
//       </div>

//       <div className="flex items-center space-x-4 bg-white p-4 rounded-lg shadow">
//         <div className="relative flex-1">
//           <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//           <Input
//             type="search"
//             placeholder="Rechercher une formation..."
//             className="pl-10"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//         </div>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {trainings.map((training) => (
//           <Card key={training.id} className="overflow-hidden">
//             <img 
//               src={training.image} 
//               alt={training.title}
//               className="w-full h-48 object-cover"
//             />
//             <div className="p-4">
//               <div className="flex justify-between items-start mb-2">
//                 <h3 className="font-semibold text-lg">{training.title}</h3>
//                 <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getLevelColor(training.level)}`}>
//                   {training.level}
//                 </span>
//               </div>
              
//               <div className="space-y-2 text-sm text-gray-600">
//                 <div className="flex items-center">
//                   <Calendar className="h-4 w-4 mr-2" />
//                   {new Date(training.startDate).toLocaleDateString()}
//                 </div>
//                 <div className="flex items-center">
//                   <Clock className="h-4 w-4 mr-2" />
//                   {training.duration}
//                 </div>
//                 <div className="flex items-center">
//                   <Book className="h-4 w-4 mr-2" />
//                   {training.instructor}
//                 </div>
//                 <div className="flex items-center">
//                   <Users className="h-4 w-4 mr-2" />
//                   {training.currentParticipants}/{training.maxParticipants} participants
//                 </div>
//               </div>

//               <div className="mt-4 flex justify-between items-center">
//                 <span className="font-semibold text-lg">
//                   {training.price.toLocaleString()} FCFA
//                 </span>
//                 <Link href={`/admin/trainings/${training.id}`}>
//                   <Button variant="outline" size="sm">
//                     Voir plus
//                   </Button>
//                 </Link>
//               </div>
//             </div>
//           </Card>
//         ))}
//       </div>
//     </div>
//   );
// } 

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image"; // Importation du composant Image
import { Search, Plus, Calendar, Book, Users, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

const BASE_URL = "http://localhost:5000/api";

interface Training {
  id: string;
  title: string;
  description: string;
  startDate: string;
  duration: string;
  instructor: string;
  maxParticipants: number;
  currentParticipants: number;
  price: number;
  level: "Débutant" | "Intermédiaire" | "Avancé";
  image: string;
  status: "À venir" | "En cours" | "Terminé";
}

export default function TrainingsPage() {
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  // const [ setIsLoading] = useState(true);
  // const [ setError] = useState("");

  useEffect(() => {
    const fetchTrainings = async () => {
      try {
        const response = await fetch(`${BASE_URL}/trainings`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });

        if (!response.ok) {
          throw new Error("Erreur lors du chargement des formations");
        }

        const data = await response.json();
        setTrainings(data);
      } catch (err: unknown) {
        console.log(err);
        
        // setError(err instanceof Error ? err.message : "Erreur inconnue");
      } finally {
        // setIsLoading(false);
      }
    };

    fetchTrainings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Débutant": return "bg-green-100 text-green-800";
      case "Intermédiaire": return "bg-yellow-100 text-yellow-800";
      case "Avancé": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Formations</h1>
        <Link href="/admin/trainings/add">
          <Button className="bg-[#1D4ED8] hover:bg-[#1e40af]">
            <Plus className="h-4 w-4 mr-2" />
            Ajouter une formation
          </Button>
        </Link>
      </div>

      <div className="flex items-center space-x-4 bg-white p-4 rounded-lg shadow">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            type="search"
            placeholder="Rechercher une formation..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {trainings.map((training) => (
          <Card key={training.id} className="overflow-hidden">
            <Image
              src={training.image}
              alt={training.title}
              width={400} // Ajustez les dimensions selon vos besoins
              height={200}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-lg">{training.title}</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getLevelColor(training.level)}`}>
                  {training.level}
                </span>
              </div>
              
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  {new Date(training.startDate).toLocaleDateString()}
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  {training.duration}
                </div>
                <div className="flex items-center">
                  <Book className="h-4 w-4 mr-2" />
                  {training.instructor}
                </div>
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-2" />
                  {training.currentParticipants}/{training.maxParticipants} participants
                </div>
              </div>

              <div className="mt-4 flex justify-between items-center">
                <span className="font-semibold text-lg">
                  {training.price.toLocaleString()} FCFA
                </span>
                <Link href={`/admin/trainings/${training.id}`}>
                  <Button variant="outline" size="sm">
                    Voir plus
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
