import {
  App,
  Button,
  Checkbox,
  Flex,
  Typography,
} from 'antd'
import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Drawer } from '~/integrations'
import { thirdPartyList } from '~/main/router/hooks'

export interface MenuSettingsProps {
  thirdParty: string[]
  pinned: string[]
  onSave: (thirdParty: string[]) => void
}

const MenuSettings = ({
  thirdParty,
  onSave,
  pinned,
}: MenuSettingsProps) => {
  const { modal } = App.useApp()
  const { pathname } = useLocation()
  const [selectedThirdParty, setSelectedThirdParty] = useState<string[]>([])
  const [visibleMenuSetting, setVisibleMenuSetting] = useState(false)
  return (
    <>
      <Button icon={<i className="i-ic:outline-settings m-l-base" />} block onClick={() => setVisibleMenuSetting(true)}>Menu Settings</Button>
      <Drawer
        getContainer={document.querySelector('.content')!}
        placement="left"
        open={visibleMenuSetting}
        onClose={() => setVisibleMenuSetting(false)}
        extra={(
          <Button
            type="primary"
            onClick={() => {
              onSave(selectedThirdParty)
              setVisibleMenuSetting(false)
            }}
          >
            Save
          </Button>
        )}
        afterOpenChange={(open) => {
          if (open) {
            setSelectedThirdParty(thirdParty)
            return
          }
          setSelectedThirdParty([])
        }}
        rootClassName="absolute"
      >
        <Checkbox.Group
          value={selectedThirdParty}
          onChange={(checkedValue) => {
            const pinnedPath = pinned.find(p => !checkedValue.includes(p.replace(/^\//, '')))
            const pinnedItem = thirdPartyList.find(({ fullPath }) => fullPath === pinnedPath?.replace(/^\//, ''))
            if (!pinnedItem) {
              setSelectedThirdParty(checkedValue)
              return
            }
            modal.confirm({
              content: (
                <>
                  <Typography.Text strong>{pinnedItem.meta?.label}</Typography.Text>
                  {' '}
                  is pinned to the menu. Removing it will also remove the pinned menu. Are you sure you want to proceed?
                </>
              ),
              okText: 'Yes',
              cancelText: 'No',
              onOk() {
                setSelectedThirdParty(checkedValue)
              },
            })
          }}
        >
          {thirdPartyList.map(item => (
            <Flex key={item.path} className="w-180px">
              <Checkbox
                value={item.fullPath}
                disabled={item.meta?.enable || item.fullPath === pathname.replace(/^\//, '')}
              >
                {item.meta?.label}
                {pinned.includes(`/${item.fullPath}`) && <i className="i-ic:outline-push-pin m-l-xxs text-primary text-14px!" />}
              </Checkbox>
            </Flex>
          ))}
        </Checkbox.Group>
      </Drawer>
    </>
  )
}

export default MenuSettings
