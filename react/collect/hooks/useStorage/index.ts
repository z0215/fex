import type { Dispatch, SetStateAction } from 'react'
import type { StorageOptions } from './storage'
import { useState } from 'react'
import { isFunction, isUndefined } from '../../utils'
import { useEvent } from '../useEvent'
import { useMemoFn } from '../useMemoFn'
import { createStorage, storageSerializer } from './storage'

export interface UseStorageOptions extends Omit<StorageOptions, 'storage'> {
  listenToStorageChanges?: boolean
}

const createStorageHook = (storage: ReturnType<typeof createStorage>) => {
  const useStorage = <T>(key: string, options?: UseStorageOptions) => {
    const {
      listenToStorageChanges = true,
      ...restOptions
    } = options ?? {}

    const [value, setValue] = useState(() => storage.get<T>(key, restOptions))

    const updateValue = useMemoFn<Dispatch<SetStateAction<T | undefined>>>((newValue) => {
      const val = isFunction(newValue) ? newValue(value) : newValue
      if (isUndefined(val)) {
        storage.remove(key)
      }
      else {
        storage.set(key, val, restOptions)
      }
      setValue(val)
    })

    useEvent(window, 'storage', (e) => {
      if (!listenToStorageChanges)
        return

      if (
        e.storageArea !== localStorage
        || e.key !== key
        || e.newValue === value
        || !e.newValue) {
        return
      }

      const read = options?.serializer?.read ?? storageSerializer.object.read
      setValue(read(e.newValue))
    })
    return [value, updateValue] as const
  }

  return useStorage
}

export const storage = createStorage({ storage: localStorage })
/**
 * @example
 * const [value, setValue] = useSessionStorage<string>('test')
 *
 * // Add & Update
 * setValue('value')
 *
 * // Remove
 * setValue(undefined)
 */
export const useLocalStorage = createStorageHook(storage)

export const seStorage = createStorage({ storage: sessionStorage })
/**
 * @example
 * const [value, setValue] = useSessionStorage<string>('test')
 *
 * // Add & Update
 * setValue('value')
 *
 * // Remove
 * setValue(undefined)
 */
export const useSessionStorage = createStorageHook(seStorage)
