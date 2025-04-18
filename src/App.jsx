import React, { useState, useRef, useEffect } from 'react'
import ApiForm from './components/ApiForm'
import MiddlewareList from './components/MiddlewareList'
import StatsDisplay from './components/StatsDisplay'
import { runLoadTest } from './services/requestEngine'
import { middlewareMap } from './middlewares'
import './App.css'
import ResponseDisplay from './components/ResponseDisplay'
import MiddlewareLocalStoList from './components/MiddlewareLocalStoList'

export default function App() {
  const [middlewares, setMiddlewares] = useState([])
  const [responses, setResponses] = useState(null)
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const [middlewaresLocalSto, setMiddlewaresLocalSto] = useState([])
  const timerRef = useRef(null)

  useEffect(() => {

    if (loading) {
      timerRef.current = setInterval(() => {
        setElapsed(prevElapsed => prevElapsed + 1)
      }, 1000)
    }


    return () => clearInterval(timerRef.current)

  }, [loading])

  const handleStartTest = async ({ verbe, url, count, delay, salveSize, body }) => {
    setResponses(null)
    setStats(null)
    setElapsed(0)
    setLoading(true)

    if (verbe === 'put' || verbe === 'post' || verbe === 'patch') {
      try {
        JSON.parse(body)
      } catch (error) {
        alert('Le corps de la requête n\'est pas un JSON valide.' + error)
        setLoading(false)
        return
      }
    }

    const result = await runLoadTest(verbe, url, count, delay, salveSize, body, middlewares)

    clearInterval(timerRef.current)
    setLoading(false)
    setStats(result.stats)
    setResponses(result.responses)
  }

  const handleAddMiddleware = async (filename) => {
    if (middlewareMap[filename]) {
      const mod = await middlewareMap[filename]()
      setMiddlewares(prev => [...prev, { id: Date.now(), fn: mod.default }])
    } else {
      console.warn('Middleware non trouvé :', filename)
    }
  }

  return (
    <div>
      <h1>Testeur d’API</h1>
      <ApiForm onStart={handleStartTest} setMiddlewaresLocalSto={ setMiddlewaresLocalSto } middlewaresLocalSto={ middlewaresLocalSto } loading={loading} />

      {/* <button onClick={() => handleAddMiddleware('exemple.js')} disabled={ loading }>
        Ajouter Middleware d'exemple
      </button> */}

      <select onClick={(e) => {
        handleAddMiddleware(e.target.value)
        e.target.value = ""
      }} disabled={ loading }>
        <option value="" default>-- Sélectionnez votre choix --</option>
        <option value="exemple.js">exemple.js</option>
        <option value="pow.js">pow.js</option>

      </select>

      <MiddlewareList middlewares={middlewares} setMiddlewares={setMiddlewares} />

      <MiddlewareLocalStoList setMiddlewaresLocalSto={ setMiddlewaresLocalSto } middlewaresLocalSto={ middlewaresLocalSto } />
      
      {loading && (
        <div className="loader">
          <p>Lancement du test en cours...</p>
          <p>⏱ Temps écoulé : {elapsed} s</p>
        </div>
      )}

      {!loading && responses && <ResponseDisplay responses={responses} />}

      {!loading && stats && <StatsDisplay stats={stats} />}
    </div>
  )
}
