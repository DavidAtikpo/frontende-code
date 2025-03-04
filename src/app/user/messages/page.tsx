"use client";

import React, { useEffect, useState } from "react";
import { getCookie } from 'cookies-next';
import { API_CONFIG } from '@/utils/config';
import { useToast } from "@/components/ui/use-toast";

const BASE_URL = "http://localhost:5000";

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'seller';
  sellerId: string;
  sellerName: string;
  createdAt: string;
  read: boolean;
  replyTo?: Message;
}

interface Conversation {
  sellerId: string;
  sellerName: string;
  lastMessage: string;
  lastMessageDate: string;
  unreadCount?: number;
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

const UserMessagesPage = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedSellerId, setSelectedSellerId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [replyToMessage, setReplyToMessage] = useState<Message | null>(null);
  const { toast } = useToast();

  // Charger les conversations
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const token = getCookie('token');
        const response = await fetch(`${BASE_URL}/api/chat/user`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          const formattedConversations = data.conversations.map((conv: Conversation) => ({
            ...conv,
            sellerName: conv.sellerName || 'Vendeur'
          }));
          setConversations(formattedConversations);
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
          description: "Une erreur s'est produite lors du chargement des conversations",
          variant: "destructive"
        });
      }
    };

    fetchConversations();
  }, []);

  // Charger les messages d'une conversation spécifique
  useEffect(() => {
    if (selectedSellerId) {
      const fetchMessages = async () => {
        try {
          const token = getCookie('token');
          console.log('🔍 Tentative de récupération des messages pour le vendeur:', selectedSellerId);
          
          const response = await fetch(`${BASE_URL}/api/chat/messages/user/${selectedSellerId}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (response.ok) {
            const data = await response.json();
            console.log('📥 Messages reçus du serveur:', data);
            
            const formattedMessages = data.messages.map((msg: ServerMessage) => {
              console.log('🔄 Formatage du message:', msg);
              return {
                id: msg.id,
                content: msg.content,
                sender: msg.sender,
                sellerId: selectedSellerId,
                sellerName: msg.User?.name || 'Vendeur',
                createdAt: msg.createdAt,
                read: msg.read
              };
            });
            
            console.log('✅ Messages formatés:', formattedMessages);
            setMessages(formattedMessages);
          } else {
            const errorText = await response.text();
            console.error('❌ Erreur de réponse:', response.status, errorText);
          }
        } catch (error) {
          console.error('❌ Erreur lors du chargement des messages:', error);
        }
      };

      fetchMessages();
      const interval = setInterval(fetchMessages, 5000);
      return () => clearInterval(interval);
    }
  }, [selectedSellerId]);

  // Envoyer un nouveau message
  const handleSendMessage = async () => {
    if (!selectedSellerId || !newMessage.trim()) return;

    try {
      console.log('📤 Tentative d\'envoi du message:', {
        sellerId: selectedSellerId,
        content: newMessage
      });

      const token = getCookie('token');
      const response = await fetch(`${BASE_URL}/api/chat/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          sellerId: selectedSellerId,
          content: newMessage
        })
      });

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Message envoyé avec succès:', data);
        setMessages(prev => [...prev, {
          id: data.id,
          content: newMessage,
          sender: 'user',
          sellerId: selectedSellerId,
          sellerName: data.User?.name || 'Vendeur',
          createdAt: new Date().toISOString(),
          read: false
        }]);
        setNewMessage("");
      } else {
        const errorData = await response.json();
        console.error('❌ Erreur lors de l\'envoi:', errorData);
      }
    } catch (error) {
      console.error('❌ Erreur lors de l\'envoi du message:', error);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-50">
      {/* Liste des conversations - responsive */}
      <div className={`
        ${selectedSellerId ? 'hidden md:block' : 'block'} 
        w-full md:w-1/3 lg:w-1/4 border-r bg-white shadow-sm overflow-y-auto
      `}>
        <div className="flex items-center justify-between p-4 border-b bg-gray-50">
          <div>
            <h1 className="text-xl md:text-2xl font-bold">Mes conversations</h1>
            <div className="text-sm text-gray-500">
              {conversations.length} conversation{conversations.length > 1 ? 's' : ''}
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
          {selectedSellerId && (
            <button 
              onClick={() => setSelectedSellerId(null)}
              className="md:hidden p-2 text-gray-600 hover:text-gray-900"
            >
              Retour
            </button>
          )}
        </div>
        <div className="space-y-1">
          {conversations.map((conv) => (
            <div
              key={conv.sellerId}
              onClick={() => setSelectedSellerId(conv.sellerId)}
              className={`p-3 md:p-4 hover:bg-gray-50 transition-colors cursor-pointer border-l-4 ${
                selectedSellerId === conv.sellerId ? 'border-blue-500 bg-blue-50' : 'border-transparent'
              }`}
            >
              <div className="flex items-center gap-2 md:gap-3">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-semibold text-sm md:text-base">
                    {(conv.sellerName || 'Vendeur').charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-gray-900 truncate">{conv.sellerName}</div>
                  <div className="text-xs md:text-sm text-gray-500 truncate">{conv.lastMessage}</div>
                  <div className="text-xs text-gray-400">
                    {new Date(conv.lastMessageDate).toLocaleString()}
                  </div>
                </div>
                {typeof conv.unreadCount === 'number' && conv.unreadCount > 0 && (
                  <span className="px-2 py-0.5 bg-blue-500 text-white text-xs rounded-full">
                    {conv.unreadCount}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Zone de chat - responsive */}
      <div className={`
        ${!selectedSellerId ? 'hidden md:flex' : 'flex'}
        flex-col flex-1 bg-white
      `}>
        {selectedSellerId ? (
          <>
            <div className="p-3 md:p-4 border-b bg-white shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setSelectedSellerId(null)}
                    className="md:hidden p-1 text-gray-600 hover:text-gray-900"
                  >
                    ←
                  </button>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-semibold">
                      {conversations.find(c => c.sellerId === selectedSellerId)?.sellerName}
                    </h2>
                    {(() => {
                      const currentConv = conversations.find(c => c.sellerId === selectedSellerId);
                      return typeof currentConv?.unreadCount === 'number' && currentConv.unreadCount > 0 ? (
                        <span className="px-2 py-0.5 bg-blue-500 text-white text-xs rounded-full">
                          {currentConv.unreadCount} non lu{currentConv.unreadCount > 1 ? 's' : ''}
                        </span>
                      ) : null;
                    })()}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-1 p-3 md:p-4 overflow-y-auto space-y-3">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className="max-w-[85%] md:max-w-[70%] group">
                    <div
                      className={`rounded-lg p-2 md:p-3 ${
                        message.sender === 'user'
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 text-gray-900'
                      } cursor-pointer hover:opacity-90`}
                      onDoubleClick={() => setReplyToMessage(message)}
                    >
                      {message.replyTo && (
                        <div className="mb-2 p-2 bg-black/10 rounded text-sm">
                          <div className="text-xs font-medium mb-1">
                            {message.replyTo.sender === 'user' ? 'Vous' : 'Vendeur'}
                          </div>
                          <div className="truncate">{message.replyTo.content}</div>
                        </div>
                      )}
                      <p className="text-sm break-words">{message.content}</p>
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                      <span>{new Date(message.createdAt).toLocaleString()}</span>
                      {message.sender === 'user' && message.read && (
                        <span className="text-blue-500">✓✓</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Zone de réponse - responsive */}
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

export default UserMessagesPage; 