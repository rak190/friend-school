import { NextResponse } from 'next/server';
import { db } from '@/db';
import { students, classes, users } from '@/db/schema';
import { sql, eq } from 'drizzle-orm';
import { cookies } from 'next/headers';

export async function GET() {
  const cookieStore = await cookies();
  const role = cookieStore.get('user_role')?.value;

  if (!role) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const studentsCountResult = await db.select({ count: sql`count(*)` }).from(students);
    const classesCountResult = await db.select({ count: sql`count(*)` }).from(classes);
    const usersCountResult = await db.select({ count: sql`count(*)` }).from(users);
    const teacherCountResult = await db.select({ count: sql`count(*)` }).from(users).where(eq(users.role, 'teacher'));

    let usersList = [];
    if (role === 'admin') {
      usersList = await db.select({ id: users.id, username: users.username, role: users.role }).from(users);
    }

    const totalStudents = Number(studentsCountResult[0].count);
    const totalClasses = Number(classesCountResult[0].count);
    const totalUsers = Number(usersCountResult[0].count);
    const totalTeachers = Number(teacherCountResult[0].count);

    return NextResponse.json({
      success: true,
      data: {
        totalStudents,
        totalClasses,
        totalUsers,
        totalTeachers,
        usersList,
        role
      }
    });
  } catch (err) {
    console.error('Dashboard API Error:', err);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
