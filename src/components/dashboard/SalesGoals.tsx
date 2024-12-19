import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface Goal {
  label: string;
  current: number;
  target: number;
  unit: string;
}

interface SalesGoalsProps {
  goals: Goal[];
}

export function SalesGoals({ goals }: SalesGoalsProps) {
  const getProgress = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Objectifs du mois</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {goals.map((goal, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>{goal.label}</span>
                <span>
                  {goal.current} / {goal.target} {goal.unit}
                </span>
              </div>
              <Progress value={getProgress(goal.current, goal.target)} />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 