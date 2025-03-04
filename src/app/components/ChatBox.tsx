"use client";

import React, { useState, useEffect } from "react";
import { getCookie } from 'cookies-next';
import { API_CONFIG } from '@/utils/config';
import { useToast } from "@/components/ui/use-toast";

// const { BASE_URL } = API_CONFIG;
const BASE_URL = "http://localhost:5000";

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'seller';
  createdAt: string;
}

interface ChatBoxProps {
  sellerId: string;
  onClose: () => void;
}

const ChatBox: React.FC<ChatBoxProps> = ({ sellerId, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const { toast } = useToast();

  // Charger les messages existants
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const token = getCookie('token');
        const response = await fetch(`${BASE_URL}/api/chat/messages/${sellerId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setMessages(data.messages);
        } else {
          toast({
            title: "Erreur",
            description: "Impossible de charger les messages",
            variant: "destructive"
          });
        }
      } catch (error) {
        console.error('Erreur lors du chargement des messages:', error);
        toast({
          title: "Erreur",
          description: "Une erreur s'est produite",
          variant: "destructive"
        });
      }
    };

    fetchMessages();
  }, [sellerId]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const token = getCookie('token');
      const response = await fetch(`${BASE_URL}/api/chat/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          sellerId,
          content: newMessage,
          sender: 'user'
        })
      });

      if (response.ok) {
        const data = await response.json();
        setMessages(prevMessages => [...prevMessages, data]);
        setNewMessage("");
      } else {
        const errorData = await response.json();
        toast({
          title: "Erreur",
          description: errorData.message || "Impossible d'envoyer le message",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Erreur lors de l\'envoi du message:', error);
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-white rounded-lg shadow-lg w-80">
      <div className="flex justify-between items-center p-3 border-b">
        <h3 className="text-sm font-semibold">Discussion avec le vendeur</h3>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
      </div>
      
      <div className="h-48 overflow-y-auto p-3 space-y-2">
        {messages.map((msg, index) => (
          <div
            key={msg.id || index}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[80%] p-2 rounded-lg ${
                msg.sender === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              <p className="text-sm">{msg.content}</p>
            </div>
            <span className="text-xs text-gray-500 mt-1">
              {new Date(msg.createdAt).toLocaleString()}
            </span>
          </div>
        ))}
      </div>

      <div className="p-3 border-t">
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Votre message..."
            className="flex-1 px-2 py-1 text-sm border rounded"
          />
          <button
            onClick={handleSendMessage}
            className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Envoyer
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBox; 