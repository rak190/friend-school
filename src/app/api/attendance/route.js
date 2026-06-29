import { NextResponse } from 'next/server';
import { db } from '@/db';
import { students, attendance, classes, users } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { cookies } from 'next/headers';

export async function GET(request) {
  const cookieStore = await cookies();
  const role = cookieStore.get('user_role')?.value;
  const username = cookieStore.get('auth_token')?.value;

  if (!role || !username || role !== 'teacher') {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const url = new URL(request.url);
    const classId = url.searchParams.get('classId');
    const dateStr = url.searchParams.get('date'); // YYYY-MM-DD

    if (!classId || !dateStr) {
      return NextResponse.json({ success: false, error: 'Missing classId or date' }, { status: 400 });
    }

    // Security check: Ensure the teacher owns this class
    const currentUser = await db.select().from(users).where(eq(users.username, username)).limit(1);
    const teacherId = currentUser[0]?.id;
    const existingClass = await db.select().from(classes).where(and(eq(classes.id, Number(classId)), eq(classes.teacherId, teacherId))).limit(1);
    
    if (!existingClass.length) {
      return NextResponse.json({ success: false, error: 'Unauthorized to view this class' }, { status: 403 });
    }

    // 1. Fetch all students in the class
    const classStudents = await db.select().from(students).where(eq(students.classId, Number(classId)));

    // 2. Fetch existing attendance records for these students on the given date
    // We can just fetch all attendance for the date, and then filter/match by studentId in JS
    const attendanceRecords = await db.select().from(attendance).where(eq(attendance.date, dateStr));

    // Create a lookup map for fast access: { studentId: status }
    const statusMap = {};
    attendanceRecords.forEach(record => {
      statusMap[record.studentId] = record.status;
    });

    // Merge students with their attendance status
    const mergedData = classStudents.map(student => ({
      ...student,
      status: statusMap[student.id] || 'វត្តមាន' // Default to Present (វត្តមាន) if no record
    }));

    return NextResponse.json({ success: true, data: mergedData });
  } catch (error) {
    console.error('Failed to fetch attendance:', error);
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
    const body = await request.json();
    const { classId, date, attendanceData } = body; 
    // attendanceData is an array of { studentId, status }

    if (!classId || !date || !Array.isArray(attendanceData)) {
      return NextResponse.json({ success: false, error: 'Invalid payload' }, { status: 400 });
    }

    // Verify ownership
    const currentUser = await db.select().from(users).where(eq(users.username, username)).limit(1);
    const teacherId = currentUser[0]?.id;
    const existingClass = await db.select().from(classes).where(and(eq(classes.id, Number(classId)), eq(classes.teacherId, teacherId))).limit(1);
    
    if (!existingClass.length) {
      return NextResponse.json({ success: false, error: 'Unauthorized to modify this class' }, { status: 403 });
    }

    // Upsert logic without unique constraint: Delete existing records for that date and student, then insert new.
    for (const record of attendanceData) {
      await db.delete(attendance)
        .where(and(eq(attendance.studentId, record.studentId), eq(attendance.date, date)));
        
      await db.insert(attendance).values({
        studentId: record.studentId,
        date: date,
        status: record.status
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to save attendance:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
