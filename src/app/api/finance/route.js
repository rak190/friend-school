import { NextResponse } from 'next/server';
import { db } from '@/db';
import { transactions } from '@/db/schema';
import { desc } from 'drizzle-orm';
import { cookies } from 'next/headers';

export async function GET(request) {
  const cookieStore = await cookies();
  const role = cookieStore.get('user_role')?.value;

  if (!role || (role !== 'admin' && role !== 'principal')) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const allTransactions = await db.select().from(transactions).orderBy(desc(transactions.id));
    return NextResponse.json({ success: true, data: allTransactions });
  } catch (error) {
    console.error('Failed to fetch transactions:', error);
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
    const { description, type, category, amount, status } = body;

    const newTransaction = await db.insert(transactions).values({
      date: new Date().toISOString().split('T')[0],
      description,
      type,
      category,
      amount: parseInt(amount, 10),
      status: status || 'ជោគជ័យ'
    }).returning();

    return NextResponse.json({ success: true, data: newTransaction[0] });
  } catch (error) {
    console.error('Failed to create transaction:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
