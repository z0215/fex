import type { SetStateAction } from 'react'
import { useEffect, useRef, useState } from 'react'
import { isFunction, isUndefined } from '../../utils'
import { useMemoFn } from '../useMemoFn'
import { createDB } from './db'

type AsyncDispatch<A> = (value: A) => Promise<void>

/**
 * @example
 * const [value, setValue] = useIndexedDB<string>('test')
 *
 * // Add & Update
 * setValue('value')
 *
 * // Remove
 * setValue(undefined)
 */
export const useIndexedDB = <T>(key: string, ...args: Parameters<typeof createDB>) => {
  const dbRef = useRef<ReturnType<typeof createDB>>()
  const [value, setValue] = useState<T | undefined>()

  useEffect(() => {
    const db = dbRef.current = createDB(...args)
    db.get<T>(key).then((res) => {
      setValue(res)
    })
    return () => db.dispose()
  }, [args, key])

  const updateValue = useMemoFn<AsyncDispatch<SetStateAction<T | undefined>>>(async (newValue) => {
    const val = isFunction(newValue) ? newValue(value) : newValue
    if (isUndefined(val)) {
      await dbRef.current?.remove(key)
    }
    else {
      await dbRef.current?.set(key, val)
    }
    setValue(val)
  })

  return [value, updateValue] as const
}
