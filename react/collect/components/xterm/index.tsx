import { CanvasAddon } from '@xterm/addon-canvas'
import { FitAddon } from '@xterm/addon-fit'
import { SearchAddon } from '@xterm/addon-search'
import { WebLinksAddon } from '@xterm/addon-web-links'
import { WebglAddon } from '@xterm/addon-webgl'
import { type ITerminalInitOnlyOptions, type ITerminalOptions, Terminal as Xterm } from '@xterm/xterm'
import { theme } from 'antd'
import { type CSSProperties, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { classNames, useResizeObserver } from '~/shared'
import Search from './Search'
import '@xterm/xterm/css/xterm.css'

const supportWebgl = () => {
  try {
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('webgl2')
    return Boolean(context)
  }
  catch {
    return false
  }
}

export interface TerminalProps extends ITerminalOptions, ITerminalInitOnlyOptions {
  onMount?: (terminal: Xterm) => void
  className?: string
  style?: CSSProperties
}

export const Terminal = ({ onMount, className, style, ...options }: TerminalProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [terminal, setTerminal] = useState<Xterm>()
  const fitAddonRef = useRef<FitAddon>()
  const [searchAddon, setSearchAddon] = useState<SearchAddon>()

  useEffect(() => {
    if (!containerRef.current)
      return

    const terminal = new Xterm()
    setTerminal(terminal)
    terminal.loadAddon(new WebLinksAddon())
    const fitAddon = (fitAddonRef.current = new FitAddon())
    terminal.loadAddon(fitAddon)
    const searchAddon = new SearchAddon()
    setSearchAddon(searchAddon)
    terminal.loadAddon(searchAddon)
    if (supportWebgl()) {
      const webglAddon = new WebglAddon(true)
      webglAddon.onContextLoss(webglAddon.dispose)
      terminal.loadAddon(webglAddon)
    }
    else {
      terminal.loadAddon(new CanvasAddon())
    }
    terminal.open(containerRef.current)

    onMount?.(terminal)

    terminal.clear()
    terminal.writeln('git to use xxx')
    terminal.writeln('main to use xxx')
    terminal.writeln('test to use xxx')
    terminal.writeln('branch to use xxx')
    terminal.writeln('Welcome to use xxx')
    terminal.focus()

    terminal.onData(value => terminal.write(value))

    return () => terminal.dispose()
  }, [])

  const { token } = theme.useToken()
  useLayoutEffect(() => {
    if (!terminal)
      return

    terminal.options = {
      cursorBlink: true,
      convertEol: true,
      disableStdin: true,
      scrollback: 30000,
      allowProposedApi: true,
      theme: {
        foreground: token.colorTextBase,
        background: token.colorBgLayout,
        cursor: token.colorTextBase,
        cursorAccent: token.colorTextBase,
        selectionBackground: token.colorPrimary,
        selectionForeground: token.colorTextBase,
      },
      ...options,
    }
  }, [token, options])

  useResizeObserver({
    target: containerRef,
    onChange: () => fitAddonRef.current?.fit(),
  })

  return (
    <div className={classNames(className, 'relative')} style={style}>
      <Search terminal={terminal} searchAddon={searchAddon} />
      <div ref={containerRef} className="h-full w-full" />
    </div>
  )
}
