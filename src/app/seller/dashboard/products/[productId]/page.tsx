"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ProductPage({ params }: { params: { productId: string } }) {
  const router = useRouter();

  useEffect(() => {
    router.push(`/seller/dashboard/products/${params.productId}/edit`);
  }, [params.productId, router]);

  return null;
} 