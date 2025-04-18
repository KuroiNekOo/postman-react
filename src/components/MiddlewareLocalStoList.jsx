import React, { useEffect } from 'react'

export default function MiddlewareLocalStoList({ setMiddlewaresLocalSto, middlewaresLocalSto }) {
  // Charger les middlewares depuis le localStorage au démarrage
  useEffect(() => {
    const storedMiddlewares = []
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key.startsWith('middleware:')) {
        storedMiddlewares.push(key.replace('middleware:', '')) // On récupère juste le nom sans "middleware:"
      }
    }
    setMiddlewaresLocalSto(storedMiddlewares)
  }, [setMiddlewaresLocalSto])

  // Fonction pour supprimer un middleware
  const handleDelete = (middlewareName) => {
    const key = `middleware:${middlewareName}`
    localStorage.removeItem(key)

    // Met à jour l'état après suppression
    setMiddlewaresLocalSto((prevMiddlewares) => prevMiddlewares.filter(middleware => middleware !== middlewareName))
  }

  return (
    <div id='middlewares-container'>
      <h3>Middlewares Local Storage actifs</h3>
      {middlewaresLocalSto.length === 0 ? (
        <p>Aucun middleware actif.</p>
      ) : (
        <ul>
          {middlewaresLocalSto.map((middleware) => (
            <li key={middleware}>
              <span>{middleware}</span>
              <button onClick={() => handleDelete(middleware)} style={{ marginLeft: '10px' }}>
                Supprimer
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
