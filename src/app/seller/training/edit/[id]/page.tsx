'use client';

import TrainingEditClient from './TrainingEditClient';

interface PageProps {
  params: {
    id: string;
  };
}

export default function TrainingEditPage({ params }: PageProps) {
  console.log('Edit page params:', params);
  return <TrainingEditClient params={params} />;
} 