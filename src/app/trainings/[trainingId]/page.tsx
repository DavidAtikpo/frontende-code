import TrainingDetailsClient from './TrainingDetailsClient';

interface PageProps {
  params: {
    trainingId: string;
  };
}

export default function TrainingDetailsPage({ params }: PageProps) {
  return <TrainingDetailsClient trainingId={params.trainingId} />;
} 