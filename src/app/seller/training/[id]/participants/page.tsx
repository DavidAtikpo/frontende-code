'use client';

import ParticipantsClient from './ParticipantsClient';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ParticipantsPage({ params, searchParams }: PageProps) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  return <ParticipantsClient params={resolvedParams} searchParams={resolvedSearchParams} />;
} 