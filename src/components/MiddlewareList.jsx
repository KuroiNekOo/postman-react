import React from 'react'

export default function MiddlewareList({ middlewares }) {
  return (
    <div>
      <h3>Middlewares actifs</h3>
      <ul>
        {middlewares.map((mw, i) => (
          <li onClick={ (e) => e.target.remove() } key={i}>{mw.name || `Middleware ${i + 1}`}</li>
        ))}
      </ul>
    </div>
  )
}
