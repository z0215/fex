import { useMutation } from '@tanstack/react-query'
import { cloneElement, Fragment, isValidElement, type ReactElement, type ReactNode,type ReactDOMAttributes } from 'react'
import { isUndefined } from '../utils'


export interface AutoLoadingProps {
  children: ReactNode
  targgerEvent?: keyof Omit<ReactDOMAttributes<any>, 'children' | 'dangerouslySetInnerHTML'>
  LoadingComponent?: ReactNode
}

/**
 * @example
 *  <AutoLoading trigger="onClick">
 *    <Button onClick={async () => {
 *      await delay(3000)
 *    }}
 *    >
 *      Test
 *    </Button>
 *  </AutoLoading>
 *
 *  <AutoLoading>
 *    <Switch
 *      onChange={async () => {
 *        await delay(3000)
 *      }}
 *    />
 *  </AutoLoading>
 *
 *  <AutoLoading customLoading={() => <Icon type="Loading" />}>
 *    <Checkbox onChange={async () => {
 *      await delay(3000)
 *    }}
 *    >
 *      Test
 *    </Checkbox>
 *  </AutoLoading>
 *
 *  <AutoLoading
 *    customLoading={target => (
 *      <>
 *        {cloneElement(target, { children: undefined })}
 *        {' '}
 *        <Icon type="Loading" />
 *      </>
 *    )}
 *  >
 *    <Checkbox onChange={async () => {
 *      await delay(3000)
 *    }}
 *    >
 *      Test
 *    </Checkbox>
 *  </AutoLoading>
 */
export const AutoLoading = ({
  children, targgerEvent = 'onChange', LoadingComponent
}: AutoLoadingProps) => {
  const { isPending: loading, mutateAsync: asyncFn } = useMutation({
    mutationFn: async (...args: any) => {
      const child = isValidElement(children) && children.type !== Fragment ? children : undefined
      await child?.props?.[targgerEvent]?.(...args)
    },
  })
  const valided = isValidElement(children) && children.type !== Fragment

  if (!valided) {
    console.warn(`Child elements cannot be Fragments.`)
    return null
  }

  if (isValidElement(LoadingComponent) && loading)
    return cloneElement(LoadingComponent, { loading } as any)

  return cloneElement(children, {
    [targgerEvent]: asyncFn,
    loading,
  } as any)
}
