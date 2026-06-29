import { NextResponse } from 'next/server';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq, ilike, or } from 'drizzle-orm';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';

// Helper: verify admin role
async function verifyAdmin() {
  const cookieStore = await cookies();
  const role = cookieStore.get('user_role')?.value;
  return role === 'admin';
}

export async function GET(request) {
  if (!(await verifyAdmin())) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const role = searchParams.get('role');

    let query = db.select({
      id: users.id,
      username: users.username,
      name: users.name,
      email: users.email,
      role: users.role,
    }).from(users);

    // Apply search filter
    if (search) {
      query = query.where(
        or(
          ilike(users.name, `%${search}%`),
          ilike(users.email, `%${search}%`),
          ilike(users.username, `%${search}%`)
        )
      );
    }

    // Apply role filter
    if (role && role !== 'all') {
      query = query.where(eq(users.role, role));
    }

    const allUsers = await query;
    
    return NextResponse.json({ success: true, data: allUsers });
  } catch (error) {
    console.error('Failed to fetch users:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request) {
  if (!(await verifyAdmin())) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { username, name, email, password, role: newRole } = body;

    if (!username || !password) {
      return NextResponse.json({ success: false, error: 'Username and password are required' }, { status: 400 });
    }

    // Check for duplicate username
    const existing = await db.select({ id: users.id }).from(users).where(eq(users.username, username.trim().toLowerCase()));
    if (existing.length > 0) {
      return NextResponse.json({ success: false, error: 'ឈ្មោះគណនីនេះមានរួចហើយ (Username already exists)' }, { status: 409 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await db.insert(users).values({
      username: username.trim().toLowerCase(),
      name: name || '',
      email: email || '',
      password: hashedPassword,
      role: newRole || 'teacher'
    }).returning({
      id: users.id,
      username: users.username,
      name: users.name,
      email: users.email,
      role: users.role
    });

    return NextResponse.json({ success: true, data: newUser[0] });
  } catch (error) {
    console.error('Failed to create user:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(request) {
  if (!(await verifyAdmin())) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, username, name, email, password, role: newRole } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: 'Missing user ID' }, { status: 400 });
    }

    const updateData = { name, email, role: newRole };
    if (username) {
      updateData.username = username.trim().toLowerCase();
    }
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await db.update(users)
      .set(updateData)
      .where(eq(users.id, id))
      .returning({
        id: users.id,
        username: users.username,
        name: users.name,
        email: users.email,
        role: users.role
      });

    if (updatedUser.length === 0) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updatedUser[0] });
  } catch (error) {
    console.error('Failed to update user:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request) {
  if (!(await verifyAdmin())) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Missing user ID' }, { status: 400 });
    }

    // Prevent deleting self
    const cookieStore = await cookies();
    const currentUsername = cookieStore.get('auth_token')?.value;
    const targetUser = await db.select({ username: users.username }).from(users).where(eq(users.id, parseInt(id)));
    
    if (targetUser.length > 0 && targetUser[0].username === currentUsername) {
      return NextResponse.json({ success: false, error: 'អ្នកមិនអាចលុបគណនីខ្លួនឯងបានទេ (Cannot delete your own account)' }, { status: 400 });
    }

    await db.delete(users).where(eq(users.id, parseInt(id)));

    return NextResponse.json({ success: true, message: 'User deleted' });
  } catch (error) {
    console.error('Failed to delete user:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
