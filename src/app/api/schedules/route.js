import { NextResponse } from 'next/server';
import { db } from '@/db';
import { timetables, classes, users } from '@/db/schema';
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
    const currentUser = await db.select().from(users).where(eq(users.username, username)).limit(1);
    const teacherId = currentUser[0]?.id;

    // Fetch timetables and join with classes to get class details (name, color, subject)
    const schedules = await db.select({
      id: timetables.id,
      dayOfWeek: timetables.dayOfWeek,
      shift: timetables.shift,
      startTime: timetables.startTime,
      endTime: timetables.endTime,
      room: timetables.room,
      classId: timetables.classId,
      className: classes.className,
      color: classes.color,
      subject: classes.subject
    })
    .from(timetables)
    .leftJoin(classes, eq(timetables.classId, classes.id))
    .where(eq(timetables.teacherId, teacherId));

    return NextResponse.json({ success: true, data: schedules });
  } catch (error) {
    console.error('Failed to fetch schedules:', error);
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
    const { classId, dayOfWeek, shift, startTime, endTime, room } = body; 

    if (!classId || !dayOfWeek || !shift || !startTime || !endTime) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    const currentUser = await db.select().from(users).where(eq(users.username, username)).limit(1);
    const teacherId = currentUser[0]?.id;

    // Verify ownership of the class
    const existingClass = await db.select().from(classes).where(and(eq(classes.id, Number(classId)), eq(classes.teacherId, teacherId))).limit(1);
    
    if (!existingClass.length) {
      return NextResponse.json({ success: false, error: 'Unauthorized to use this class' }, { status: 403 });
    }

    const inserted = await db.insert(timetables).values({
      teacherId,
      classId: Number(classId),
      dayOfWeek,
      shift,
      startTime,
      endTime,
      room: room || ''
    }).returning();

    return NextResponse.json({ success: true, data: inserted[0] });
  } catch (error) {
    console.error('Failed to create schedule block:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
