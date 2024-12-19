import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";

interface Message {
  id: string;
  customerName: string;
  customerAvatar?: string;
  content: string;
  createdAt: string;
  read: boolean;
}

interface RecentMessagesProps {
  messages: Message[];
  onReply: (messageId: string) => void;
}

export function RecentMessages({ messages, onReply }: RecentMessagesProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Messages récents</span>
          <Button variant="outline" size="sm">
            Voir tous les messages
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {messages.map((message) => (
            <div 
              key={message.id} 
              className={`flex items-start space-x-4 p-3 rounded-lg ${
                !message.read ? 'bg-blue-50' : ''
              }`}
            >
              <Avatar>
                <AvatarImage src={message.customerAvatar} />
                <AvatarFallback>
                  {message.customerName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <p className="font-medium">{message.customerName}</p>
                  <span className="text-xs text-muted-foreground">
                    {new Date(message.createdAt).toLocaleString()}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{message.content}</p>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => onReply(message.id)}
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Répondre
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 