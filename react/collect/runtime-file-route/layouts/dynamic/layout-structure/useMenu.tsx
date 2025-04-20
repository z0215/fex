import type { MenuProps } from 'antd'
import { Tooltip } from 'antd'
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import type { MenuItem } from './useRouteMenus'
import { useRouteMenus } from './useRouteMenus'
import { classNames, clone, sort, useLocalStorage, useMemoFn } from '~/shared'

const useOpenKeys = (items: MenuItem[], selectedKey: string, defaultUserOpenKeys?: string[]) => {
  const getParentPaths = useMemoFn((items: MenuItem[], targetPath: string) => {
    const helper = (
      routes: MenuItem[],
      targetPath: string,
      currentPathStack: string[],
    ): string[] | null => {
      for (const route of routes) {
        const newStack = [...currentPathStack, route.key]
        if (route.key === targetPath) {
          return currentPathStack
        }

        if (route.children) {
          const result = helper(route.children, targetPath, newStack)
          if (result) {
            return result
          }
        }
      }
      return null
    }
    return helper(items, targetPath, []) ?? []
  })

  const defaultOpenKeys = useMemo(
    () => getParentPaths(items, selectedKey),
    [selectedKey, items, getParentPaths],
  )

  return useState(defaultOpenKeys.concat(defaultUserOpenKeys ?? []))
}

const useSortPinned = (pinned: string[], callback: (payload: { sourceIndex: number, targetIndex: number }) => void) => {
  const getParentElement = useMemoFn((node: HTMLElement | undefined | null): HTMLElement | null => {
    if (node?.classList.contains('ant-menu-item'))
      return node
    return node?.parentElement ? getParentElement(node?.parentElement) : null
  })
  useEffect(() => {
    const menuNode = document.querySelector<HTMLUListElement>('.route-menu')
    let sourceIndex: number | undefined
    let prevNode: HTMLElement | undefined
    menuNode?.addEventListener('dragstart', (e) => {
      const target = e.target as HTMLLIElement
      if (e.dataTransfer) {
        e.dataTransfer.effectAllowed = 'move'
      }
      const sourceId = target.dataset.sortKey
      if (!sourceId)
        return
      sourceIndex = pinned.findIndex(p => p === `/${sourceId}`)
    })
    menuNode?.addEventListener('dragover', (e) => {
      e.preventDefault()
    })
    menuNode?.addEventListener('dragenter', (e) => {
      const target = e.target as HTMLLIElement
      if (!target.classList.contains('sort-item'))
        return

      prevNode?.classList.remove('drag-in')

      const parentNode = getParentElement(target)
      if (!parentNode)
        return

      parentNode.classList.add('drag-in')
      prevNode = parentNode
    })
    menuNode?.addEventListener('drop', (e) => {
      const target = e.target as HTMLLIElement
      const targetId = getParentElement(target)?.dataset.sortKey
      if (!targetId || sourceIndex === undefined)
        return
      const targetIndex = pinned.findIndex(p => p === `/${targetId}`)
      if (sourceIndex === -1 || targetIndex === -1)
        return
      callback({ sourceIndex, targetIndex })
      prevNode?.classList.remove('drag-in')
    })
  }, [pinned])
}

export const useMenu = () => {
  const [pinned = [], setPinned] = useLocalStorage<string[]>('pinned-menu')
  const { selectedKey, ...menuProps } = useRouteMenus({
    icon: icon => <i className={icon} />,
    label: ({ key, label, leaf }) => leaf
      ? <Link to={key} className="sort-item truncate" draggable="false">{label}</Link>
      : (
          <span className="ant-menu-title-content">
            <span className="truncate">
              {label}
            </span>
          </span>
        ),
    extra: ({ hover, key }) => {
      const includes = pinned.includes(key)
      return hover && (
        <Tooltip title={includes ? 'Unpin' : 'Pin'}>
          <i
            className={classNames(' cursor-pointer', includes ? 'i-ic:outline-pin-off' : 'i-ic:outline-push-pin')}
            onClick={() => {
              const index = pinned.findIndex(i => i === key)
              if (index !== -1) {
                const newPinned = [...pinned]
                newPinned.splice(index, 1)
                setPinned(newPinned)
              }
              else {
                setPinned(pinned.concat(key))
              }
            }}
          />
        </Tooltip>
      )
    },
  })

  const groupItems = useMemoFn((originItems: MenuItem[], pinned: string[]) => {
    const pinnedItems: MenuItem[] = []
    const filterItems = (items: MenuItem[]): MenuItem[] => {
      return items
        .map<MenuItem | null>((route) => {
          const newRoute: MenuItem = { ...route }
          if (newRoute.children) {
            newRoute.children = filterItems(newRoute.children)
          }
          const isPinned = pinned.includes(`/${newRoute.key}`)
          if (isPinned) {
            pinnedItems.push(newRoute)
          }
          return !isPinned || newRoute.children?.length
            ? newRoute
            : null
        })
        .filter(Boolean) as MenuItem[]
    }

    return {
      items: filterItems(originItems),
      pinnedItems: sort(pinnedItems, item => pinned.findIndex(p => p === `/${item.key}`)),
    }
  })

  const items = useMemo<MenuProps['items']>(() => {
    if (pinned.length) {
      const { items, pinnedItems } = groupItems(menuProps.items as MenuItem[], pinned)
      return [
        {
          key: 'pinned',
          icon: <i className="i-ic:outline-push-pin" />,
          label: `Pinned`,
          children: pinnedItems.map(i => ({ ...i, 'data-sort-key': i.key, 'draggable': true })),
        },
        ...items,
      ]
    }
    return menuProps.items
  }, [groupItems, menuProps.items, pinned])

  useSortPinned(pinned, ({ sourceIndex, targetIndex }) => {
    const source = pinned[sourceIndex]
    const newPinned = clone(pinned)
    newPinned.splice(sourceIndex, 1)
    newPinned.splice(targetIndex, 0, source)
    setPinned(newPinned)
    /**
     * Swap
     * ;[newPinned[sourceIndex], newPinned[targetIndex]] = [newPinned[targetIndex], newPinned[sourceIndex]]
     */
  })

  const _setThirdParty = useMemoFn((data: string[]) => {
    const index = pinned.findIndex(p => !data.includes(p.replace(/^\//, '')))
    if (index !== -1) {
      const newPinned = [...pinned]
      newPinned.splice(index, 1)
      setPinned(newPinned)
    }
    menuProps.setThirdParty(data)
  })

  const [openKeys, setOpenKeys] = useOpenKeys(items as MenuItem[], selectedKey, ['pinned'])

  return useMemo(
    () => ({
      ...menuProps,
      items,
      setThirdParty: _setThirdParty,
      pinned,
      selectedKeys: [selectedKey],
      openKeys,
      onOpenChange: setOpenKeys,
    }),
    [
      menuProps,
      items,
      _setThirdParty,
      pinned,
      selectedKey,
      openKeys,
      setOpenKeys,
    ],
  )
}
