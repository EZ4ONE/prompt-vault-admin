import { NextRequest } from 'next/server'

// GANTI PASSWORD INI!
const ADMIN_PASSWORD = 'admin123'

export function isAuthenticated(request: NextRequest): boolean {
  const cookie = request.cookies.get('admin_auth')
  return cookie?.value === 'true'
}

export function checkPassword(password: string): boolean {
  return password === ADMIN_PASSWORD
}
