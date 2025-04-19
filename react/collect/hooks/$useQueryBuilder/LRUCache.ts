class LRUCache<T = any> {
  private capacity: number
  private cache: typeof $localStorage
  private cacheKey = 'LRU'

  constructor(capacity = 6) {
    this.capacity = capacity
    this.cache = $localStorage
  }

  get() {
    return this.cache.get<T[]>(this.cacheKey)
  }

  put(value: T) {
    const list = this.get() ?? []
    const index = list.findIndex(item => _isEqual(item, value))
    if (index > -1) {
      list.splice(index, 1)
      list.unshift(value)
    }
    else {
      list.unshift(value)
    }
    if (list.length > this.capacity) {
      list.pop()
    }
    this.cache.set(this.cacheKey, list)
  }
}

export default LRUCache
