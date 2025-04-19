export type AnyFunction<P = any, R = any> = (...args: P[]) => R

export type FunctionType<T extends AnyFunction> = (...args: Parameters<T>) => ReturnType<T>

export type AnyObject = Record<string, any>

export type Nil = null | undefined

export type Maybe<T> = T | Nil

export type Undefineable<T> = T | undefined

export type Nullable<T> = T | null

export type Awaitable<T> = T | PromiseLike<T>

export type Arrayable<T> = T | Array<T>

export type ElementOf<T> = T extends (infer E)[] ? E : never

export type PromiseType<T> = T extends Promise<infer R> ? R : never

export type StringLiteralUnion<T extends string> = T | (string & {})

export type BanType<T, U> = T extends U ? never : T

export type Optianal<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

export type GetOptianal<T> = {
  [K in keyof T as T[K] extends Required<T>[K] ? never : K]: T[K]
}

export type GetRequired<T> = {
  [K in keyof T as T[K] extends Required<T>[K] ? K : never]: T[K]
}

export type UnionToIntersection<T> = (T extends any ? (x: T) => any : never) extends (x: infer R) => any ? R : never
