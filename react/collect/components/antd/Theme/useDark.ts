import { useState } from 'react'
import { useEvent } from '~/shared'

export const useDark = () => {
  const osDark = matchMedia('(prefers-color-scheme: dark)')
  const [dark, setDark] = useState(osDark.matches)
  useEvent(osDark, 'change', ({ matches }) => {
    setDark(matches)
  })
  return dark
}
