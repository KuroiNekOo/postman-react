export default async function exempleMiddleware(req, next) {
  console.log('MW')
  req.options.headers = {
    ...(req.options.headers || {}),
    'X-Custom-Header': 'InjectedByMiddleware'
  }
  await next()
}
