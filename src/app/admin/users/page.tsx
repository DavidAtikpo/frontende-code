// "use client";

// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation"; // Import correct pour Next.js 13
// import { Search, Eye, Mail, Phone } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Card } from "@/components/ui/card";

// const BASE_URL = "http://localhost:5000/api";

// interface User {
//   _id: string;
//   name?: string;
//   displayName?: string;
//   email?: string;
//   mobile?: string;
//   region?: string;
//   zipCode?: string;
//   avatar?: string;
//   status?: "En ligne" | "Hors ligne";
//   lastConnection?: string;
// }

// export default function UsersListPage() {
//   const [users, setUsers] = useState<User[]>([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState("");
//   const router = useRouter(); // Assurez-vous d'utiliser le bon hook pour le routage

//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         const response = await fetch(`${BASE_URL}/admin/getuser`, {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         });

//         if (!response.ok) {
//           throw new Error("Erreur lors du chargement des utilisateurs");
//         }

//         const data = await response.json();
//         setUsers(data);
//       } catch (err: unknown) {
//         setError(err.message || "Une erreur est survenue");
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchUsers();
//   }, []);

//   const filteredUsers = users.filter((user) => {
//     const name = user.name?.toLowerCase() || "";
//     const email = user.email?.toLowerCase() || "";
//     return (
//       name.includes(searchTerm.toLowerCase()) ||
//       email.includes(searchTerm.toLowerCase())
//     );
//   });

//   const handleViewUser = (id: string) => {
//     router.push(`/admin/users/${id}`);
//   };

//   if (isLoading) {
//     return (
//       <div className="flex justify-center items-center min-h-screen">
//         <p>Chargement des utilisateurs...</p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex justify-center items-center min-h-screen">
//         <p className="text-red-600">Erreur : {error}</p>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       <div className="flex justify-between items-center">
//         <h1 className="text-2xl font-bold">Utilisateurs</h1>
//       </div>

//       <div className="flex items-center space-x-4 bg-white p-4 rounded-lg shadow">
//         <div className="relative flex-1">
//           <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//           <Input
//             type="search"
//             placeholder="Rechercher un utilisateur..."
//             className="pl-10"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//         </div>
//       </div>

//       <Card>
//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead className="bg-gray-50 border-b">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
//                   Utilisateur
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
//                   Contact
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
//                   Région
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
//                   Status
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
//                   Actions
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {filteredUsers.map((user) => (
//                 <tr key={user._id} className="hover:bg-gray-50">
//                   <td className="px-6 py-4">
//                     <div className="flex items-center">
//                       <img
//                         src={user.avatar || "/user-profile-svgrepo-com (1).svg"}
//                         alt={user.name || "Utilisateur"}
//                         className="h-10 w-10 rounded-full object-cover"
//                       />
//                       <div className="ml-4">
//                         <div className="text-sm font-medium text-gray-900">
//                           {user.displayName || "Nom inconnu"}
//                         </div>
//                         <div className="text-sm text-gray-500">
//                           {user.name || "Non renseigné"}
//                         </div>
//                       </div>
//                     </div>
//                   </td>
//                   <td className="px-6 py-4">
//                     <div className="text-sm text-gray-900 flex items-center">
//                       <Mail className="h-4 w-4 mr-2" />
//                       {user.email || "Non renseigné"}
//                     </div>
//                     <div className="text-sm text-gray-500 flex items-center mt-1">
//                       <Phone className="h-4 w-4 mr-2" />
//                       {user.mobile || "Non renseigné"}
//                     </div>
//                   </td>
//                   <td className="px-6 py-4">
//                     <div className="text-sm text-gray-900">
//                       {user.region || "Non renseigné"}
//                     </div>
//                     <div className="text-sm text-gray-500">
//                       {user.zipCode || "Non renseigné"}
//                     </div>
//                   </td>
//                   <td className="px-6 py-4">
//                     <span
//                       className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
//                         user.status === "En ligne"
//                           ? "bg-green-100 text-green-800"
//                           : "bg-gray-100 text-gray-800"
//                       }`}
//                     >
//                       {user.status || "Hors ligne"}
//                     </span>
//                   </td>
//                   <td className="px-6 py-4">
//                     <Button
//                       onClick={() => handleViewUser(user._id)}
//                       variant="ghost"
//                       size="sm"
//                     >
//                       <Eye className="h-4 w-4" />
//                     </Button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </Card>
//     </div>
//   );
// }


"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Import correct pour Next.js 13
import Image from "next/image"; // Importation du composant Image
import { Search, Eye, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

const BASE_URL = "http://localhost:5000/api";

interface User {
  _id: string;
  name?: string;
  displayName?: string;
  email?: string;
  mobile?: string;
  region?: string;
  zipCode?: string;
  avatar?: string;
  status?: "En ligne" | "Hors ligne";
  lastConnection?: string;
}

export default function UsersListPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter(); // Assurez-vous d'utiliser le bon hook pour le routage

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${BASE_URL}/admin/getuser`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!response.ok) {
          throw new Error("Erreur lors du chargement des utilisateurs");
        }

        const data = await response.json();
        setUsers(data);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Une erreur est survenue");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = users.filter((user) => {
    const name = user.name?.toLowerCase() || "";
    const email = user.email?.toLowerCase() || "";
    return (
      name.includes(searchTerm.toLowerCase()) ||
      email.includes(searchTerm.toLowerCase())
    );
  });

  const handleViewUser = (id: string) => {
    router.push(`/admin/users/${id}`);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Chargement des utilisateurs...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-red-600">Erreur : {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Utilisateurs</h1>
      </div>

      <div className="flex items-center space-x-4 bg-white p-4 rounded-lg shadow">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            type="search"
            placeholder="Rechercher un utilisateur..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Utilisateur
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Région
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <Image
                        src={user.avatar || "/user-profile-svgrepo-com (1).svg"}
                        alt={user.name || "Utilisateur"}
                        width={40} // Largeur de l'image
                        height={40} // Hauteur de l'image
                        className="h-10 w-10 rounded-full object-cover"
                      />
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {user.displayName || "Nom inconnu"}
                        </div>
                        <div className="text-sm text-gray-500">
                          {user.name || "Non renseigné"}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 flex items-center">
                      <Mail className="h-4 w-4 mr-2" />
                      {user.email || "Non renseigné"}
                    </div>
                    <div className="text-sm text-gray-500 flex items-center mt-1">
                      <Phone className="h-4 w-4 mr-2" />
                      {user.mobile || "Non renseigné"}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {user.region || "Non renseigné"}
                    </div>
                    <div className="text-sm text-gray-500">
                      {user.zipCode || "Non renseigné"}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.status === "En ligne"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {user.status || "Hors ligne"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <Button
                      onClick={() => handleViewUser(user._id)}
                      variant="ghost"
                      size="sm"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
