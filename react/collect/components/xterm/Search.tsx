import type { ISearchOptions, SearchAddon } from '@xterm/addon-search'
import type { Terminal } from '@xterm/xterm'
import type { InputRef } from 'antd'
import { Button, Input, Tooltip } from 'antd'
import { produce } from 'immer'
import { useEffect, useRef, useState } from 'react'
import { classNames, debounce, Icon, useEvent, useMemoFn } from '~/shared'
import ToggleIcon from './ToggleIcon'

export interface SearchProps {
  terminal?: Terminal
  searchAddon?: SearchAddon
}

export const Search = ({ terminal, searchAddon }: SearchProps) => {
  const searchInputRef = useRef<InputRef>(null)
  const [searchText, setSearchText] = useState('')
  const debouncedSetSearchText = useMemoFn(debounce(setSearchText))
  const [showSearchInput, setShowSearchInput] = useState(false)
  const [searchOptions, setSearchOptions] = useState<ISearchOptions>({
    regex: false,
    wholeWord: false,
    caseSensitive: false,
    incremental: true,
    decorations: {
      matchBackground: '#fadb14',
      matchOverviewRuler: '#ffffff',
      activeMatchColorOverviewRuler: '#ffffff',
      activeMatchBackground: '#eb2f96',
    },
  })
  const [searchResult, setSearchResult] = useState({ resultIndex: -1, resultCount: 0 })

  useEffect(() => {
    searchAddon?.onDidChangeResults(setSearchResult)
  }, [searchAddon])

  const closeSearchInput = useMemoFn(() => {
    if (!showSearchInput)
      return
    setSearchText('')
    const timer = setTimeout(() => {
      setShowSearchInput(false)
      terminal?.focus()
      clearTimeout(timer)
    })
  })
  const findNext = useMemoFn((value: string) => {
    if (!showSearchInput)
      return
    searchAddon?.findNext(value, searchOptions)
  })
  const findPrevious = useMemoFn((value: string) => {
    if (!showSearchInput)
      return
    searchAddon?.findPrevious(value, searchOptions)
  })
  const changeSearchOptions = useMemoFn(
    <T extends keyof ISearchOptions>(key: T, value: ISearchOptions[T]) => {
      setSearchOptions(
        produce((draft) => {
          draft[key] = value
        }),
      )
      findNext('')
      const timer = setTimeout(() => {
        findNext(searchText)
        clearTimeout(timer)
      })
    },
  )
  useEffect(() => {
    findNext(searchText)
  }, [findNext, searchText])
  useEvent(document, 'keydown', (e) => {
    const isActive = (e.ctrlKey || e.metaKey) && e.code === 'KeyF'
    if (!isActive)
      return
    if (terminal?.textarea !== document.activeElement)
      return
    e.preventDefault()
    setShowSearchInput(true)
    const timer = setTimeout(() => {
      searchInputRef.current?.focus()
      clearTimeout(timer)
    })
  })
  useEvent(document, 'keydown', (e) => {
    if (e.code !== 'Escape')
      return
    if (searchInputRef.current?.nativeElement !== document.activeElement)
      return
    e.preventDefault()
    closeSearchInput()
  })
  useEvent(document, 'keydown', (e) => {
    const isActive = (!e.shiftKey) && e.code === 'Enter'
    if (!isActive)
      return
    if (searchInputRef.current?.nativeElement !== document.activeElement)
      return
    e.preventDefault()
    findNext(searchText)
  })
  useEvent(document, 'keydown', (e) => {
    const isActive = e.shiftKey && e.code === 'Enter'
    if (!isActive)
      return
    if (searchInputRef.current?.nativeElement !== document.activeElement)
      return
    e.preventDefault()
    findPrevious(searchText)
  })
  return (
    <Input
      ref={searchInputRef}
      suffix={`${searchResult.resultIndex + 1}/${searchResult.resultCount}`}
      addonAfter={(
        <>
          <ToggleIcon
            title="Use Regular Expression"
            icon={<Icon type="Regex" />}
            checked={searchOptions.regex}
            onChange={(checked) => {
              changeSearchOptions('regex', checked)
            }}
          />
          <ToggleIcon
            title="Match Whole Word"
            icon={<Icon type="WholeWord" />}
            checked={searchOptions.wholeWord}
            onChange={(checked) => {
              changeSearchOptions('wholeWord', checked)
            }}
          />
          <ToggleIcon
            title="Match Case"
            icon={<Icon type="CaseSensitive" />}
            checked={searchOptions.caseSensitive}
            onChange={(checked) => {
              changeSearchOptions('caseSensitive', checked)
            }}
          />
          <Tooltip title="Next Match (Enter)">
            <Button
              icon={<Icon type="ArrowDown" />}
              type="text"
              size="small"
              disabled={!searchResult.resultCount}
              onClick={() => findNext(searchText)}
            />
          </Tooltip>
          <Tooltip title="Previous Match (⇧Enter)">
            <Button
              icon={<Icon type="ArrowUp" />}
              type="text"
              size="small"
              disabled={!searchResult.resultCount}
              onClick={() => findPrevious(searchText)}
            />
          </Tooltip>
          <Tooltip title="Close (Escape)">
            <Button
              icon={<Icon type="Close" />}
              type="text"
              size="small"
              onClick={closeSearchInput}
            />
          </Tooltip>
        </>
      )}
      placeholder="Search"
      value={searchText}
      onChange={e => debouncedSetSearchText(e.target.value)}
      className={classNames(
        'absolute right-20px top-20px z-999 w-350px bg-ant-base rounded-ms',
        showSearchInput ? 'block' : 'hidden',
      )}
    />
  )
}

export default Search
