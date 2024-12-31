import TrainingDetailsClient from './TrainingDetailsClient';

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams?: Promise<any>;
}

export default async function TrainingDetailsPage({ params }: PageProps) {
  const resolvedParams = await params;
  return <TrainingDetailsClient params={resolvedParams} />;
} 