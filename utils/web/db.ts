export interface DBInit {
  /**
   * @default 'default_db'
   */
  name?: string
  version?: number
}

export interface StoreInit {
  /**
   * @default 'default_store'
   */
  name?: string
  options?: IDBObjectStoreParameters
}

const DEFAULT_DB_NAME = 'default_db'

const DEFAULT_STORE_NAME = 'default_store'

/**
 * @example
 * const db = createDB(
 *  {
 *    name: 'default_db',
 *    version: 1,
 *  },
 *  {
 *    name: 'default_store',
 *  },
 *)
 */
export const createDB = (
  dbInit?: DBInit,
  storeInit?: StoreInit,
  onError?: (error: Event) => void,
) => {
  const request = indexedDB.open(dbInit?.name ?? DEFAULT_DB_NAME, dbInit?.version)
  const storeName = storeInit?.name ?? DEFAULT_STORE_NAME

  const { promise, resolve } = Promise.withResolvers<IDBDatabase>()
  const controller = new AbortController()
  const { signal } = controller

  request.addEventListener('error', (e) => {
    onError?.(e)
  }, { signal })

  request.addEventListener('success', () => {
    resolve(request.result)
  }, { signal })

  request.addEventListener('upgradeneeded', () => {
    const db = request.result
    if (db.objectStoreNames.contains(storeName))
      return
    db.createObjectStore(storeName, storeInit?.options)
  }, { signal })

  return {
    get dbName() {
      return DEFAULT_DB_NAME
    },
    get storeName() {
      return DEFAULT_STORE_NAME
    },
    get db() {
      return promise
    },
    async get<T = any>(query: IDBValidKey | IDBKeyRange) {
      const db = await this.db
      const store = db.transaction(storeName, 'readonly').objectStore(storeName)
      const getRequest = store.get(query)

      return new Promise<T>((resolve) => {
        getRequest.addEventListener('error', (e) => {
          onError?.(e)
        }, { signal })
        getRequest.addEventListener('success', () => {
          resolve(getRequest.result)
        }, { signal })
      })
    },
    async set(key: IDBValidKey, value: any) {
      const db = await this.db
      const store = db.transaction(storeName, 'readwrite').objectStore(storeName)
      const setRequest = store.put(value, key)
      return new Promise<void>((resolve) => {
        setRequest.addEventListener('error', (e) => {
          onError?.(e)
        }, { signal })
        setRequest.addEventListener('success', () => {
          resolve()
        }, { signal })
      })
    },
    async remove(query: IDBValidKey | IDBKeyRange) {
      const db = await this.db
      const store = db.transaction(storeName, 'readwrite').objectStore(storeName)
      const deleteRequest = store.delete(query)
      return new Promise<void>((resolve) => {
        deleteRequest.addEventListener('error', (e) => {
          onError?.(e)
        }, { signal })
        deleteRequest.addEventListener('success', () => {
          resolve()
        }, { signal })
      })
    },
    async clear() {
      const db = await this.db
      const store = db.transaction(storeName, 'readwrite').objectStore(storeName)
      const clearRequest = store.clear()
      return new Promise<void>((resolve) => {
        clearRequest.addEventListener('error', (e) => {
          onError?.(e)
        }, { signal })
        clearRequest.addEventListener('success', () => {
          resolve()
        }, { signal })
      })
    },
    dispose() {
      controller.abort()
      this.db.then(res => res.close())
    },
  }
}
