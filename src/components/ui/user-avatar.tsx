import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Image from "next/image";

interface UserAvatarProps {
  name: string;
  avatarUrl?: string | null;
  className?: string;
}

export function UserAvatar({ name, avatarUrl, className = "" }: UserAvatarProps) {
  // Obtenir la première lettre du nom
  const initials = name
    .split(" ")
    .map(n => n[0])
    .join("")
    .toUpperCase();

  const imageUrl = avatarUrl || "/user-profile-svgrepo-com (1).svg";

  return (
    <Avatar className={className}>
      <AvatarImage asChild>
        <Image
          src={imageUrl}
          alt={name}
          width={40}
          height={40}
          onError={(e) => {
            // If image fails to load, we'll show the fallback
            e.currentTarget.style.display = 'none';
          }}
        />
      </AvatarImage>
      <AvatarFallback className="bg-primary text-primary-foreground">
        {initials}
      </AvatarFallback>
    </Avatar>
  );
} 