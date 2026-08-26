import { NextRequest, NextResponse } from 'next/server'
import { checkPassword } from '@/lib/auth'

export async function POST(request: NextRequest) {
  const { password } = await request.json()
  
  if (checkPassword(password)) {
    const response = NextResponse.json({ success: true })
    response.cookies.set('admin_auth', 'true', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    })
    return response
  }
  
  return NextResponse.json({ success: false, error: 'Wrong password' }, { status: 401 })
}

export async function DELETE(request: NextRequest) {
  const response = NextResponse.json({ success: true })
  response.cookies.delete('admin_auth')
  return response
}
