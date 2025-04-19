import { isUndefined } from '../core'

/**
 * @example
 * const flip = new Flip(ele)
 * flip.setFirstState(new DOMRect(
 *   +searchParams.get('x')!,
 *   +searchParams.get('y')!,
 *   +searchParams.get('width')!,
 *   +searchParams.get('height')!,
 * ))
 * flip.setLastState(ele.getBoundingClientRect())
 * flip.run()
 */
export class Flip {
  private el: HTMLElement
  private firstInfo: DOMRect | undefined
  private lastInfo: DOMRect | undefined
  private rafId: number | undefined

  constructor(el: HTMLElement) {
    this.el = el
  }

  setFirstState(info: DOMRect) {
    this.firstInfo = info
  }

  setLastState(info: DOMRect) {
    this.lastInfo = info
  }

  run(callback?: (info: { first: DOMRect, last: DOMRect }) => Parameters<HTMLElement['animate']> | false) {
    const first = this.firstInfo
    const last = this.lastInfo
    if (isUndefined(first)) {
      throw new Error('Please call the setFirsState function setting state data')
    }
    if (isUndefined(last)) {
      throw new Error('Please call the setLastState function setting state data')
    }

    const defaultAnimateArgs: Parameters<HTMLElement['animate']> = [
      [
        {
          transform: `translate(${first.x - last.x}px, ${first.y - last.y}px)`,
          width: `${first.width}px`,
          height: `${first.height}px`,
        },
        {
          transform: 'translate(0, 0)',
          width: `${last.width}px`,
          height: `${last.height}px`,
        },
      ],
      300,
    ]
    this.el.getAnimations().forEach(animation => animation.cancel())
    const animateArgs = callback?.({ first, last }) ?? defaultAnimateArgs
    this.rafId = requestAnimationFrame(() => {
      if (animateArgs === false) {
        return
      }
      this.el.animate(...animateArgs)
    })
  }

  cancel() {
    if (isUndefined(this.rafId))
      return

    cancelAnimationFrame(this.rafId)
  }
}
