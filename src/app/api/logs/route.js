import { NextResponse } from 'next/server';
import { db } from '@/db';
import { auditLogs, users } from '@/db/schema';
import { desc, eq } from 'drizzle-orm';
import { cookies } from 'next/headers';

export async function GET(request) {
  const cookieStore = await cookies();
  const role = cookieStore.get('user_role')?.value;

  if (!role || role !== 'admin') {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const logs = await db.select({
      id: auditLogs.id,
      action: auditLogs.action,
      details: auditLogs.details,
      createdAt: auditLogs.createdAt,
      user: {
        name: users.name,
        role: users.role
      }
    })
    .from(auditLogs)
    .leftJoin(users, eq(auditLogs.userId, users.id))
    .orderBy(desc(auditLogs.createdAt));

    return NextResponse.json({ success: true, data: logs });
  } catch (error) {
    console.error('Failed to fetch logs:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request) {
  const cookieStore = await cookies();
  const role = cookieStore.get('user_role')?.value;

  // We allow internal APIs to post logs, but for simplicity we verify role here too if called from client
  // If it's internal server-side call, we wouldn't use the route, we'd use db.insert directly.
  
  if (!role) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { action, details, userId } = body;

    const newLog = await db.insert(auditLogs).values({
      action,
      details,
      userId: userId || null
    }).returning();

    return NextResponse.json({ success: true, data: newLog[0] });
  } catch (error) {
    console.error('Failed to create log:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
