import { NextResponse } from 'next/server';
import { db } from '@/db';
import { settings } from '@/db/schema';
import { cookies } from 'next/headers';

export async function GET(request) {
  const cookieStore = await cookies();
  const role = cookieStore.get('user_role')?.value;

  if (!role || (role !== 'admin' && role !== 'principal')) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const allSettings = await db.select().from(settings);
    
    // Convert array [{key: 'a', value: 'b'}] to object { a: 'b' }
    const settingsObject = {};
    allSettings.forEach(s => {
      settingsObject[s.key] = s.value;
    });

    return NextResponse.json({ success: true, data: settingsObject });
  } catch (error) {
    console.error('Failed to fetch settings:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(request) {
  const cookieStore = await cookies();
  const role = cookieStore.get('user_role')?.value;

  if (!role || (role !== 'admin' && role !== 'principal')) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json(); // Expected format: { school_name: 'Value', academic_year: '2026' }
    
    // We will do upserts for each key
    const keys = Object.keys(body);
    
    for (const key of keys) {
      const value = body[key];
      await db.insert(settings)
        .values({ key, value: String(value) })
        .onConflictDoUpdate({ 
          target: settings.key, 
          set: { value: String(value) } 
        });
    }

    return NextResponse.json({ success: true, message: 'Settings updated' });
  } catch (error) {
    console.error('Failed to update settings:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
