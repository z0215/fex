import type { InputRef } from 'antd'
import type { KeyboardEvent, KeyboardEventHandler, MouseEvent } from 'react'
import { useMutation } from '@tanstack/react-query'
import { Flex, Input, Modal, Skeleton, theme } from 'antd'
import { useEffect, useMemo, useRef, useState } from 'react'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { classNames, delay, isUndefined, useEvent, useMemoFn } from '~/shared'
import { useResults } from './results'

export interface QuickerResultItem {
  icon?: string
  label: string
  key: string
  keys?: string[]
  tag?: string
  action?: (item: Omit<QuickerResultItem, 'action'> & { e: MouseEvent<HTMLElement> | KeyboardEvent<HTMLInputElement> }, index: number) => void
}

const useVisible = () => {
  const [visible, setVisible] = useState(false)
  const show = useMemoFn(() => setVisible(true))
  const hidden = useMemoFn(() => setVisible(false))
  useEvent(document, 'keydown', (e) => {
    const match = e.metaKey && e.code === 'KeyK'
    if (!match)
      return
    show()
  })

  return { visible, show, hidden }
}

const useAutoFocus = () => {
  const { token } = theme.useToken()
  const refCallback = useMemoFn((input: InputRef | null) => {
    const timerId = setTimeout(() => {
      clearTimeout(timerId)
      input?.focus()
    }, Number.parseFloat(token.motionDurationSlow) * 1000)
  })

  return refCallback
}

const useActive = (results: QuickerResultItem[]) => {
  const [active, setActive] = useState(-1)

  useEffect(() => {
    if (!results.length)
      return
    setActive(0)
  }, [results])

  const resetActive = useMemoFn(() => setActive(-1))

  const updateActive = useMemoFn<KeyboardEventHandler<HTMLInputElement>>((e) => {
    if (e.code === 'ArrowUp') {
      e.preventDefault()
      setActive((prev) => {
        if (prev <= 0)
          return results.length - 1
        return prev - 1
      })
      return
    }
    if (e.code === 'ArrowDown') {
      e.preventDefault()
      setActive((prev) => {
        if (prev >= results.length - 1)
          return 0
        return prev + 1
      })
    }
  })

  return { active, resetActive, updateActive }
}

const useScroll = (active: number) => {
  const itemRefs = useRef<Array<HTMLElement | null>>([])
  useEffect(() => {
    if (!itemRefs.current[active])
      return
    itemRefs.current[active].scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
    })
  }, [active])

  return itemRefs
}

const useResultsStore = create(
  persist<{ results: QuickerResultItem[] }>(
    () => ({ results: [] }),
    { name: 'quickerResults' },
  ),
)

const useRemoteResults = () => {
  const { results } = useResultsStore()
  const { mutateAsync, isPending, data } = useMutation({
    mutationKey: ['useRemoteResult'],
    mutationFn: async (value: string): Promise<QuickerResultItem[]> => {
      await delay(1000)
      return [
        {
          label: value,
          key: '1',
          tag: 'Remote',
          keys: ['Remote'],
        },
      ]
    },
  })

  const remoteResults = useMemo(() => {
    if (!data)
      return []

    return data.map(item => ({
      ...item,
      action() {
        // eslint-disable-next-line no-console
        console.log('custom remote action')
        const index = results.findIndex(r => r.key === item.key)
        if (index !== -1) {
          const newResults = [...results]
          newResults.splice(index, 1)
          useResultsStore.setState({ results: [item, ...newResults].slice(0, 20) })
        }
        else {
          useResultsStore.setState({ results: [item, ...results].slice(0, 20) })
        }
      },
    }))
  }, [data])

  return {
    getResults: mutateAsync,
    loading: isPending,
    remoteResults,
  }
}

const useLocalResults = () => {
  const { results: localResults } = useResultsStore()
  const results = useResults()
  return useMemo(
    () => localResults.map<QuickerResultItem>(item => ({
      ...item,
      action() {
        // eslint-disable-next-line no-console
        console.log('custom remote action')
      },
    }),
    ).concat(results),
    [localResults, results],
  )
}

const useFilterResults = (value: string, ...results: Array<QuickerResultItem[]>) => {
  return useMemo(() => {
    if (!value)
      return []

    return results
      .flat()
      .filter(i => !isUndefined(i))
      .filter((item) => {
        const text = value.trim().toLowerCase()
        const matchLabel = item.label.toLowerCase().includes(text)
        const matchKeys = item.keys?.some(key => key.toLowerCase().includes(text))
        return matchLabel || matchKeys
      })
  }, [JSON.stringify(results), value])
}

export const Quicker = () => {
  const { visible, hidden } = useVisible()
  const autoFocus = useAutoFocus()
  const [value, setValue] = useState('')
  const localResults = useLocalResults()
  const { getResults, loading, remoteResults } = useRemoteResults()
  const results = useFilterResults(value, localResults, remoteResults)
  const { active, resetActive, updateActive } = useActive(results)
  const itemRefs = useScroll(active)
  const [visibleShadow, setVisibleShadow] = useState(false)
  const { token } = theme.useToken()

  return (
    <Modal
      open={visible}
      onCancel={hidden}
      footer={null}
      closable={false}
      mask={false}
      afterClose={() => {
        setValue('')
        resetActive()
      }}
      classNames={{
        header: 'hidden',
        content: 'p-none!',
      }}
      className="p-none"
    >
      <Input
        ref={autoFocus}
        value={value}
        onChange={({ target }) => setValue(target.value)}
        placeholder="Search"
        variant="borderless"
        className="p-sm"
        onKeyDown={(e) => {
          updateActive(e)
          if (e.code !== 'Enter')
            return

          e.preventDefault()
          if (results.length) {
            const current = results.at(active)
            if (!current)
              return

            const { action, ...item } = current
            action?.({ ...item, e }, active)
            hidden()
            return
          }

          if (!value)
            return

          getResults(value)
        }}
      />

      <div
        className="border-b-1px border-b-border-secondary border-b-solid"
        style={{
          boxShadow: visibleShadow ? 'rgba(0, 0, 0, 0.3) 0px 3px 8px' : 'unset',
          borderColor: loading || results.length ? token.colorBorderSecondary : 'transparent',
        }}
      />

      <Skeleton
        active
        loading={loading}
        className="p-sm"
      >
        {results.length
          ? (
              <div
                onScroll={({ target }) => setVisibleShadow(!!(target as HTMLDivElement).scrollTop)}
                className="max-h-300px overflow-y-auto p-x-xxs p-y-xxs no-scroll-bar"
              >
                {results.map(({ label, key, keys, icon, tag, action }, index) => (
                  <Flex
                    ref={el => (itemRefs.current[index] = el)}
                    key={key}
                    justify="space-between"
                    align="center"
                    gap={token.marginXS}
                    onClick={(e) => {
                      action?.({ label, key, keys, icon, tag, e }, index)
                      hidden()
                    }}
                    className={
                      classNames(
                        'cursor-pointer rounded-base p-x-xs p-y-xxs hover:bg-bg-text-hover',
                        { 'bg-text-active': active === index },
                      )
                    }
                  >
                    <Flex align="center" gap={token.marginXS}>
                      {icon && <i className={icon} />}
                      {label}
                    </Flex>

                    <div>{tag}</div>
                  </Flex>
                ))}
              </div>
            )
          : null}
      </Skeleton>
    </Modal>
  )
}
