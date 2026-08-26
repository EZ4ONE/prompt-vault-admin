import { NextRequest, NextResponse } from 'next/server'
import { getAllPrompts, createPrompt } from '@/lib/db'
import { isAuthenticated } from '@/lib/auth'

// GET all prompts (public)
export async function GET() {
  const prompts = getAllPrompts()
  return NextResponse.json(prompts)
}

// POST new prompt (admin only)
export async function POST(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  const { title, category, content, date, tags } = await request.json()
  
  if (!title || !category || !content || !date) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }
  
  const id = createPrompt(title, category, content, date, tags || '')
  return NextResponse.json({ id, success: true })
}
