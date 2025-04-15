import React, { useState, useRef } from 'react'
import ApiForm from './components/ApiForm'
import MiddlewareList from './components/MiddlewareList'
import StatsDisplay from './components/StatsDisplay'
import { runLoadTest } from './services/requestEngine'
import { middlewareMap } from './middlewares'
import './App.css'

export default function App() {
  const [middlewares, setMiddlewares] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const timerRef = useRef(null)

  const handleStartTest = async ({ verbe, url, count, delay }) => {
    setStats(null)
    setElapsed(0)
    setLoading(true)

    // start timer
    timerRef.current = setInterval(() => {
      setElapsed(prev => prev + 1)
    }, 1000)

    const result = await runLoadTest(verbe, url, count, delay, middlewares)

    clearInterval(timerRef.current)
    setLoading(false)
    setStats(result)
  }

  const handleAddMiddleware = async (filename) => {
    if (middlewareMap[filename]) {
      const mod = await middlewareMap[filename]()
      setMiddlewares(prev => [...prev, mod.default])
    } else {
      console.warn('Middleware non trouvé :', filename)
    }
  }

  return (
    <div>
      <h1>Testeur de Résilience d’API</h1>
      <ApiForm onStart={handleStartTest} loading={loading} />

      {/* <button onClick={() => handleAddMiddleware('exemple.js')} disabled={ loading }>
        Ajouter Middleware d'exemple
      </button> */}

      <select onClick={(e) => {
        handleAddMiddleware(e.target.value)
        e.target.value = ""
      }} disabled={ loading }>
        <option value="" default>-- Sélectionnez votre choix --</option>
        <option value="exemple.js">exemple.js</option>
      </select>

      <MiddlewareList middlewares={middlewares} />
      
      {loading && (
        <div className="loader">
          <p>Lancement du test en cours...</p>
          <p>⏱ Temps écoulé : {elapsed} s</p>
        </div>
      )}

      {!loading && stats && <StatsDisplay stats={stats} />}
    </div>
  )
}
