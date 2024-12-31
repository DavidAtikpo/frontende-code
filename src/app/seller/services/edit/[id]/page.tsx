import EditServiceClient from './EditServiceClient';

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams?: Promise<any>;
}

export default async function EditServicePage({ params }: PageProps) {
  const resolvedParams = await params;
  return <EditServiceClient params={resolvedParams} />;
} 