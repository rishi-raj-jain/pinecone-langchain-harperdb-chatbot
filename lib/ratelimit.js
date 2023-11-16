import { searchByValue, update, insert } from './harper'

const rateLimitConfig = { maxUpdates: 5, timeSpan: 86400 }

const rateLimit = async (key) => {
  // Check the Rate Limit
  const t = await searchByValue(key, 'id', ['count_updates', 'last_update', 'hash'])
  if (t && t[0]) {
    // Get rate limit data
    const { count_updates, last_update, hash } = t[0]
    // Calculate time difference in seconds
    const currentTime = new Date().getTime()
    const timeDifference = Math.floor((currentTime - new Date(last_update).getTime()) / 1000)
    // If time window has passed, reset count
    if (timeDifference >= rateLimitConfig.timeSpan) {
      await update([{ id: key, count_updates: 1, last_update: currentTime, hash }])
      return true
    }
    // Check if the request count is below the limit
    if (Number(count_updates) < rateLimitConfig.maxUpdates) {
      // Assuming the limit is 5 requests in 24 hours
      await update([{ id: key, count_updates: Number(count_updates) + 1, last_update: new Date().getTime(), hash }])
      return true
    } else {
      return false
    }
  } else {
    await insert([{ id: key, count_updates: 1, last_update: new Date().getTime() }])
    return true
  }
}

export default rateLimit
