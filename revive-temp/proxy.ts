import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  const { pathname } = request.nextUrl

  // Admin route protection
  if (pathname === '/admin/login') {
    if (user) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: profile } = await (supabase as any)
        .from('profiles')
        .select('is_active')
        .eq('id', user.id)
        .single()
      if (profile?.is_active) {
        return NextResponse.redirect(new URL('/admin', request.url))
      }
    }
    return supabaseResponse
  }

  if (!user) {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: profile } = await (supabase as any)
    .from('profiles')
    .select('is_active')
    .eq('id', user.id)
    .single()

  if (!profile?.is_active) {
    const url = new URL('/admin/login', request.url)
    url.searchParams.set('error', 'unauthorized')
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}

export const config = {
  // ⚡ ONLY run on /admin/* routes — NOT on homepage, programs, etc.
  // This eliminates auth DB calls on every public page load
  matcher: ['/admin/:path*'],
}
