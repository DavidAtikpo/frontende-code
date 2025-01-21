'use client';

import TrainingDetailsClient from './TrainingDetailsClient';

interface PageProps {
  params: {
    id: string;
  };
}

export default function TrainingDetailsPage({ params }: PageProps) {
  console.log('Page params:', params);
  return <TrainingDetailsClient params={params} />;
} 