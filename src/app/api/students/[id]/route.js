import { NextResponse } from 'next/server';
import { db } from '@/db';
import { students } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { cookies } from 'next/headers';

export async function PUT(request, { params }) {
  const { id } = params;
  const cookieStore = await cookies();
  const role = cookieStore.get('user_role')?.value;

  if (!role || role !== 'teacher') {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { firstName, lastName, gender, classId } = body;
    
    // We update classId dynamically. If they pass classId: null, it removes them from the class.
    const updateData = {};
    if (firstName !== undefined) updateData.firstName = firstName;
    if (lastName !== undefined) updateData.lastName = lastName;
    if (gender !== undefined) updateData.gender = gender;
    if (classId !== undefined) updateData.classId = classId;

    const updatedStudent = await db.update(students)
      .set(updateData)
      .where(eq(students.id, id))
      .returning();

    if (!updatedStudent.length) {
      return NextResponse.json({ success: false, error: 'Student not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updatedStudent[0] });
  } catch (error) {
    console.error('Failed to update student:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const { id } = params;
  const cookieStore = await cookies();
  const role = cookieStore.get('user_role')?.value;

  if (!role || role !== 'teacher') {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Delete the student
    // Note: If attendance or scores reference this student, it might cause a foreign key constraint error.
    // In a real app, you'd delete related records or cascade.
    await db.delete(students).where(eq(students.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete student:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
