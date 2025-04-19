import type { ITab } from '../type'
import { FormItems } from '../index'

const Tab: React.FC<ITab> = ({ options, name }) => {
  const { children = [], ...rest } = options ?? {}
  return (
    <AntdTabs {...rest}>
      {children?.map((cv, index) => {
        return (
          <AntdTabs.TabPane forceRender tab={cv.title} key={`${cv.title}-${index}`}>
            <FormItems dsl={cv.children} extraName={name ? _castArray(name) : undefined} />
          </AntdTabs.TabPane>
        )
      })}
    </AntdTabs>
  )
}

export default Tab
