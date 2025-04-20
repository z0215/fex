import type { PanelProps } from 'antd/es/splitter/interface'
import { useMemo } from 'react'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { useMemoFn } from '~/shared'

const DEFAULT_HEIGHT = 64

const useHeaderStore = create(
  persist<{ height: number }>(
    () => ({ height: DEFAULT_HEIGHT }),
    { name: 'header' },
  ),
)

export const useHeader = () => {
  const { height } = useHeaderStore()
  const setHeight = useMemoFn((height: number) => useHeaderStore.setState({ height }))
  const toggle = useMemoFn(() => setHeight(height ? 0 : DEFAULT_HEIGHT))
  const setAction = Object.assign(setHeight, {
    toggle,
    set: setHeight,
  })
  return [height, setAction] as const
}

export const useHeaderPanel = () => {
  const [height, setHeader] = useHeader()
  const onResize = useMemoFn(([size]: number[]) => setHeader(size))
  const max = useMemo(() => height ? DEFAULT_HEIGHT : DEFAULT_HEIGHT * 2 + DEFAULT_HEIGHT, [height])
  const panelProps = useMemo<PanelProps>(() => ({
    size: height,
    min: DEFAULT_HEIGHT,
    max,
    collapsible: true,
  }), [height, max])
  return [onResize, panelProps] as const
}
