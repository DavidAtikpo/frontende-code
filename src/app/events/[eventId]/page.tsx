'use client';

import EventDetailsClient from "./EventDetailsClient";


interface PageProps {
  params: {
    eventId: string;
  };
}

export default function EventDetailsPage({ params }: PageProps) {
  return <EventDetailsClient eventId={params.eventId} />;
} 