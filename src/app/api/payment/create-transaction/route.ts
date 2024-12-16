import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const response = await fetch('https://api.fedapay.com/v1/transactions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.FEDAPAY_SECRET_KEY}`
      },
      body: JSON.stringify(body)
    });

    const data = await response.json();
    return NextResponse.json(data);

  } catch (err) {
    console.error('Erreur lors de la création de la transaction:', err);
    return new NextResponse(
      JSON.stringify({ 
        success: false, 
        message: err instanceof Error ? err.message : "Erreur lors de la création de la transaction" 
      }), 
      { status: 500 }
    );
  }
} 