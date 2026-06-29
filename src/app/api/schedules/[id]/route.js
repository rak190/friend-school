import { NextResponse } from 'next/server';
import { db } from '@/db';
import { timetables, users, classes } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { cookies } from 'next/headers';

export async function PUT(request, { params }) {
  const cookieStore = await cookies();
  const role = cookieStore.get('user_role')?.value;
  const username = cookieStore.get('auth_token')?.value;

  if (!role || !username || role !== 'teacher') {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  try {
    const body = await request.json();
    const { classId, dayOfWeek, shift, startTime, endTime, room } = body;

    const currentUser = await db.select().from(users).where(eq(users.username, username)).limit(1);
    const teacherId = currentUser[0]?.id;

    // Verify ownership of the timetable block
    const existingBlock = await db.select().from(timetables).where(and(eq(timetables.id, Number(id)), eq(timetables.teacherId, teacherId))).limit(1);
    if (!existingBlock.length) {
      return NextResponse.json({ success: false, error: 'Unauthorized to modify this schedule block' }, { status: 403 });
    }

    // If changing classId, verify ownership of the new class
    if (classId && Number(classId) !== existingBlock[0].classId) {
      const existingClass = await db.select().from(classes).where(and(eq(classes.id, Number(classId)), eq(classes.teacherId, teacherId))).limit(1);
      if (!existingClass.length) {
        return NextResponse.json({ success: false, error: 'Unauthorized to use this class' }, { status: 403 });
      }
    }

    const updated = await db.update(timetables)
      .set({
        ...(classId && { classId: Number(classId) }),
        ...(dayOfWeek && { dayOfWeek }),
        ...(shift && { shift }),
        ...(startTime && { startTime }),
        ...(endTime && { endTime }),
        ...(room !== undefined && { room })
      })
      .where(eq(timetables.id, Number(id)))
      .returning();

    return NextResponse.json({ success: true, data: updated[0] });
  } catch (error) {
    console.error('Failed to update schedule block:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const cookieStore = await cookies();
  const role = cookieStore.get('user_role')?.value;
  const username = cookieStore.get('auth_token')?.value;

  if (!role || !username || role !== 'teacher') {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  try {
    const currentUser = await db.select().from(users).where(eq(users.username, username)).limit(1);
    const teacherId = currentUser[0]?.id;

    // Verify ownership of the timetable block
    const existingBlock = await db.select().from(timetables).where(and(eq(timetables.id, Number(id)), eq(timetables.teacherId, teacherId))).limit(1);
    if (!existingBlock.length) {
      return NextResponse.json({ success: false, error: 'Unauthorized to delete this schedule block' }, { status: 403 });
    }

    await db.delete(timetables).where(eq(timetables.id, Number(id)));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete schedule block:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
