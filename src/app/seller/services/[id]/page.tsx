import ServiceDetailsClient from './ServiceDetailsClient';

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams?: Promise<any>;
}

export default async function ServiceDetailsPage({ params }: PageProps) {
  const resolvedParams = await params;
  return <ServiceDetailsClient params={resolvedParams} />;
} 