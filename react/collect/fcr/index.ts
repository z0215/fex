import { render as reactRender, unmount as reactUnmount } from 'rc-util/lib/React/render'
import type { ReactElement } from 'react'
import { QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom'

export const fcr = (node: ReactElement) => {
  const container = document.createDocumentFragment()

  const queryClient = new QueryClient()

  const render = (open: boolean) => {
    const children = createElement(node.type, {
      ...node.props,
      open,
      onCancel() {
        render(false)
      },
      onClose() {
        render(false)
      },
      afterOpenChange: (visible: boolean) => {
        if (visible) {
          return
        }
        reactUnmount(container)
      },
    })

    const wrapper = createElement(
      QueryClientProvider,
      {
        client: queryClient,
      },
      createElement(BrowserRouter, null, children)
    )
    reactRender(wrapper, container)
  }

  render(true)
}
