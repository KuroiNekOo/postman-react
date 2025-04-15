import React, { useState } from 'react'

export default function ApiForm({ onStart, loading }) {
  const [verbe, setVerbe] = useState('get');
  const [url, setUrl] = useState('https://jsonplaceholder.typicode.com/todos/1')
  const [count, setCount] = useState(10)
  const [delay, setDelay] = useState(0)

  const handleSubmit = (e) => {
    e.preventDefault()
    onStart({ verbe, url, count: parseInt(count), delay: parseInt(delay) })
  }

  return (
    <form onSubmit={handleSubmit}>
      <select value={verbe} onChange={(e) => setVerbe(e.target.value)}>
        <option value="get">GET</option>
        <option value="post">POST</option>
        <option value="put">PUT</option>
        <option value="patch">PATCH</option>
        <option value="delete">DELETE</option>
      </select>
      <input type="text" placeholder="URL API" value={url} onChange={(e) => setUrl(e.target.value)} />
      <input type="number" placeholder="Nombre de requêtes" value={count} onChange={(e) => setCount(e.target.value)} />
      <input type="number" placeholder="Délai entre requêtes (ms)" value={delay} onChange={(e) => setDelay(e.target.value)} />
      <button type="submit" disabled={ loading }>Lancer le test</button>
    </form>
  )
}
