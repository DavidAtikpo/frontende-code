import { Suspense } from 'react';
import SellerDetailsClient from './SellerDetailsClient';

type Props = {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function Page(props: Props) {
  const params = await props.params;
  
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <SellerDetailsClient params={params} />
    </Suspense>
  );
} 