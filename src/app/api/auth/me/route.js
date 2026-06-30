import { NextResponse } from 'next/server';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const username = cookieStore.get('auth_token')?.value;

    if (!username) {
      return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 });
    }

    const result = await db.select({
      id: users.id,
      username: users.username,
      firstName: users.firstName,
      lastName: users.lastName,
      role: users.role
    }).from(users).where(eq(users.username, username)).limit(1);

    const user = result[0];

    if (user) {
      return NextResponse.json({ success: true, data: user });
    }

    return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
  } catch (error) {
    console.error('Failed to fetch current user:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
