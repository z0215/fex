import type { CSSProperties } from 'react'
import type { StringLiteralUnion } from '~/shared'
import { classNames } from '~/shared'

const map = {
  Delete: 'i-ic:outline-delete',
  Edit: 'i-ic:outline-mode-edit',
  Detail: 'i-ic:baseline-format-list-bulleted',
  Save: 'i-ic:outline-save',
  Add: 'i-ic:baseline-plus',
  Refresh: 'i-ic:outline-refresh',
  ExternalLink: 'i-ic:baseline-launch',
  More: 'i-ic:baseline-more-horiz',
  Help: 'i-ic:outline-help-outline',
  Check: 'i-ic:baseline-check',
  Close: 'i-ic:baseline-close',
  Lock: 'i-ic:outline-lock',
  Phone: 'i-ic:round-phone-iphone',
  User: 'i-ic:sharp-person',
  Pin: 'i-ic:outline-push-pin',
  Settings: 'i-ic:outline-settings',
  Search: 'i-ic:outline-search',
  Palette: 'i-ic:outline-palette',
  Size: 'i-ic:baseline-format-size',
  ArrowDown: 'i-codicon:arrow-down',
  ArrowUp: 'i-codicon:arrow-up',
  Regex: 'i-codicon:regex',
  WholeWord: 'i-codicon:whole-word',
  CaseSensitive: 'i-codicon:case-sensitive',
  Loading: 'i-line-md:loading-loop',
}

export type IconType = keyof typeof map

export interface IconProps {
  type: StringLiteralUnion<IconType>
  className?: string
  style?: CSSProperties
}

export const Icon = ({ type, className, style }: IconProps) => <i className={classNames(map[type as IconType] ?? type, className)} style={style} />
