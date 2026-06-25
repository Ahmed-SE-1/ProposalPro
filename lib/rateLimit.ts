const MAX_CONCURRENT = 10
let activeRequests = 0
const queue: (() => void)[] = []

function processQueue() {
  if (queue.length === 0 || activeRequests >= MAX_CONCURRENT) return

  const next = queue.shift()
  if (next) {
    activeRequests++
    next()
  }
}

export function addToQueue<T>(fn: () => Promise<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    const task = async () => {
      try {
        const result = await fn()
        resolve(result)
      } catch (err) {
        reject(err)
      } finally {
        activeRequests--
        processQueue()
      }
    }

    queue.push(task)
    processQueue()
  })
}