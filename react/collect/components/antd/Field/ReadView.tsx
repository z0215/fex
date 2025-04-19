import type { FieldType } from '.'

export type ReadViewProps = FieldType

const ReadView: BFC<ReadViewProps> = ({ type, value }) => {
  const [width, setWidth] = useState<number>()
  const typographyRef = useRef<HTMLDivElement>(null)
  useResizeObserver(typographyRef, (e) => {
    const { width } = e.target.getBoundingClientRect()
    setWidth(width)
  })

  if (value === null || value === undefined)
    return 'N/A'

  if (type === 'text')
    return <AntdTypography.Paragraph ref={typographyRef} ellipsis={{ tooltip: value }} className="m-0px!" style={{ width }}>{value}</AntdTypography.Paragraph>

  if (type === 'link')
    return <AntdTypography.Link rel="noreferrer" target="_blank" href={value} ellipsis>{value}</AntdTypography.Link>

  if (type === 'number')
    return <AntdTypography.Text strong ellipsis={{ tooltip: value }}>{value}</AntdTypography.Text>

  if (type === 'boolean')
    return <AntdTag color={value ? 'success' : 'warning'}>{`${value}`}</AntdTag>

  return null
}

export default ReadView
