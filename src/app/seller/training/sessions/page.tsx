"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { FaCalendar, FaUsers } from 'react-icons/fa';

interface Session {
  id: string;
  trainingId: string;
  date: string;
  startTime: string;
  endTime: string;
  attendees: {
    present: number;
    total: number;
  };
  status: string;
  notes: string;
}

const TrainingSessions = () => {
  const router = useRouter();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/seller/training/sessions`);
      setSessions(response.data);
    } catch (error) {
      toast.error('Erreur lors du chargement des sessions');
    } finally {
      setLoading(false);
    }
  };

  const markAttendance = async (sessionId: string, userId: string, present: boolean) => {
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/seller/training/sessions/${sessionId}/attendance`, {
        userId,
        present
      });
      toast.success('Présence mise à jour');
      fetchSessions();
    } catch (error) {
      toast.error('Erreur lors de la mise à jour de la présence');
    }
  };

  const updateSessionNotes = async (sessionId: string, notes: string) => {
    try {
      await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/api/seller/training/sessions/${sessionId}`, {
        notes
      });
      toast.success('Notes mises à jour');
    } catch (error) {
      toast.error('Erreur lors de la mise à jour des notes');
    }
  };

  if (loading) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Sessions de formation</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {sessions.map((session) => (
          <div key={session.id} className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <FaCalendar className="text-blue-600 mr-2" />
                <span>{new Date(session.date).toLocaleDateString()}</span>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs ${
                session.status === 'completed' ? 'bg-green-100 text-green-800' :
                session.status === 'ongoing' ? 'bg-blue-100 text-blue-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {session.status}
              </span>
            </div>

            <div className="mb-4">
              <div className="flex items-center mb-2">
                <FaUsers className="text-gray-500 mr-2" />
                <span>
                  Présence: {session.attendees.present}/{session.attendees.total}
                </span>
              </div>
              <div className="text-sm text-gray-600">
                {session.startTime} - {session.endTime}
              </div>
            </div>

            <div className="mb-4">
              <textarea
                defaultValue={session.notes}
                onChange={(e) => updateSessionNotes(session.id, e.target.value)}
                placeholder="Notes de session..."
                className="w-full p-2 border rounded"
                rows={3}
              />
            </div>

            <button
              onClick={() => router.push(`/seller/training/sessions/${session.id}`)}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
            >
              Gérer les présences
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrainingSessions; 