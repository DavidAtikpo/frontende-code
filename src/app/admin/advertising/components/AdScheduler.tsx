"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface ScheduleProps {
  adId: string;
  startDate: Date;
  endDate: Date;
  frequency: 'always' | 'scheduled' | 'custom';
  customDays?: string[];
  customHours?: string[];
}

export default function AdScheduler({ schedule, onScheduleChange }: { 
  schedule: ScheduleProps;
  onScheduleChange: (schedule: ScheduleProps) => void;
}) {
  const [showCustomSchedule, setShowCustomSchedule] = useState(schedule.frequency === 'custom');

  const daysOfWeek = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
  const hours = Array.from({ length: 24 }, (_, i) => `${i}:00`);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Planification</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Fréquence d'affichage</Label>
            <Select
              value={schedule.frequency}
              onValueChange={(value) => {
                onScheduleChange({ ...schedule, frequency: value as ScheduleProps['frequency'] });
                setShowCustomSchedule(value === 'custom');
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choisir la fréquence" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="always">Toujours afficher</SelectItem>
                <SelectItem value="scheduled">Période définie</SelectItem>
                <SelectItem value="custom">Planning personnalisé</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {showCustomSchedule && (
            <div className="space-y-4">
              <div>
                <Label>Jours d'affichage</Label>
                <div className="grid grid-cols-7 gap-2 mt-2">
                  {daysOfWeek.map((day) => (
                    <div key={day} className="flex items-center space-x-2">
                      <Switch
                        checked={schedule.customDays?.includes(day)}
                        onCheckedChange={(checked) => {
                          const days = checked
                            ? [...(schedule.customDays || []), day]
                            : schedule.customDays?.filter(d => d !== day);
                          onScheduleChange({ ...schedule, customDays: days });
                        }}
                      />
                      <Label>{day}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label>Heures d'affichage</Label>
                <div className="grid grid-cols-6 gap-2 mt-2">
                  {hours.map((hour) => (
                    <div key={hour} className="flex items-center space-x-2">
                      <Switch
                        checked={schedule.customHours?.includes(hour)}
                        onCheckedChange={(checked) => {
                          const selectedHours = checked
                            ? [...(schedule.customHours || []), hour]
                            : schedule.customHours?.filter(h => h !== hour);
                          onScheduleChange({ ...schedule, customHours: selectedHours });
                        }}
                      />
                      <Label>{hour}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 