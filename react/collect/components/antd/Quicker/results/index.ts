import { useActions } from './actions'
import { useMenus } from './menus'
import { useThemes } from './themes'

export const useResults = () => {
  const actions = useActions()
  const menus = useMenus()
  const themes = useThemes()

  return [
    ...actions,
    ...menus,
    ...themes,
  ]
}
