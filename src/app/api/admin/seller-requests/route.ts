import { NextResponse } from 'next/server';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export async function GET() {
  try {
    const response = await fetch(`${BASE_URL}/api/admin/seller-requests`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch seller requests');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error('Erreur lors de la récupération des demandes:', err);
    return new NextResponse(
      JSON.stringify({ 
        success: false, 
        message: err instanceof Error ? err.message : "Erreur serveur" 
      }), 
      { status: 500 }
    );
  }
} 