// "use client";

// import { Button } from "@/components/ui/button";
// import { Label } from "@/components/ui/label";
// import { FileText, Download, Check, X } from "lucide-react";

// interface RequestDetailsDialogProps {
//   request: SellerRequest | null;
//   onClose: () => void;
//   onUpdateStatus: (requestId: string, status: "APPROVED" | "REJECTED") => Promise<void>;
//   isLoading: boolean;
// }

// export default function RequestDetailsDialog({
//   request,
//   // onClose,
//   onUpdateStatus,
//   isLoading
// }: RequestDetailsDialogProps) {
//   if (!request) return null;

//   const handleDownload = (documentUrl: string,
//     //  documentName: string
//     ) => {
//     window.open(documentUrl, '_blank');
//   };

//   return (
//     <div className="space-y-6">
//       <div className="grid grid-cols-2 gap-4">
//         <div>
//           <Label className="text-sm font-medium">Nom de l&apos;entreprise</Label>
//           <p className="mt-1 text-sm">{request.businessName}</p>
//         </div>
//         <div>
//           <Label className="text-sm font-medium">Numéro d&apos;enregistrement</Label>
//           <p className="mt-1 text-sm">{request.registrationNumber}</p>
//         </div>
//         <div>
//           <Label className="text-sm font-medium">Email</Label>
//           <p className="mt-1 text-sm">{request.email}</p>
//         </div>
//         <div>
//           <Label className="text-sm font-medium">Date de soumission</Label>
//           <p className="mt-1 text-sm">
//             {new Date(request.submittedAt).toLocaleString()}
//           </p>
//         </div>
//       </div>

//       <div className="space-y-4">
//         <h3 className="text-lg font-semibold">Documents soumis</h3>
//         <div className="grid grid-cols-2 gap-4">
//           {Object.entries(request.documents).map(([key, url]) => (
//             <div key={key} className="p-4 border rounded-lg">
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center space-x-2">
//                   <FileText className="h-5 w-5 text-blue-600" />
//                   <span className="text-sm font-medium">
//                     {key.replace(/([A-Z])/g, ' $1').trim()}
//                   </span>
//                 </div>
//                 <Button
//                   variant="ghost"
//                   size="sm"
//                   onClick={() => handleDownload(url, key)}
//                 >
//                   <Download className="h-4 w-4" />
//                 </Button>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {request.status === 'PENDING' && (
//         <div className="flex justify-end space-x-4 mt-6 pt-4 border-t">
//           <Button
//             variant="outline"
//             onClick={() => onUpdateStatus(request.id, "REJECTED")}
//             disabled={isLoading}
//             className="text-red-600 hover:text-red-700"
//           >
//             <X className="h-4 w-4 mr-2" />
//             Refuser
//           </Button>
//           <Button
//             onClick={() => onUpdateStatus(request.id, "APPROVED")}
//             disabled={isLoading}
//             className="bg-green-600 hover:bg-green-700"
//           >
//             <Check className="h-4 w-4 mr-2" />
//             Approuver
//           </Button>
//         </div>
//       )}
//     </div>
//   );
// } 