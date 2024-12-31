import ReviewsClient from './ReviewsClient';

interface PageProps {
  params: Promise<{ restaurantId: string }>;
  searchParams?: Promise<any>;
}

export default async function ReviewsPage({ params }: PageProps) {
  const resolvedParams = await params;
  return <ReviewsClient params={resolvedParams} />;
} 