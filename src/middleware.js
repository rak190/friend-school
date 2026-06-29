import { NextResponse } from 'next/server';

export function middleware(request) {
  const isAuth = !!request.cookies.get('auth_token')?.value;
  const userRole = request.cookies.get('user_role')?.value;
  const isParentAuth = !!request.cookies.get('parent_student_id')?.value;
  
  const { pathname } = request.nextUrl;
  const isLoginPage = pathname.startsWith('/login') || pathname === '/parents/login';

  const isValidRole = ['admin', 'principal', 'teacher'].includes(userRole);
  
  // If they have auth_token but an invalid role, treat as unauthenticated
  const actuallyAuth = isAuth && isValidRole;

  // If trying to access parent routes
  if (pathname.startsWith('/parents')) {
    if (pathname === '/parents/login') {
      if (isParentAuth) return NextResponse.redirect(new URL('/parents', request.url));
      return NextResponse.next();
    }
    if (!isParentAuth) {
      return NextResponse.redirect(new URL('/parents/login', request.url));
    }
    return NextResponse.next(); // Let them into parent routes
  }

  // General auth checks for staff
  if (!actuallyAuth && !isLoginPage) {
    // Clear invalid cookies before redirecting to login to prevent loops
    const response = NextResponse.redirect(new URL('/login', request.url));
    response.cookies.delete('auth_token');
    response.cookies.delete('user_role');
    return response;
  }

  if (actuallyAuth && pathname.startsWith('/login')) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // RBAC routing from root
  if (actuallyAuth && pathname === '/') {
    if (userRole === 'admin') return NextResponse.redirect(new URL('/admin', request.url));
    if (userRole === 'principal') return NextResponse.redirect(new URL('/principal', request.url));
    if (userRole === 'teacher') return NextResponse.redirect(new URL('/teacher', request.url));
  }

  // Prevent accessing other roles' dashboards directly
  if (actuallyAuth && pathname.startsWith('/admin') && userRole !== 'admin') return NextResponse.redirect(new URL('/', request.url));
  if (actuallyAuth && pathname.startsWith('/principal') && userRole !== 'principal') return NextResponse.redirect(new URL('/', request.url));
  if (actuallyAuth && pathname.startsWith('/teacher') && userRole !== 'teacher') return NextResponse.redirect(new URL('/', request.url));

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
