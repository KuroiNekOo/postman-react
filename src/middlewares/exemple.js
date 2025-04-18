export default async function exempleMiddleware(req, next) {
  console.log('MW')
  console.log(req)

  // if (req?.options?.body) {
  //   req.options.body.nono = JSON.stringify({ ...JSON.parse(req?.options?.body), injected: 'byExampleMiddleware' })
  // }

  req.options.headers = {
    ...(req.options.headers || {}),
    'X-Custom-Header': 'InjectedByMiddleware'
  }
  await next()
}
