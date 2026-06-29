import { NextResponse } from 'next/server';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

export async function POST(request) {
  try {
    const { username, password } = await request.json();
    
    // Find user in database
    const result = await db.select().from(users).where(eq(users.username, username));
    const user = result[0];
    
    if (user) {
      // Verify password
      const passwordMatch = await bcrypt.compare(password, user.password);
      
      if (passwordMatch) {
        const response = NextResponse.json({ success: true, role: user.role });
        response.cookies.set('auth_token', user.username, { path: '/', maxAge: 60 * 60 * 24 });
        response.cookies.set('user_role', user.role, { path: '/', maxAge: 60 * 60 * 24 });
        return response;
      }
    }
    
    return NextResponse.json({ success: false, error: 'Invalid credentials' }, { status: 401 });
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
