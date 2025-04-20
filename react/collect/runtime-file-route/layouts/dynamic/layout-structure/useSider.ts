import type { PanelProps } from 'antd/es/splitter/interface'
import { useMemo } from 'react'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { useMemoFn } from '~/shared'

const DEFAULT_WIDTH = 260

const useSiderStore = create(
  persist<{ width: number, lastWidth: number }>(
    () => ({
      width: DEFAULT_WIDTH,
      lastWidth: DEFAULT_WIDTH,
    }),
    { name: 'sider' },
  ),
)

export const useSider = () => {
  const store = useSiderStore()
  const setWidth = useMemoFn((width: number) => {
    if (!width) {
      useSiderStore.setState({ lastWidth: store.width })
    }
    useSiderStore.setState({ width })
  })
  const toggle = useMemoFn(() => setWidth(store.width ? 0 : store.lastWidth))
  const setAction = Object.assign(setWidth, {
    toggle,
    set: setWidth,
  })
  return [store, setAction] as const
}

export interface UseSiderPanelOptions {
  min?: number
  max?: number
}

export const useSiderPanel = (options?: UseSiderPanelOptions) => {
  const { min = 80, max = 480 } = options ?? {}
  const [{ width, lastWidth }, setWidth] = useSider()
  const onResize = useMemoFn(([size]: number[]) => setWidth(size))
  /**
   * The calculation formula for the value when expanded:
   * (max - min) / 2 = lastWidth
   */
  const computedMax = useMemo(() => width ? max : lastWidth * 2 + min, [width, max, lastWidth, min])
  const panelProps = useMemo<PanelProps>(() => ({
    size: width,
    min,
    max: computedMax,
    collapsible: true,
  }), [computedMax, min, width])
  return [onResize, panelProps] as const
}
