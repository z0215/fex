import type { FC } from 'react'
import type { RenderType } from '..'

export type ContentViewProps = RenderType

const ContentView: FC<ContentViewProps> = ({ renderType, value }) => {
  if (value === null || value === undefined) {
    return <AntdTypography.Text>N/A</AntdTypography.Text>
  }
  switch (renderType) {
    case 'text':
      // TODO: ellipsis+tooltips实现
      return <p className="truncate">{value}</p>
    case 'number':
      // TODO: ellipsis+tooltips实现
      return <p className="truncate">{value}</p>
    case 'link':
      // TODO: ellipsis+tooltips实现
      try {
        new URL(value)
        return (
          <AntdButton
            type="link"
            href={value}
            rel="noreferrer"
            className="w-auto! h-auto! leading-none! border-none! p-0!"
          >
            {value}
          </AntdButton>
        )
      } catch {
        return <AntdAlert message="Invalid URL" type="error" showIcon />
      }
    case 'boolean':
      return <AntdTag color={value ? 'success' : 'warning'}>{`${value}`}</AntdTag>
    case 'user':
      // TODO: 最大数量限制
      const userValues = Array.isArray(value.value) ? value.value : [value.value]
      return (
        <AntdAvatar.Group
          maxCount={3}
          maxStyle={{
            color: '#f56a00',
            backgroundColor: '#fde3cf',
          }}
        >
          {userValues
            .map((item) => {
              const current = value.options?.find((o) => o.value === item)
              return (
                <AntdTooltip key={current?.value || item} title={current?.label || item}>
                  {/* ?.at(0)?.toLocaleUpperCase() */}
                  <AntdAvatar>{current?.label || item}</AntdAvatar>
                </AntdTooltip>
              )
            })
            .filter(Boolean)}
        </AntdAvatar.Group>
      )
    case 'tag':
      // TODO: 最大数量限制
      const tagValues = Array.isArray(value.value) ? value.value : [value.value]
      return (
        <AntdSpace wrap>
          {tagValues
            .map((item) => {
              const current = value.options?.find((o) => o.value === item)
              return <AntdTag key={current?.value || item}>{current?.label || item}</AntdTag>
            })
            .filter(Boolean)}
        </AntdSpace>
      )
    case 'code':
      // TODO: 换一个更形象的图标
      return <CodeOutlined />
    default:
      return null
  }
}

export default ContentView
