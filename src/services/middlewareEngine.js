export const applyMiddlewares = async (reqConfig, middlewares) => {
  let index = 0

  const next = async () => {
    const mw = middlewares[index++]
    if (mw) {
      await mw(reqConfig, next)
    }
  }

  await next()
  return reqConfig
}
