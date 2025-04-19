import { useRegisterSW } from 'virtual:pwa-register/react'

const useReloadPrompt = () => {
  const { modal } = AntdApp.useApp()
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW()

  useEffect(() => {
    if (!needRefresh)
      return

    modal.confirm({
      title: 'New version available!',
      content: `New version available, click on reload button to update.`,
      maskClosable: false,
      closable: false,
      okText: 'Reload',
      onOk() {
        updateServiceWorker(true)
      },
      onCancel() {
        setNeedRefresh(false)
      },
    })
  }, [modal, needRefresh, setNeedRefresh, updateServiceWorker])
}

export default useReloadPrompt
