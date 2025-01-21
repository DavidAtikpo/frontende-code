'use client';

import TrainingDetailsClient from './TrainingDetailsClient';

interface PageProps {
  params: Promise<{
    trainingId: string;
  }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function TrainingDetailsPage({ params, searchParams }: PageProps) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  return <TrainingDetailsClient trainingId={resolvedParams.trainingId} searchParams={resolvedSearchParams} />;
} 