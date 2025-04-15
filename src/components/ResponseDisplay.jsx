import React from 'react'

export default function ResponseDisplay({ responses }) {
  return (
    <div id='responses-container'>
      <h3>Reponse</h3>
      
      {responses && responses.map((response, index) => (
        <div key={index} className="response">
          <h5>Requête {index + 1}</h5>
          <pre>{JSON.stringify(response, null, 2)}</pre>
        </div>
      ))}
      
      {!responses?.length && <p>Aucune réponse disponible.</p>}

    </div>
  )
}
