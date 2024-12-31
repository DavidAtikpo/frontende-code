import TrainingEditClient from './TrainingEditClient';

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams?: Promise<any>;
}

export default async function TrainingEditPage({ params }: PageProps) {
  const resolvedParams = await params;
  return <TrainingEditClient params={resolvedParams} />;
} 