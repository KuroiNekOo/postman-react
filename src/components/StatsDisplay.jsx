import React from 'react'

export default function StatsDisplay({ stats }) {
  return (
    <div id='stats-container'>
      <h3>Statistiques</h3>
      <pre>{JSON.stringify(stats, null, 2)}</pre>
    </div>
  )
}
