import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

export default async function RootPage() {
  const cookieStore = await cookies();
  const role = cookieStore.get('user_role')?.value;

  // Fallback routing if middleware didn't catch it
  if (role === 'admin') redirect('/admin');
  if (role === 'principal') redirect('/principal');
  if (role === 'teacher') redirect('/teacher');

  // If no role, go to login
  redirect('/login');
}
