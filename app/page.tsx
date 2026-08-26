'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Prompt {
  id: number
  title: string
  category: string
  content: string
  date: string
  tags: string
}

export default function Home() {
  const [prompts, setPrompts] = useState<Prompt[]>([])
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/prompts')
      .then(res => res.json())
      .then(data => {
        setPrompts(data)
        setLoading(false)
      })
  }, [])

  const categories = ['All', ...new Set(prompts.map(p => p.category))]

  const filtered = prompts.filter(p => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) ||
                       p.content.toLowerCase().includes(search.toLowerCase())
    const matchCategory = category === 'All' || p.category === category
    return matchSearch && matchCategory
  })

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </main>
    )
  }

  return (
    <main className="min-h-screen max-w-4xl mx-auto px-4 py-8">
      <header className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white">Prompt Vault</h1>
            <p className="text-gray-400 mt-1">Koleksi prompt AI by XSO</p>
          </div>
          <Link href="/admin/login">
            <button className="text-sm text-gray-400 hover:text-white border border-gray-600 px-4 py-1.5 rounded-lg">
              Admin
            </button>
          </Link>
        </div>
        <div className="flex gap-6 mt-2 text-sm text-gray-400">
          <span>{prompts.length} Total Prompt</span>
          <span>{categories.length - 1} Kategori</span>
        </div>
      </header>

      <div className="space-y-4">
        <input
          type="text"
          placeholder="🔍 Cari prompt..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-[#14141e] border border-[#2a2a3a] rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-600"
        />

        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-sm transition-colors ${
                category === cat
                  ? 'bg-purple-600 text-white'
                  : 'bg-[#14141e] text-gray-400 hover:text-white border border-[#2a2a3a]'
              }`}
            >
              {cat} {cat === 'All' ? `(${categories.length - 1})` : ''}
            </button>
          ))}
        </div>

        <div className="text-sm text-gray-400">
          {filtered.length} prompt ditemukan
        </div>

        <div className="space-y-3">
          {filtered.map((prompt) => (
            <div
              key={prompt.id}
              className="bg-[#14141e] border border-[#2a2a3a] rounded-lg p-4 hover:border-purple-600 transition-all cursor-pointer"
            >
              <div className="flex justify-between items-start">
                <h3 className="text-white font-medium">{prompt.title}</h3>
                <span className="text-xs text-gray-400 bg-[#0a0a0f] px-2 py-1 rounded">
                  {prompt.category}
                </span>
              </div>
              <p className="text-gray-400 text-sm mt-2 line-clamp-2">{prompt.content}</p>
              <div className="flex gap-2 mt-3">
                {prompt.tags.split(',').map((tag) => (
                  <span key={tag} className="text-xs text-gray-500 bg-[#0a0a0f] px-2 py-0.5 rounded">
                    #{tag.trim()}
                  </span>
                ))}
              </div>
              <div className="text-xs text-gray-600 mt-2">{prompt.date}</div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="text-center text-gray-400 py-12">
              Tidak ada prompt yang cocok
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
