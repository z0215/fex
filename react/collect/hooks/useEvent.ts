import type { AnyFunction } from '../types'
import type { Target } from './getTarget'
import { useEffect } from 'react'
import { getTarget } from './getTarget'
import { useMemoFn } from './useMemoFn'

export interface MyEvent {
  <E extends keyof WindowEventMap>(
    target: Target<Window>,
    event: E,
    listener: (this: Window, e: WindowEventMap[E]) => void,
    options?: boolean | AddEventListenerOptions,
  ): void
  <E extends keyof DocumentEventMap>(
    target: Target<Document>,
    event: E,
    listener: (this: Document, e: DocumentEventMap[E]) => void,
    options?: boolean | AddEventListenerOptions,
  ): void
  <E extends keyof HTMLElementEventMap>(
    target: Target<HTMLElement>,
    event: E,
    listener: (this: HTMLElement, e: HTMLElementEventMap[E]) => void,
    options?: boolean | AddEventListenerOptions,
  ): void
  <E extends keyof MediaQueryListEventMap>(
    target: Target<MediaQueryList>,
    event: E,
    listener: (this: MediaQueryList, e: MediaQueryListEventMap[E]) => void,
    options?: boolean | AddEventListenerOptions,
  ): void
  <EventType = Event>(
    target: Target<EventTarget>,
    event: string,
    listener: (e: EventType) => void,
    options?: boolean | AddEventListenerOptions,
  ): void
}

/**
 * @example
 * useEvent(document, 'click', (e) => console.log(e), options)
 *
 * useEvent(() => document.querySelector('.test'), 'click', (e) => console.log(e), options)
 *
 * const domRef = useRef<Element>(null)
 * useEvent(domRef, 'click', (e) => console.log(e), options)
 */
export const useEvent: MyEvent = <
  T extends Target<
    | Window
    | Document
    | HTMLElement
    | MediaQueryList
    | EventTarget
  >,
>(
  target: T,
  event: string,
  listener: AnyFunction,
  options?: boolean | AddEventListenerOptions,
) => {
  const listenerFn = useMemoFn(listener)
  useEffect(() => {
    const element = getTarget(target)
    element?.addEventListener(event, listenerFn, options)
    return () => {
      element?.removeEventListener(event, listenerFn, options)
    }
  }, [event])
}
