import type {
  Component,
  ComponentType,
  Context,
  ReactNode,
  Ref,
  RefAttributes,
} from 'react'
import type { AnyObject } from '~/types'

export type GetContextProps<T> = T extends Context<infer P> ? P : never
export type GetContextProp<T extends Context<any>, PropName extends keyof GetContextProps<T> > = NonNullable<GetContextProps<T>[PropName]>
export type GetProp<T extends ComponentType | object, PropName extends keyof GetProps<T> > = NonNullable<GetProps<T>[PropName]>
export type GetProps<T extends ComponentType | object> = T extends ComponentType<infer P> ? P : T extends object ? T : never
  type RefComponent<Props extends { ref?: Ref<any> | string } = AnyObject> = (props: Props) => ReactNode
  type ExtractRef<T> = T extends RefAttributes<infer P> ? P : never
export type GetRef<T extends RefComponent | Component> = T extends Component ? T : T extends ComponentType<infer P> ? ExtractRef<P> : never
