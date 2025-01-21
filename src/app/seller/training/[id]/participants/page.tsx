'use client';

import ParticipantsClient from './ParticipantsClient';

interface PageProps {
  params: {
    id: string;
  };
}

export default function ParticipantsPage({ params }: PageProps) {
  console.log('Participants page params:', params);
  return <ParticipantsClient params={params} />;
} 