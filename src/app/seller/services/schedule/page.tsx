"use client";

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { API_CONFIG } from '@/utils/config';
import { getCookie } from "cookies-next";
import { Calendar } from "@/components/ui/calendar";
import { TimePicker } from "@/components/ui/time-picker";
import { 

  FaPause,
  FaPlay,
  FaSave
} from 'react-icons/fa';

const { BASE_URL } = API_CONFIG;

interface WorkingHours {
  day: string;
  isOpen: boolean;
  openTime: string;
  closeTime: string;
  breakStart?: string;
  breakEnd?: string;
}

interface BlockedDate {
  date: string;
  reason: string;
}

interface Service {
  id: string;
  title: string;
  duration: number;
}

export default function ServiceSchedule() {
  const [services, setServices] = useState<Service[]>([]);
  const [workingHours, setWorkingHours] = useState<WorkingHours[]>([]);
  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>([]);
  const [selectedService, setSelectedService] = useState<string>('');
  const [loading, setLoading] = useState(true);

  const days = [
    'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 
    'Vendredi', 'Samedi', 'Dimanche'
  ];

  useEffect(() => {
    fetchScheduleData();
  }, [selectedService]);

  const fetchScheduleData = async () => {
    try {
      const token = getCookie('token');
      const response = await fetch(
        `${BASE_URL}/api/seller/services/schedule${selectedService ? `?serviceId=${selectedService}` : ''}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        }
      );

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des horaires');
      }

      const data = await response.json();
      setWorkingHours(data.workingHours);
      setBlockedDates(data.blockedDates);
      setServices(data.services);
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors du chargement des horaires');
    } finally {
      setLoading(false);
    }
  };

  const handleWorkingHoursChange = (index: number, field: string, value: any) => {
    const newWorkingHours = [...workingHours];
    newWorkingHours[index] = {
      ...newWorkingHours[index],
      [field]: value
    };
    setWorkingHours(newWorkingHours);
  };

  const handleSaveSchedule = async () => {
    try {
      const token = getCookie('token');
      const response = await fetch(
        `${BASE_URL}/api/seller/services/schedule${selectedService ? `/${selectedService}` : ''}`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            workingHours,
            blockedDates
          })
        }
      );

      if (!response.ok) {
        throw new Error('Erreur lors de la sauvegarde');
      }

      toast.success('Horaires mis à jour avec succès');
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors de la sauvegarde des horaires');
    }
  };

  const handleDateSelect = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    const isBlocked = blockedDates.find(d => d.date === dateStr);

    if (isBlocked) {
      setBlockedDates(blockedDates.filter(d => d.date !== dateStr));
    } else {
      const reason = window.prompt('Raison du blocage de cette date:');
      if (reason) {
        setBlockedDates([...blockedDates, { date: dateStr, reason }]);
      }
    }
  };

  if (loading) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestion des disponibilités</h1>
        <Button onClick={handleSaveSchedule}>
          <FaSave className="mr-2" />
          Enregistrer
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Sélection du service */}
        <Card>
          <CardHeader>
            <CardTitle>Service</CardTitle>
          </CardHeader>
          <CardContent>
            <Select
              value={selectedService}
              onValueChange={setSelectedService}
            >
              <option value="">Tous les services</option>
              {services.map(service => (
                <option key={service.id} value={service.id}>
                  {service.title}
                </option>
              ))}
            </Select>
          </CardContent>
        </Card>

        {/* Horaires de travail */}
        <Card>
          <CardHeader>
            <CardTitle>Horaires de travail</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {workingHours.map((hours, index) => (
                <div key={days[index]} className="flex items-center space-x-4">
                  <div className="w-24">
                    <span className="font-medium">{days[index]}</span>
                  </div>
                  <Switch
                    checked={hours.isOpen}
                    onCheckedChange={(checked) => 
                      handleWorkingHoursChange(index, 'isOpen', checked)
                    }
                  />
                  {hours.isOpen && (
                    <>
                      <TimePicker
                        date={new Date(`2000-01-01T${hours.openTime}`)}
                        setDate={(date) => handleWorkingHoursChange(
                          index, 
                          'openTime', 
                          date.toTimeString().slice(0, 5)
                        )}
                      />
                      <span>-</span>
                      <TimePicker
                        date={new Date(`2000-01-01T${hours.closeTime}`)}
                        setDate={(date) => handleWorkingHoursChange(
                          index, 
                          'closeTime', 
                          date.toTimeString().slice(0, 5)
                        )}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const hasBreak = !!hours.breakStart;
                          if (hasBreak) {
                            handleWorkingHoursChange(index, 'breakStart', undefined);
                            handleWorkingHoursChange(index, 'breakEnd', undefined);
                          } else {
                            handleWorkingHoursChange(index, 'breakStart', '12:00');
                            handleWorkingHoursChange(index, 'breakEnd', '14:00');
                          }
                        }}
                      >
                        {hours.breakStart ? <FaPause /> : <FaPlay />}
                      </Button>
                      {hours.breakStart && (
                        <>
                          <TimePicker
                            date={new Date(`2000-01-01T${hours.breakStart}`)}
                            setDate={(date) => handleWorkingHoursChange(
                              index, 
                              'breakStart', 
                              date.toTimeString().slice(0, 5)
                            )}
                          />
                          <span>-</span>
                          <TimePicker
                            date={new Date(`2000-01-01T${hours.breakEnd}`)}
                            setDate={(date) => handleWorkingHoursChange(
                              index, 
                              'breakEnd', 
                              date.toTimeString().slice(0, 5)
                            )}
                          />
                        </>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Calendrier des dates bloquées */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Dates bloquées</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Calendar
                mode="multiple"
                selected={blockedDates.map(d => new Date(d.date))}
                onSelect={(dates) => {
                  if (dates) handleDateSelect(dates[dates.length - 1]);
                }}
              />
              <div className="space-y-4">
                <h3 className="font-medium">Dates bloquées:</h3>
                {blockedDates.map((blocked, index) => (
                  <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <div>
                      <p className="font-medium">
                        {new Date(blocked.date).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-500">{blocked.reason}</p>
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => setBlockedDates(
                        blockedDates.filter(d => d.date !== blocked.date)
                      )}
                    >
                      Supprimer
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 