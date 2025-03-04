"use client";

import React, { useEffect, useState } from "react";
import { getCookie } from 'cookies-next';
import { API_CONFIG } from '@/utils/config';
import { useToast } from "@/components/ui/use-toast";
import Link from "next/link";

// const { BASE_URL } = API_CONFIG;
const BASE_URL = "http://localhost:5000";

interface Conversation {
  userId: string;
  userName: string;
  lastMessage: string;
  lastMessageDate: string;
  unreadCount?: number;
}

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'seller';
  userId: string;
  userName: string;
  createdAt: string;
  read: boolean;
  replyTo?: Message;
}

interface ServerMessage {
  id: string;
  content: string;
  sender: 'user' | 'seller';
  userId: string;
  User?: {
    name: string;
  };
  createdAt: string;
  read: boolean;
}

const SellerMessagesPage = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const { toast } = useToast();
  const [replyToMessage, setReplyToMessage] = useState<Message | null>(null);

  // Charger les conversations
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const token = getCookie('token');
        const response = await fetch(`${BASE_URL}/api/chat/seller`, {
          headers: {
            'Authorization': `Bearer ${token}`
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
        console.error('Erreur lors du chargement des conversations:', error);
        toast({
          title: "Erreur",
          description: "Une erreur s'est produite",
          variant: "destructive"
        });
      }
    };

    fetchConversations();
    
    // Rafraîchir les conversations toutes les 30 secondes
    const interval = setInterval(fetchConversations, 30000);
    return () => clearInterval(interval);
  }, []);

  // Charger les messages d'une conversation spécifique
  useEffect(() => {
    if (selectedUserId) {
      const fetchMessages = async () => {
        try {
          const token = getCookie('token');
          const response = await fetch(`${BASE_URL}/api/chat/messages/seller/${selectedUserId}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (response.ok) {
            const data = await response.json();
            // Formater les messages reçus
            const formattedMessages = data.messages.map((msg: ServerMessage) => ({
              id: msg.id,
              content: msg.content,
              sender: msg.sender,
              userId: msg.userId,
              userName: msg.User?.name || '',
              createdAt: msg.createdAt,
              read: msg.read
            }));
            setMessages(formattedMessages);
          } else {
            console.error('Erreur lors du chargement des messages:', await response.text());
          }
        } catch (error) {
          console.error('Erreur lors du chargement des messages:', error);
        }
      };

      fetchMessages();
      
      // Rafraîchir les messages toutes les 5 secondes
      const interval = setInterval(fetchMessages, 5000);
      return () => clearInterval(interval);
    }
  }, [selectedUserId]);

  // Envoyer un nouveau message
  const handleSendMessage = async () => {
    if (!selectedUserId || !newMessage.trim()) return;

    try {
      const token = getCookie('token');
      const response = await fetch(`${BASE_URL}/api/chat/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          userId: selectedUserId,
          content: newMessage
        })
      });

      if (response.ok) {
        const data = await response.json();
        // Mettre à jour les messages avec les informations complètes
        setMessages(prev => [...prev, {
          ...data,
          sender: 'seller',
          userName: data.User?.name || '',
          createdAt: data.createdAt || new Date().toISOString()
        }]);
        setNewMessage("");

        // Mettre à jour la conversation dans la liste
        setConversations(prev => prev.map(conv => 
          conv.userId === selectedUserId 
            ? {
                ...conv,
                lastMessage: newMessage,
                lastMessageDate: new Date().toISOString()
              }
            : conv
        ));
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
        description: "Une erreur s'est produite lors de l'envoi du message",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-50">
      {/* Liste des conversations - responsive */}
      <div className={`
        ${selectedUserId ? 'hidden md:block' : 'block'} 
        w-full md:w-1/3 lg:w-1/4 border-r bg-white shadow-sm overflow-y-auto
      `}>
        <div className="flex items-center justify-between p-4 border-b bg-gray-50">
          <div>
            <h1 className="text-xl md:text-2xl font-bold">Conversations</h1>
            <div className="text-sm text-gray-500">
              {conversations.length} conversation{conversations.length > 1 ? 's' : ''}
              {/* Calculer le total des messages non lus */}
              {(() => {
                const totalUnread = conversations.reduce((sum, conv) => sum + (conv.unreadCount || 0), 0);
                return totalUnread > 0 ? (
                  <span className="ml-2 px-2 py-0.5 bg-blue-500 text-white rounded-full text-xs">
                    {totalUnread} non lu{totalUnread > 1 ? 's' : ''}
                  </span>
                ) : null;
              })()}
            </div>
          </div>
          {selectedUserId && (
            <button 
              onClick={() => setSelectedUserId(null)}
              className="md:hidden p-2 text-gray-600 hover:text-gray-900"
            >
              Retour
            </button>
          )}
        </div>
        <div className="space-y-1">
          {conversations.map((conv: Conversation) => (
            <div
              key={conv.userId}
              onClick={() => setSelectedUserId(conv.userId)}
              className={`p-3 md:p-4 hover:bg-gray-50 transition-colors cursor-pointer border-l-4 ${
                selectedUserId === conv.userId ? 'border-blue-500 bg-blue-50' : 'border-transparent'
              }`}
            >
              <div className="flex items-center gap-2 md:gap-3">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-semibold text-sm md:text-base">
                    {(conv.userName || 'Client').charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div className="font-semibold text-gray-900 truncate">{conv.userName}</div>
                    {typeof conv.unreadCount === 'number' && conv.unreadCount > 0 && (
                      <span className="px-2 py-0.5 bg-blue-500 text-white text-xs rounded-full">
                        {conv.unreadCount}
                      </span>
                    )}
                  </div>
                  <div className="text-xs md:text-sm text-gray-500 truncate">{conv.lastMessage}</div>
                  <div className="text-xs text-gray-400">
                    {new Date(conv.lastMessageDate).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Zone de chat - responsive */}
      <div className={`
        ${!selectedUserId ? 'hidden md:flex' : 'flex'}
        flex-col flex-1 bg-white
      `}>
        {selectedUserId ? (
          <>
            <div className="flex-1 p-4 overflow-y-auto">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`mb-4 flex ${
                    message.sender === 'seller' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div className="max-w-[70%]">
                    <div 
                      className={`p-3 rounded-lg break-words ${
                        message.sender === 'seller'
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 text-gray-800'
                      } cursor-pointer hover:opacity-90`}
                      onDoubleClick={() => setReplyToMessage(message)}
                    >
                      {message.replyTo && (
                        <div className="mb-2 p-2 bg-black/10 rounded text-sm">
                          <div className="text-xs font-medium mb-1">
                            {message.replyTo.sender === 'seller' ? 'Vous' : 'Client'}
                          </div>
                          <div className="truncate">{message.replyTo.content}</div>
                        </div>
                      )}
                      {message.content}
                    </div>
                    <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                      {new Date(message.createdAt).toLocaleString()}
                      {message.sender === 'seller' && message.read && (
                        <span className="text-blue-500">✓✓</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-2 md:p-4 border-t bg-gray-50">
              {replyToMessage && (
                <div className="mb-2 p-2 bg-gray-100 rounded-lg text-sm">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Réponse à :</span>
                    <button 
                      onClick={() => setReplyToMessage(null)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      ✕
                    </button>
                  </div>
                  <p className="text-gray-600 truncate">{replyToMessage.content}</p>
                </div>
              )}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder={replyToMessage ? "Répondre..." : "Écrivez votre message..."}
                  className="flex-1 p-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={handleSendMessage}
                  className="px-3 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Envoyer
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="hidden md:flex items-center justify-center h-full text-gray-500">
            Sélectionnez une conversation pour commencer à chatter
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerMessagesPage; 