export const calculateStats = (results) => {
  const total = results.length
  const times = results.filter(r => r.time).map(r => r.time)
  const success = results.filter(r => r.status >= 200 && r.status < 300).length
  const errors = {
    network: results.filter(r => r.status === 'network_error').length,
    http4xx: results.filter(r => r.status >= 400 && r.status < 500).length,
    http5xx: results.filter(r => r.status >= 500).length,
  }

  const avg = times.reduce((a, b) => a + b, 0) / times.length || 0
  const min = Math.min(...times)
  const max = Math.max(...times)

  return {
    total,
    success,
    errors,
    avgResponseTime: `${avg.toFixed(2)}ms`,
    minResponseTime: `${min.toFixed(2)}ms`,
    maxResponseTime: `${max.toFixed(2)}ms`,
    successRate: ((success / total) * 100).toFixed(2) + '%',
  }
}
