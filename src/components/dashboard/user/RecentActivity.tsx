"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";

interface Activity {
  id: string;
  type: string;
  description: string;
  createdAt: string;
}

interface RecentActivityProps {
  activities: Activity[];
}

export function RecentActivity({ activities }: RecentActivityProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Activités récentes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-4">
              <div className="flex-1">
                <p className="text-sm font-medium">{activity.type}</p>
                <p className="text-sm text-muted-foreground">
                  {activity.description}
                </p>
              </div>
              <time className="text-sm text-muted-foreground">
                {formatDate(activity.createdAt)}
              </time>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 