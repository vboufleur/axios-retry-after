export function isRetryable (error) {
  return !!(
    // must be a response error
    error.response &&
    // must be a rate limit error
    error.response.status === 429 &&
    // must have a Retry-After header
    error.response.headers['retry-after']
  )
}

export function wait (error) {
  const retryAfter = error.response.headers["retry-after"];
  const parsedRetryAfter = parseInt(retryAfter);
  const timeToWait = Number.isNaN(parsedRetryAfter)
    ? Date.parse(retryAfter) - Date.now()
    : parsedRetryAfter * 1000;
  return new Promise(
    resolve => setTimeout(resolve, timeToWait)
  )
}

export function retry (axios, error) {
  if (!error.config) {
    throw error
  } else {
    return axios(error.config)
  }
}
