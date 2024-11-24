"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, Trash2, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Link from "next/link";

interface Chapter {
  id: string;
  title: string;
  description: string;
  duration: string;
  content: {
    type: "video" | "text" | "quiz";
    data: string;
  }[];
}

export default function AddTrainingPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startDate: "",
    duration: "",
    instructor: "",
    maxParticipants: "",
    price: "",
    level: "",
    image: null as File | null,
  });
  const [chapters, setChapters] = useState<Chapter[]>([]);
  // const [ setImagePreview] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  // const [ setError] = useState("");
  // const [ setSuccess] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   if (e.target.files && e.target.files[0]) {
  //     const file = e.target.files[0];
  //     setFormData({ ...formData, image: file });
  //     setImagePreview(URL.createObjectURL(file));
  //   }
  // };

  const addChapter = () => {
    const newChapter: Chapter = {
      id: Date.now().toString(),
      title: "",
      description: "",
      duration: "",
      content: [],
    };
    setChapters([...chapters, newChapter]);
  };

  const updateChapter = (id: string, field: string, value: string) => {
    setChapters(chapters.map(chapter => 
      chapter.id === id ? { ...chapter, [field]: value } : chapter
    ));
  };

  const addContent = (chapterId: string, type: "video" | "text" | "quiz") => {
    setChapters(chapters.map(chapter => {
      if (chapter.id === chapterId) {
        return {
          ...chapter,
          content: [...chapter.content, { type, data: "" }]
        };
      }
      return chapter;
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // setError("");
  
    try {
      // API call will be implemented later
    //   setSuccess("Formation créée avec succès !");
      router.push("/admin/trainings");
    } catch (err: unknown) { // Utilisez `unknown` pour capturer les erreurs
      if (err instanceof Error) {
        // setError(err.message); // Utilisez la propriété `message` si c'est une erreur
      } else {
        // setError("Une erreur inconnue s'est produite."); // Gestion des erreurs non-standards
      }
    } finally {
      setIsLoading(false);
    }
  };
  

  return (
    <div className="container max-w-4xl mx-auto p-4">
      <div className="flex items-center mb-6">
        <Link href="/admin/trainings">
          <Button variant="ghost" className="mr-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Créer une formation</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 gap-6">
              {/* Informations générales */}
              <div className="col-span-2 space-y-4">
                <h2 className="text-xl font-semibold">Informations générales</h2>
                
                <div className="space-y-2">
                  <Label htmlFor="title">Titre de la formation</Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    required
                  />
                </div>

                {/* Autres champs du formulaire... */}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section des chapitres */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Chapitres</h2>
                <Button type="button" onClick={addChapter}>
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter un chapitre
                </Button>
              </div>

              {chapters.map((chapter) => (
                <div key={chapter.id} className="border rounded-lg p-4 space-y-4">
                  <div className="flex items-center gap-2">
                    <GripVertical className="h-5 w-5 text-gray-400" />
                    <div className="flex-1">
                      <Input
                        placeholder="Titre du chapitre"
                        value={chapter.title}
                        onChange={(e) => updateChapter(chapter.id, "title", e.target.value)}
                      />
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setChapters(chapters.filter(c => c.id !== chapter.id))}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>

                  {/* Contenu du chapitre */}
                  <div className="pl-7 space-y-4">
                    {/* Boutons d'ajout de contenu */}
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => addContent(chapter.id, "video")}
                      >
                        Ajouter une vidéo
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => addContent(chapter.id, "text")}
                      >
                        Ajouter du texte
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => addContent(chapter.id, "quiz")}
                      >
                        Ajouter un quiz
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Boutons de soumission */}
        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/admin/trainings')}
          >
            Annuler
          </Button>
          <Button
            type="submit"
            className="bg-[#1D4ED8] hover:bg-[#1e40af]"
            disabled={isLoading}
          >
            {isLoading ? "Création en cours..." : "Créer la formation"}
          </Button>
        </div>
      </form>
    </div>
  );
} 

// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { ArrowLeft, Plus, Trash2, GripVertical } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import Link from "next/link";

// interface Chapter {
//   id: string;
//   title: string;
//   description: string;
//   duration: string;
//   content: {
//     type: "video" | "text" | "quiz";
//     data: string;
//   }[];
// }

// export default function AddTrainingPage() {
//   const router = useRouter();
//   const [formData, setFormData] = useState({
//     title: "",
//     description: "",
//     startDate: "",
//     duration: "",
//     instructor: "",
//     maxParticipants: "",
//     price: "",
//     level: "",
//     image: null as File | null,
//   });
//   const [chapters, setChapters] = useState<Chapter[]>([]);
//   const [ setSuccess] = useState<string>(""); // Message de succès
//   const [ setError] = useState<string>(""); // Message d'erreur
//   const [isLoading, setIsLoading] = useState<boolean>(false); // État de chargement

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const addChapter = () => {
//     const newChapter: Chapter = {
//       id: Date.now().toString(),
//       title: "",
//       description: "",
//       duration: "",
//       content: [],
//     };
//     setChapters([...chapters, newChapter]);
//   };

//   const updateChapter = (id: string, field: string, value: string) => {
//     setChapters(
//       chapters.map((chapter) =>
//         chapter.id === id ? { ...chapter, [field]: value } : chapter
//       )
//     );
//   };

//   const addContent = (chapterId: string, type: "video" | "text" | "quiz") => {
//     setChapters(
//       chapters.map((chapter) => {
//         if (chapter.id === chapterId) {
//           return {
//             ...chapter,
//             content: [...chapter.content, { type, data: "" }],
//           };
//         }
//         return chapter;
//       })
//     );
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsLoading(true);
//     setError("");

//     try {
//       // API call will be implemented later
//       setSuccess("Formation créée avec succès !");
//       router.push("/admin/trainings");
//     } catch (err: unknown) {
//       if (err instanceof Error) {
//         setError(err.message);
//       } else {
//         setError("Une erreur inconnue s'est produite.");
//       }
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="container max-w-4xl mx-auto p-4">
//       <div className="flex items-center mb-6">
//         <Link href="/admin/trainings">
//           <Button variant="ghost" className="mr-4">
//             <ArrowLeft className="h-4 w-4 mr-2" />
//             Retour
//           </Button>
//         </Link>
//         <h1 className="text-2xl font-bold">Créer une formation</h1>
//       </div>

//       <form onSubmit={handleSubmit} className="space-y-6">
//         <Card>
//           <CardContent className="pt-6">
//             <div className="grid grid-cols-2 gap-6">
//               {/* Informations générales */}
//               <div className="col-span-2 space-y-4">
//                 <h2 className="text-xl font-semibold">Informations générales</h2>

//                 <div className="space-y-2">
//                   <Label htmlFor="title">Titre de la formation</Label>
//                   <Input
//                     id="title"
//                     name="title"
//                     value={formData.title}
//                     onChange={handleChange}
//                     required
//                   />
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="description">Description</Label>
//                   <Textarea
//                     id="description"
//                     name="description"
//                     value={formData.description}
//                     onChange={handleChange}
//                     rows={4}
//                     required
//                   />
//                 </div>
//               </div>
//             </div>
//           </CardContent>
//         </Card>

//         {/* Section des chapitres */}
//         <Card>
//           <CardContent className="pt-6">
//             <div className="space-y-4">
//               <div className="flex justify-between items-center">
//                 <h2 className="text-xl font-semibold">Chapitres</h2>
//                 <Button type="button" onClick={addChapter}>
//                   <Plus className="h-4 w-4 mr-2" />
//                   Ajouter un chapitre
//                 </Button>
//               </div>

//               {chapters.map((chapter) => (
//                 <div key={chapter.id} className="border rounded-lg p-4 space-y-4">
//                   <div className="flex items-center gap-2">
//                     <GripVertical className="h-5 w-5 text-gray-400" />
//                     <div className="flex-1">
//                       <Input
//                         placeholder="Titre du chapitre"
//                         value={chapter.title}
//                         onChange={(e) =>
//                           updateChapter(chapter.id, "title", e.target.value)
//                         }
//                       />
//                     </div>
//                     <Button
//                       type="button"
//                       variant="ghost"
//                       size="sm"
//                       onClick={() =>
//                         setChapters(chapters.filter((c) => c.id !== chapter.id))
//                       }
//                     >
//                       <Trash2 className="h-4 w-4 text-red-500" />
//                     </Button>
//                   </div>

//                   {/* Contenu du chapitre */}
//                   <div className="pl-7 space-y-4">
//                     {/* Boutons d'ajout de contenu */}
//                     <div className="flex gap-2">
//                       <Button
//                         type="button"
//                         variant="outline"
//                         size="sm"
//                         onClick={() => addContent(chapter.id, "video")}
//                       >
//                         Ajouter une vidéo
//                       </Button>
//                       <Button
//                         type="button"
//                         variant="outline"
//                         size="sm"
//                         onClick={() => addContent(chapter.id, "text")}
//                       >
//                         Ajouter du texte
//                       </Button>
//                       <Button
//                         type="button"
//                         variant="outline"
//                         size="sm"
//                         onClick={() => addContent(chapter.id, "quiz")}
//                       >
//                         Ajouter un quiz
//                       </Button>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </CardContent>
//         </Card>

//         {/* Boutons de soumission */}
//         <div className="flex justify-end space-x-4">
//           <Button
//             type="button"
//             variant="outline"
//             onClick={() => router.push("/admin/trainings")}
//           >
//             Annuler
//           </Button>
//           <Button
//             type="submit"
//             className="bg-[#1D4ED8] hover:bg-[#1e40af]"
//             disabled={isLoading}
//           >
//             {isLoading ? "Création en cours..." : "Créer la formation"}
//           </Button>
//         </div>
//       </form>
//     </div>
//   );
// }
