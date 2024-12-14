import { NextRequest, NextResponse } from 'next/server';

import { users } from '../route';
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }, // Desestructuramos params directamente
) {
  const { id } = await params; // Esperamos los parámetros

  if (!id || Number.isNaN(Number.parseInt(id))) {
    return new NextResponse(JSON.stringify({ error: 'ID inválido' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const user = users.find(user => user.id === Number.parseInt(id));

  if (!user) {
    return new NextResponse(
      JSON.stringify({ error: 'Usuario no encontrado' }),
      {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  }

  return new NextResponse(JSON.stringify(user), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  users.splice(
    users.findIndex(user => user.id === Number.parseInt(id)),
    1,
  );
  return new NextResponse(JSON.stringify(users), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  console.log(id);
  const body = await request.json();
  const index = users.findIndex(user => user.id === Number.parseInt(id));
  users[index] = body;
  return new NextResponse(JSON.stringify(users), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
