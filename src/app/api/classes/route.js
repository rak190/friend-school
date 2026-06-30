import { NextResponse } from 'next/server';
import { db } from '@/db';
import { classes, students, users } from '@/db/schema';
import { eq, sql } from 'drizzle-orm';
import { cookies } from 'next/headers';

export async function GET() {
  const cookieStore = await cookies();
  const role = cookieStore.get('user_role')?.value;
  const username = cookieStore.get('auth_token')?.value;

  if (!role || !username) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Get the current user
    const currentUser = await db.select().from(users).where(eq(users.username, username)).limit(1);
    if (!currentUser.length) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }
    const teacherId = currentUser[0].id;

    // Fetch classes for this teacher
    const teacherClasses = await db.select({
      id: classes.id,
      name: classes.className,
      subject: classes.subject,
      schedule: classes.schedule,
      progress: classes.progress,
      color: classes.color,
      gradeSubjects: classes.gradeSubjects,
      studentsCount: sql`count(${students.id})`.mapWith(Number)
    })
    .from(classes)
    .leftJoin(students, eq(classes.id, students.classId))
    .where(eq(classes.teacherId, teacherId))
    .groupBy(classes.id);

    return NextResponse.json({ success: true, data: teacherClasses });
  } catch (error) {
    console.error('Failed to fetch classes:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request) {
  const cookieStore = await cookies();
  const role = cookieStore.get('user_role')?.value;
  const username = cookieStore.get('auth_token')?.value;

  if (!role || !username || role !== 'teacher') {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const currentUser = await db.select().from(users).where(eq(users.username, username)).limit(1);
    if (!currentUser.length) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }
    const teacherId = currentUser[0].id;

    const body = await request.json();
    const { className, academicYear, subject, schedule, color } = body;

    const newClass = await db.insert(classes).values({
      className,
      academicYear: academicYear || '2025-2026',
      subject,
      schedule,
      color: color || 'bg-brand-blue',
      gradeSubjects: 'អង់គ្លេស',
      progress: 0,
      teacherId
    }).returning();

    return NextResponse.json({ success: true, data: newClass[0] });
  } catch (error) {
    console.error('Failed to create class:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
