import { NextResponse } from 'next/server';
import { db } from '@/db';
import { classes, users } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { cookies } from 'next/headers';

export async function PUT(request, { params }) {
  const cookieStore = await cookies();
  const role = cookieStore.get('user_role')?.value;
  const username = cookieStore.get('auth_token')?.value;

  if (!role || !username || role !== 'teacher') {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params; // classId

  try {
    const { gradeSubjects } = await request.json(); // expected e.g. "គណិតវិទ្យា,ភាសាខ្មែរ"

    if (typeof gradeSubjects !== 'string') {
      return NextResponse.json({ success: false, error: 'Invalid subjects format' }, { status: 400 });
    }

    const currentUser = await db.select().from(users).where(eq(users.username, username)).limit(1);
    const teacherId = currentUser[0]?.id;

    // Verify ownership of the class
    const existingClass = await db.select().from(classes).where(and(eq(classes.id, Number(id)), eq(classes.teacherId, teacherId))).limit(1);
    if (!existingClass.length) {
      return NextResponse.json({ success: false, error: 'Unauthorized to modify this class' }, { status: 403 });
    }

    await db.update(classes).set({ gradeSubjects }).where(eq(classes.id, Number(id)));

    return NextResponse.json({ success: true, message: 'Subjects updated successfully' });
  } catch (error) {
    console.error('Failed to update class subjects:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
