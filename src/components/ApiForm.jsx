import React, { useState } from 'react'

export default function ApiForm({ onStart, setMiddlewaresLocalSto, middlewaresLocalSto, loading }) {
  const [verbe, setVerbe] = useState('get');
  const [url, setUrl] = useState('https://jsonplaceholder.typicode.com/todos/1')
  const [count, setCount] = useState(10)
  const [delay, setDelay] = useState(0)
  const [salveSize, setSalveSize] = useState(1)
  // const [middlewareFn, setMiddlewareFn] = useState(null)
  const [body, setBody] = useState('{}')

  // Gestionnaire de l'importation de middleware
  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    e.target.value = null // Réinitialiser le champ de fichier
  
    const reader = new FileReader()
    reader.onload = (event) => {
      const code = event.target.result

      // Permet de retirer juste l'extension de fin (.js)
      const filename = file.name.split('.').slice(0, -1).join('.')
  
      const key = `middleware:${filename}`
      console.log(`Fichier "${filename}" importé :`, code)
      localStorage.setItem(key, code)

      // Ajouter le middleware à la liste des middlewares
      // si le meme nom est deja present, on le remplace
      const existingMiddleware = middlewaresLocalSto.find(mw => mw === filename)
      if (!existingMiddleware) {
        setMiddlewaresLocalSto((prev) => [...prev, filename])
      }
  
      console.log(`Fichier "${filename}" stocké dans localStorage sous la clé "${key}"`)
    }
  
    reader.readAsText(file)
  }

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

      <div>
        <input type="file" accept=".js" onChange={handleFileChange} />
      </div>

      <div style={{ display: 'flex', gap: '10px', flexDirection: 'column', margin: '10px 0', width: '100%' }}>
        <label htmlFor="body">Corps de la requête (JSON)</label>
        <textarea id="body" value={body} rows={10} disabled={ loading } onChange={(e) => setBody(e.target.value)} style={{ width: '100%' }} />
      </div>

      <button type="submit" disabled={ loading } style={{ width: '50%' }}>Lancer le test</button>

    </form>
  )
}
