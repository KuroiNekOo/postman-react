export const applyMiddlewares = async (req, middlewares) => {
  let index = 0

  const next = async () => {
    const mw = middlewares[index++]?.fn

    if (mw) {
      await mw(req, next)
    }
  }

  await next()
  return req
}

export const runAllMiddlewares = async (req) => {
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)

    if (key.startsWith('middleware:')) {
      const code = localStorage.getItem(key)

      try {
        console.log(`Exécution de ${key}`)
        const middlewareFunc = new Function('req', `return (async () => { ${code} })();`)
        await middlewareFunc(req)
      } catch (err) {
        console.error(`Erreur dans ${key} :`, err)
      }
    }
  }
}
