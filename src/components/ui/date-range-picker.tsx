// "use client";

// import * as React from "react";
// import { format } from "date-fns";
// import { fr } from "date-fns/locale";
// import { Calendar as CalendarIcon } from "lucide-react";
// import { DateRange } from "react-day-picker";
// import { cn } from "@/lib/utils";
// import { Button } from "@/components/ui/button";
// // import { Calendar } from "@/components/ui/calendar";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";

// interface DatePickerWithRangeProps {
//   className?: string;
//   selected?: DateRange;
//   onSelect?: (range: DateRange | undefined) => void;
//   presets?: {
//     label: string;
//     value: DateRange;
//   }[];
// }

// export function DatePickerWithRange({
//   className,
//   selected,
//   onSelect,
//   presets,
// }: DatePickerWithRangeProps) {
//   return (
//     <div className={cn("grid gap-2", className)}>
//       <Popover>
//         <PopoverTrigger asChild>
//           <Button
//             variant="outline"
//             className={cn(
//               "w-full justify-start text-left font-normal",
//               !selected && "text-muted-foreground"
//             )}
//           >
//             <CalendarIcon className="mr-2 h-4 w-4" />
//             {selected?.from ? (
//               selected.to ? (
//                 <>
//                   {format(selected.from, "dd LLL y", { locale: fr })} -{" "}
//                   {format(selected.to, "dd LLL y", { locale: fr })}
//                 </>
//               ) : (
//                 format(selected.from, "dd LLL y", { locale: fr })
//               )
//             ) : (
//               <span>Sélectionner une période</span>
//             )}
//           </Button>
//         </PopoverTrigger>
//         <PopoverContent className="w-auto p-0" align="start">
//           <Calendar
//             initialFocus
//             mode="range"
//             defaultMonth={selected?.from}
//             selected={selected}
//             onSelect={onSelect}
//             numberOfMonths={2}
//             locale={fr}
//           />
//           {presets && (
//             <>
//               <div className="border-t border-border/50 p-3">
//                 <div className="flex flex-wrap gap-2">
//                   {presets.map((preset) => (
//                     <Button
//                       key={preset.label}
//                       size="sm"
//                       variant="outline"
//                       onClick={() => onSelect?.(preset.value)}
//                     >
//                       {preset.label}
//                     </Button>
//                   ))}
//                 </div>
//               </div>
//             </>
//           )}
//         </PopoverContent>
//       </Popover>
//     </div>
//   );
// } 

import React from 'react'

const date = () => {
  return (
    <div>date-range-picker</div>
  )
}

export default date