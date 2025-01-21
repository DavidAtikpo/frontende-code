'use client';

import TrainingEditClient from './TrainingEditClient';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function TrainingEditPage({ params, searchParams }: PageProps) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  console.log('Edit page params:', resolvedParams);
  return <TrainingEditClient params={resolvedParams} searchParams={resolvedSearchParams} />;
} 