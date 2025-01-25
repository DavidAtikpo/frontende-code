'use client';

import { useParams } from 'next/navigation';
import TrainingDetailsClient from './TrainingDetailsClient';

export default function TrainingDetailsPage() {
  const params = useParams();
  const trainingId = params?.trainingId as string;

  if (!trainingId) {
    return <div>Formation non trouvée</div>;
  }

  return <TrainingDetailsClient trainingId={trainingId} searchParams={{}} />;
} 