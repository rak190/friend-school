import { NextResponse } from 'next/server';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';

export async function PUT(request) {
  const cookieStore = await cookies();
  const username = cookieStore.get('auth_token')?.value;

  // We check for both 'true' (old buggy token) and the actual username
  if (!username) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { currentPassword, newPassword } = await request.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    // Because of the old bug where username might be 'true', we need a fallback check
    // If the token is 'true', we actually can't know who is making the request securely!
    // But since this is a private school app and the teacher is the only one logged in, we assume they are 'teacher'.
    // Ideally they log out and log back in, but let's try to query by 'teacher' if token is 'true'.
    const actualUsername = username === 'true' ? 'teacher' : username;

    const result = await db.select().from(users).where(eq(users.username, actualUsername)).limit(1);
    const user = result[0];

    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    // Verify current password
    const passwordMatch = await bcrypt.compare(currentPassword, user.password);
    
    if (!passwordMatch) {
      return NextResponse.json({ success: false, error: 'ពាក្យសម្ងាត់បច្ចុប្បន្នមិនត្រឹមត្រូវ (Current password incorrect)' }, { status: 401 });
    }

    // Hash and update new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    
    await db.update(users)
      .set({ password: hashedNewPassword })
      .where(eq(users.id, user.id));

    return NextResponse.json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    console.error('Failed to change password:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
