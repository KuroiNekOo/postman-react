import { applyMiddlewares } from './middlewareEngine'
import { calculateStats } from './stats'

export const runLoadTest = async (verbe, url, count, delay, middlewares) => {
  const results = []
  const startTotal = performance.now()
  let start = null
  let end = null

  for (let i = 0; i < count; i++) {
    const req = { url, options: {
      method: verbe.toUpperCase(),
      headers: verbe.toUpperCase() === 'GET' ? {} : { 'Content-Type': 'application/json' },
      body: verbe.toUpperCase() !== 'GET' ? JSON.stringify({}) : null,
    } }

    try {
      await applyMiddlewares(req, middlewares)

      start = performance.now()
      const res = await fetch(req.url, req.options)
      end = performance.now()

      results.push({ status: res.status, time: end - start })
    } catch (err) {
      end = performance.now()
      results.push({ status: 'network_error', error: err.toString(), time: end - start })
    }

    if (delay > 0 && i < count - 1) {
      await new Promise(res => setTimeout(res, delay))
    }    
  }

  const endTotal = performance.now()
  const stats = calculateStats(results)
  stats.totalTime = `${(endTotal - startTotal).toFixed(2)}ms`

  return stats;
}
