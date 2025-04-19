export interface Serializer {
  read: (raw: string) => any
  write: (value: any) => string
}

export interface StorageOptions {
  namespace?: string
  /**
   * @default localStorage
   */
  storage?: Storage
  /**
   * @default
   * {
   *   read: v => JSON.parse(v),
   *   write: v => JSON.stringify(v),
   * }
   */
  serializer?: Serializer
  onError?: <E extends Error>(error: E) => void
}

export const storageSerializer = {
  boolean: {
    read: (v: string) => v === 'true',
    write: (v: boolean) => String(v),
  },
  object: {
    read: (v: string) => JSON.parse(v),
    write: (v: any) => JSON.stringify(v),
  },
  number: {
    read: (v: string) => Number.parseFloat(v),
    write: (v: number) => String(v),
  },
  string: {
    read: (v: string) => v,
    write: (v: string) => String(v),
  },
  date: {
    read: (v: string) => new Date(v),
    write: (v: Date) => v.toISOString(),
  },
  map: {
    read: (v: string) => new Map(JSON.parse(v)),
    write: (v: Map<any, any>) => JSON.stringify(Array.from((v).entries())),
  },
  set: {
    read: (v: string) => new Set(JSON.parse(v)),
    write: (v: Set<any>) => JSON.stringify(Array.from(v)),
  },
}

/**
 * @example
 * export const storage = createStorage({
 *  storage: localStorage,
 *  namespace: 'namespace',
 *  serializer: {
 *    read: v => JSON.parse(v),
 *    write: v => JSON.stringify(v),
 *  },
 *  onError(error) {
 *    console.log(error.message)
 *  },
 *})
 */
export const createStorage = (options?: StorageOptions) => {
  const {
    namespace,
    storage = localStorage,
    serializer = storageSerializer.object,
    onError,
  } = options ?? {}

  const getName = (key: string, useNamespace?: string) => {
    const prefix = useNamespace ?? namespace
    return prefix ? `[${prefix}]${key}` : key
  }

  return {
    get<T = any>(key: string, options?: Omit<StorageOptions, 'storage'>) {
      const read = options?.serializer?.read ?? serializer.read
      const raw = storage.getItem(getName(key, options?.namespace)) || ''
      try {
        return read(raw) as T
      }
      catch (e) {
        (options?.onError ?? onError)?.(e as Error)
      }
    },
    set<T>(key: string, value: T, options?: Omit<StorageOptions, 'storage'>) {
      const write = options?.serializer?.write ?? serializer.write
      try {
        storage.setItem(getName(key, options?.namespace), write(value))
      }
      catch (e) {
        (options?.onError ?? onError)?.(e as Error)
      }
    },
    remove(key: string, userNamespace?: string) {
      storage.removeItem(getName(key, userNamespace))
    },
    clear() {
      for (const i of Array.from({ length: storage.length }, (_, i) => i)) {
        const key = storage.key(i)
        if (!key?.startsWith(`[${namespace}]`))
          continue

        this.remove(key)
      }
    },
    clearAll() {
      storage.clear()
    },
  }
}
