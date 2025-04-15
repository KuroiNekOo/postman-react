import React from 'react'

export default function MiddlewareList({ middlewares, setMiddlewares }) {
  return (
    <div id='middlewares-container'>
      <h3>Middlewares actifs</h3>
      <ul>
        {middlewares.map(({ id, fn }) => (

          <li onClick={ () => {

            setMiddlewares(prev => {
              // Trouver l'objet avec l'id correspondant
              const middleware = prev.find(m => m.id === id)
              if (!middleware) return prev
              // Supprimer l'objet du tableau
              const newMiddlewares = prev.filter(m => m.id !== id)
              return newMiddlewares
            })

          } } key={id}>{fn.name || `Middleware ${id + 1}`}</li>

        ))}
      </ul>
    </div>
  )
}
