'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface Prompt {
  id: number
  title: string
  category: string
  content: string
  date: string
  tags: string
}

export default function AdminPage() {
  const [prompts, setPrompts] = useState<Prompt[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Prompt | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const router = useRouter()

  // Form state
  const [form, setForm] = useState({
    title: '',
    category: '',
    content: '',
    date: '',
    tags: ''
  })

  // Check auth and fetch prompts
  useEffect(() => {
    const checkAuth = async () => {
      const res = await fetch('/api/prompts')
      if (res.ok) {
        const data = await res.json()
        setPrompts(data)
      }
      setLoading(false)
    }
    checkAuth()
  }, [])

  const handleAdd = () => {
    setIsAdding(true)
    setEditing(null)
    setForm({
      title: '',
      category: '',
      content: '',
      date: new Date().toISOString().split('T')[0],
      tags: ''
    })
  }

  const handleEdit = (prompt: Prompt) => {
    setEditing(prompt)
    setIsAdding(false)
    setForm({
      title: prompt.title,
      category: prompt.category,
      content: prompt.content,
      date: prompt.date,
      tags: prompt.tags
    })
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Yakin mau hapus prompt ini?')) return
    
    const res = await fetch(`/api/prompts/${id}`, {
      method: 'DELETE'
    })
    
    if (res.ok) {
      setPrompts(prompts.filter(p => p.id !== id))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const url = editing ? `/api/prompts/${editing.id}` : '/api/prompts'
    const method = editing ? 'PUT' : 'POST'
    
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
    
    if (res.ok) {
      // Refresh list
      const refresh = await fetch('/api/prompts')
      const data = await refresh.json()
      setPrompts(data)
      setIsAdding(false)
      setEditing(null)
    } else {
      if (res.status === 401) {
        router.push('/admin/login')
      }
      alert('Gagal menyimpan prompt!')
    }
  }

  const handleLogout = async () => {
    await fetch('/api/auth', { method: 'DELETE' })
    router.push('/admin/login')
  }

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </main>
    )
  }

  return (
    <main className="min-h-screen max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-gray-400">{prompts.length} prompts</p>
        </div>
        <div className="flex gap-3">
          <button onClick={handleAdd} className="btn btn-primary">
            + Tambah Prompt
          </button>
          <button onClick={handleLogout} className="btn bg-red-600 hover:bg-red-700 text-white">
            Logout
          </button>
        </div>
      </div>

      {/* Form Add/Edit */}
      {(isAdding || editing) && (
        <div className="card mb-6">
          <h2 className="text-xl font-bold mb-4">
            {editing ? 'Edit Prompt' : 'Tambah Prompt Baru'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Title</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({...form, title: e.target.value})}
                className="input"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Category</label>
              <input
                type="text"
                value={form.category}
                onChange={(e) => setForm({...form, category: e.target.value})}
                className="input"
                placeholder="ChatGPT, Jailbreak, etc"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Content</label>
              <textarea
                value={form.content}
                onChange={(e) => setForm({...form, content: e.target.value})}
                className="input min-h-[100px]"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Date</label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm({...form, date: e.target.value})}
                className="input"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Tags (pisahkan dengan koma)</label>
              <input
                type="text"
                value={form.tags}
                onChange={(e) => setForm({...form, tags: e.target.value})}
                className="input"
                placeholder="tag1,tag2,tag3"
              />
            </div>
            <div className="flex gap-3">
              <button type="submit" className="btn btn-primary">
                {editing ? 'Update' : 'Simpan'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsAdding(false)
                  setEditing(null)
                }}
                className="btn bg-gray-600 hover:bg-gray-700 text-white"
              >
                Batal
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Prompt List */}
      <div className="space-y-3">
        {prompts.map((prompt) => (
          <div key={prompt.id} className="card flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <h3 className="text-lg font-medium">{prompt.title}</h3>
                <span className="text-xs bg-purple-600/20 text-purple-300 px-2 py-0.5 rounded">
                  {prompt.category}
                </span>
              </div>
              <p className="text-gray-400 text-sm line-clamp-2">{prompt.content}</p>
              <div className="flex gap-2 mt-2">
                {prompt.tags.split(',').map((tag) => (
                  <span key={tag} className="text-xs text-gray-500">#{tag.trim()}</span>
                ))}
              </div>
              <p className="text-xs text-gray-600 mt-1">{prompt.date}</p>
            </div>
            <div className="flex gap-2 ml-4">
              <button
                onClick={() => handleEdit(prompt)}
                className="btn btn-edit text-sm px-3 py-1"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(prompt.id)}
                className="btn btn-danger text-sm px-3 py-1"
              >
                Hapus
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}
