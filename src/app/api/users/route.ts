import { NextRequest, NextResponse } from 'next/server';

export const users = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john.doe@example.com',
  },
  {
    id: 2,
    name: 'Jane Doe',
    email: 'jane.doe@example.com',
  },
];

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(_request: NextRequest) {
  return new NextResponse(JSON.stringify(users), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'X-Custom-Header': 'Some-Value',
    },
  });
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  const validId = users.every(user => user.id !== body.id);

  if (!validId) {
    return new NextResponse(JSON.stringify({ message: 'Id already exists' }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  users.push(body);

  return new NextResponse(JSON.stringify(users), {
    status: 201,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
