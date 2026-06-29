import { NextResponse } from 'next/server';
import { db } from '@/db';
import { scores, students, classes, users } from '@/db/schema';
import { eq, and, inArray } from 'drizzle-orm';
import { cookies } from 'next/headers';

export async function GET(request) {
  const cookieStore = await cookies();
  const role = cookieStore.get('user_role')?.value;
  const username = cookieStore.get('auth_token')?.value;

  if (!role || !username || role !== 'teacher') {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const classId = searchParams.get('classId');
  const month = searchParams.get('month');
  const semester = searchParams.get('semester');

  if (!classId || !month || !semester) {
    return NextResponse.json({ success: false, error: 'Missing parameters' }, { status: 400 });
  }

  try {
    const currentUser = await db.select().from(users).where(eq(users.username, username)).limit(1);
    const teacherId = currentUser[0]?.id;

    // Verify ownership
    const existingClass = await db.select().from(classes).where(and(eq(classes.id, Number(classId)), eq(classes.teacherId, teacherId))).limit(1);
    if (!existingClass.length) {
      return NextResponse.json({ success: false, error: 'Unauthorized class access' }, { status: 403 });
    }

    // Get students in this class
    const classStudents = await db.select({ id: students.id }).from(students).where(eq(students.classId, Number(classId)));
    const studentIds = classStudents.map(s => s.id);

    if (studentIds.length === 0) {
      return NextResponse.json({ success: true, data: [] });
    }

    // Get scores for these students, month, semester
    const classScores = await db.select()
      .from(scores)
      .where(
        and(
          inArray(scores.studentId, studentIds),
          eq(scores.examMonth, month),
          eq(scores.semester, semester)
        )
      );

    return NextResponse.json({ success: true, data: classScores });
  } catch (error) {
    console.error('Failed to fetch grades:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
