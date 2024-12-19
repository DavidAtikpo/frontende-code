"use client";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface UserProfileProps {
  user: {
    name: string;
    email: string;
    avatar?: string;
    role: string;
  };
}

export function UserProfile({ user }: UserProfileProps) {
  return (
    <Card>
      <CardHeader className="flex flex-col sm:flex-row items-center gap-4">
        <Avatar className="h-20 w-20 sm:h-16 sm:w-16">
          <AvatarImage src={user.avatar} alt={user.name} />
          <AvatarFallback>{user.name[0].toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="text-center sm:text-left">
          <h2 className="text-xl font-bold">{user.name}</h2>
          <p className="text-sm text-muted-foreground">{user.email}</p>
          <div className="mt-2">
            <Badge>{user.role}</Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Contenu supplémentaire */}
      </CardContent>
    </Card>
  );
} 