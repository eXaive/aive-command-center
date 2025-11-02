'use client'

import { useState, useEffect } from 'react'

const categories = [
  { key: 'politics', label: '🏛 Politics' },
  { key: 'economy', label: '💰 Economy' },
  { key: 'military', label: '⚔️ Military' },
  { key: 'crime', label: '🚨 Crime' },
  { key: 'health', label: '🧬 Health' },
  { key: 'disasters', label: '🌋 Disasters' },
  { key: 'technology', label: '🧠 Technology' },
  { key: 'environment', label: '🌍 Environment' },
]

export default function NewsDashboard() {
  const [selected, setSelected] = useState('politics')
  const [articles, setArticles] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true)
      try {
        const res = await fetch(`/api/news/${selected}`)
        const data = await res.json()
        setArticles(data)
      } catch (e) {
        console.error('Fetch error', e)
        setArticles([])
      } finally {
        setLoading(false)
      }
    }

    fetchNews()
  }, [selected])

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">
        🌐 Global Drivers News Dashboard
      </h1>

      {/* Category buttons */}
      <div className="flex flex-wrap justify-center gap-2 mb-6">
        {categories.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setSelected(cat.key)}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
              selected === cat.key
                ? 'bg-blue-500 text-white'
                : 'bg-gray-800 hover:bg-gray-700'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Loading state */}
      {loading && (
        <p className="text-center text-gray-400">Loading {selected} news...</p>
      )}

      {/* Articles grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {!loading &&
          articles.map((item, i) => (
            <a
              key={i}
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-gray-900 rounded-xl overflow-hidden hover:scale-[1.02] transition-transform"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h2 className="text-lg font-semibold mb-2 line-clamp-2">
                  {item.title}
                </h2>
                <p className="text-gray-400 text-sm mb-2 line-clamp-3">
                  {item.summary}
                </p>
                <div className="text-xs text-gray-500 flex justify-between">
                  <span>{item.source}</span>
                  <span>{new Date(item.pubDate).toLocaleDateString()}</span>
                </div>
              </div>
            </a>
          ))}
      </div>
    </div>
  )
}
