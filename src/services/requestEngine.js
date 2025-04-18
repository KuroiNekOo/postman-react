import { applyMiddlewares, runAllMiddlewares } from './middlewareEngine'
import { calculateStats } from './stats'

export const runLoadTest = async (verbe, url, count, delay, salveSize = 1, body, middlewares) => {
  console.log(`Lancement du test de charge : ${verbe.toUpperCase()} ${url} (${count} requêtes, ${delay}ms de délai, taille de la salve : ${salveSize})`)
  const results = []
  const responses = []
  const startTotal = performance.now()

  const totalSalves = Math.ceil(count / salveSize)

  for (let salveIndex = 0; salveIndex < totalSalves; salveIndex++) {
    const salvePromises = []

    const startIndex = salveIndex * salveSize
    const endIndex = Math.min(startIndex + salveSize, count)

    for (let i = startIndex; i < endIndex; i++) {
      const promise = (async () => {
        const req = {
          url,
          options: {
            method: verbe.toUpperCase(),
            headers: verbe.toUpperCase() === 'GET' ? {} : { 'Content-Type': 'application/json' },
            body: verbe.toUpperCase() === 'GET' ? null : body,
          }
        }

        let start = null
        let end = null

        try {
          await applyMiddlewares(req, middlewares)

          // Run les fonctions du localStorage
          await runAllMiddlewares(req)

          start = performance.now()
          const res = await fetch(req.url, req.options)
          end = performance.now()

          // Gestion du corps de la réponse seulement si c'est du json
          let json = null
          if (res.headers.get('content-type')?.includes('application/json')) {
            json = await res.json()
          } else {
            json = await res.text()
          }

          responses.push(json)
          results.push({ status: res.status, time: end - start })
        } catch (err) {
          end = performance.now()
          results.push({ status: 'network_error', error: err.toString(), time: end - start })
        }
      })()

      salvePromises.push(promise)
    }

    // Attendre que toutes les requêtes de la salve soient terminées
    await Promise.all(salvePromises)

    // Attendre entre les salves si ce n’est pas la dernière
    if (delay > 0 && salveIndex < totalSalves - 1) {
      await new Promise(res => setTimeout(res, delay))
    }
  }

  const endTotal = performance.now()
  const stats = calculateStats(results)
  stats.totalTime = `${(endTotal - startTotal).toFixed(2)}ms`

  return {
    stats,
    responses,
  }
}
