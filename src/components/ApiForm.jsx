import React, { useState } from 'react'

export default function ApiForm({ onStart, loading }) {
  const [verbe, setVerbe] = useState('get');
  const [url, setUrl] = useState('https://jsonplaceholder.typicode.com/todos/1')
  const [count, setCount] = useState(10)
  const [delay, setDelay] = useState(0)
  const [salveSize, setSalveSize] = useState(1)
  const [body, setBody] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    onStart({ verbe, url, count: parseInt(count), delay: parseInt(delay), salveSize: parseInt(salveSize), body })
  }

  return (
    <form onSubmit={handleSubmit}>

      <div style={{ display: 'flex', gap: '10px' }}>
        <select disabled={ loading } value={verbe} onChange={(e) => setVerbe(e.target.value)}>
          <option value="get">GET</option>
          <option value="post">POST</option>
          <option value="put">PUT</option>
          <option value="patch">PATCH</option>
          <option value="delete">DELETE</option>
        </select>
        <input disabled={ loading } type="text" placeholder="URL API" value={url} onChange={(e) => setUrl(e.target.value)} />
        <input disabled={ loading } type="number" placeholder="Nombre de requêtes" value={count} onChange={(e) => setCount(e.target.value)} />
        <input disabled={ loading } type="number" placeholder="Délai entre requêtes (ms)" value={delay} onChange={(e) => setDelay(e.target.value)} />
        <input disabled={ loading } type="number" placeholder="Taille de la salve" value={salveSize} onChange={(e) => setSalveSize(e.target.value)} />
      </div>

      <div style={{ display: 'flex', gap: '10px', flexDirection: 'column', margin: '10px 0', width: '100%' }}>
        <label htmlFor="body">Corps de la requête (JSON)</label>
        <textarea id="body" value={body} rows={10} disabled={ loading } onChange={(e) => setBody(e.target.value)} style={{ width: '100%' }} />
      </div>

      <button type="submit" disabled={ loading } style={{ width: '50%' }}>Lancer le test</button>

    </form>
  )
}
