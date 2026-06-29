import { NextResponse } from 'next/server';
import { db } from '@/db';
import { announcements } from '@/db/schema';
import { desc } from 'drizzle-orm';
import { cookies } from 'next/headers';

export async function GET(request) {
  const cookieStore = await cookies();
  const role = cookieStore.get('user_role')?.value;

  if (!role) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // In the future, we could filter by audience depending on the user's role.
    // For now, Principal gets all.
    const allPosts = await db.select().from(announcements).orderBy(desc(announcements.createdAt));
    return NextResponse.json({ success: true, data: allPosts });
  } catch (error) {
    console.error('Failed to fetch announcements:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request) {
  const cookieStore = await cookies();
  const role = cookieStore.get('user_role')?.value;

  if (!role || (role !== 'admin' && role !== 'principal')) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { title, content, type, audience, eventDate, imageUrl, attachmentUrl, attachmentName, attachmentType } = body;

    const newPost = await db.insert(announcements).values({
      title,
      content,
      type: type || 'announcement',
      audience: audience || 'everyone',
      eventDate: eventDate || null,
      imageUrl: imageUrl || null,
      attachmentUrl: attachmentUrl || null,
      attachmentName: attachmentName || null,
      attachmentType: attachmentType || null
    }).returning();

    return NextResponse.json({ success: true, data: newPost[0] });
  } catch (error) {
    console.error('Failed to create announcement:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
