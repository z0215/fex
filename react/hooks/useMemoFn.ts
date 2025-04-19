import type { AnyFunction } from '~/types'

type MemoFunction<T extends AnyFunction> = (
  this: ThisParameterType<T>,
  ...args: Parameters<T>
) => ReturnType<T>

/**
 * @example
 * useMemoFn(() => {})
 */
export const useMemoFn = <T extends AnyFunction>(fn?: T) => {
  const fnRef = useRef(fn)
  fnRef.current = useMemo(() => fn, [fn])
  const memoizedFn = useRef<MemoFunction<T>>(null)
  if (!memoizedFn.current) {
    memoizedFn.current = function (this, ...args) {
      return fnRef.current?.apply(this, args)
    }
  }
  return memoizedFn.current
}
