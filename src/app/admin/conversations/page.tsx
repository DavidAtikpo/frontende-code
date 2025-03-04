"use client";

import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { getCookie } from "cookies-next";
import { useToast } from "@/components/ui/use-toast";
import { LoadingSpinner } from "@/components/ui/loading";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

// import BASE_URL from "@/utils/config";
const BASE_URL = 'http://localhost:5000' 

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'seller';
  createdAt: string;
}

interface Conversation {
  sellerId: string;
  userId: string;
  sellerName: string;
  userName: string;
  userEmail: string;
  lastMessageDate: string;
  unreadCount: number;
}

export default function AdminConversations() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/admin/chat/conversations`, {
          headers: {
            'Authorization': `Bearer ${getCookie('token')}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setConversations(data.conversations);
        } else {
          toast({
            title: "Erreur",
            description: "Impossible de charger les conversations",
            variant: "destructive"
          });
        }
      } catch (error) {
        console.error('Erreur:', error);
        toast({
          title: "Erreur",
          description: "Une erreur s'est produite",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, []);

  // Charger les messages quand une conversation est sélectionnée
  useEffect(() => {
    if (selectedConversation) {
      const fetchMessages = async () => {
        setLoadingMessages(true);
        try {
          const response = await fetch(
            `${BASE_URL}/api/admin/chat/messages/${selectedConversation.sellerId}/${selectedConversation.userId}`,
            {
              headers: {
                'Authorization': `Bearer ${getCookie('token')}`
              }
            }
          );

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
          console.error('Erreur:', error);
          toast({
            title: "Erreur",
            description: "Une erreur s'est produite",
            variant: "destructive"
          });
        } finally {
          setLoadingMessages(false);
        }
      };

      fetchMessages();
    }
  }, [selectedConversation]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Conversations</h1>
      
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {conversations.map((conv) => (
            <Card 
              key={`${conv.sellerId}-${conv.userId}`}
              className="p-4 cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setSelectedConversation(conv)}
            >
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">Vendeur: {conv.sellerName}</h3>
                    <p className="text-sm text-gray-600">Client: {conv.userName}</p>
                    <p className="text-xs text-gray-500">{conv.userEmail}</p>
                  </div>
                  {conv.unreadCount > 0 && (
                    <span className="px-2 py-1 bg-blue-500 text-white text-xs rounded-full">
                      {conv.unreadCount}
                    </span>
                  )}
                </div>
                <div className="text-xs text-gray-400">
                  Dernier message: {new Date(conv.lastMessageDate).toLocaleString()}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Dialog pour afficher les messages */}
      <Dialog open={!!selectedConversation} onOpenChange={() => setSelectedConversation(null)}>
        <DialogContent className="sm:max-w-[500px] max-h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>
              Conversation entre {selectedConversation?.sellerName} et {selectedConversation?.userName}
            </DialogTitle>
            <div className="text-sm text-gray-500">{selectedConversation?.userEmail}</div>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[300px] border rounded-lg">
            {loadingMessages ? (
              <div className="flex justify-center items-center h-full">
                <LoadingSpinner />
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex flex-col ${
                    message.sender === 'user' ? 'items-end' : 'items-start'
                  }`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.sender === 'user'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                  </div>
                  <span className="text-xs text-gray-500 mt-1">
                    {new Date(message.createdAt).toLocaleString()}
                  </span>
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}