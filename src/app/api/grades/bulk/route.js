import { NextResponse } from 'next/server';
import { db } from '@/db';
import { scores, students, classes, users } from '@/db/schema';
import { eq, and, inArray } from 'drizzle-orm';
import { cookies } from 'next/headers';

export async function POST(request) {
  const cookieStore = await cookies();
  const role = cookieStore.get('user_role')?.value;
  const username = cookieStore.get('auth_token')?.value;

  if (!role || !username || role !== 'teacher') {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { classId, examMonth, semester, newScores } = await request.json();
    
    if (!classId || !examMonth || !semester || !Array.isArray(newScores)) {
      return NextResponse.json({ success: false, error: 'Invalid payload' }, { status: 400 });
    }

    const currentUser = await db.select().from(users).where(eq(users.username, username)).limit(1);
    const teacherId = currentUser[0]?.id;

    // Verify ownership
    const existingClass = await db.select().from(classes).where(and(eq(classes.id, Number(classId)), eq(classes.teacherId, teacherId))).limit(1);
    if (!existingClass.length) {
      return NextResponse.json({ success: false, error: 'Unauthorized class access' }, { status: 403 });
    }

    // Get all student IDs for this class
    const classStudents = await db.select({ id: students.id }).from(students).where(eq(students.classId, Number(classId)));
    const studentIds = classStudents.map(s => s.id);

    if (studentIds.length === 0) {
      return NextResponse.json({ success: true, message: 'No students in class' });
    }

    // 1. Delete existing scores for these students, month, and semester
    await db.delete(scores).where(
      and(
        inArray(scores.studentId, studentIds),
        eq(scores.examMonth, examMonth),
        eq(scores.semester, semester)
      )
    );

    // 2. Insert new scores if any
    const validScores = newScores.filter(s => studentIds.includes(Number(s.studentId)));
    if (validScores.length > 0) {
      const inserts = validScores.map(s => ({
        studentId: Number(s.studentId),
        subjectName: s.subjectName,
        homeworkScore: Number(s.homeworkScore) || 0,
        examScore: Number(s.examScore) || 0,
        examMonth,
        semester
      }));
      await db.insert(scores).values(inserts);
    }

    return NextResponse.json({ success: true, message: 'Grades saved successfully' });
  } catch (error) {
    console.error('Failed to bulk save grades:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
