import { useMount } from 'ahooks'
import { FC, ReactNode, useState } from 'react'
import { createPortal } from 'react-dom'

import { generateId } from '@modou/shared'

const ENTITY_MODULE_ACTION_PORTAL_ID = generateId()
export const EntityModuleActionWrapper: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [wrapperEl, setWrapperEl] = useState<HTMLElement | null>(null)

  useMount(() => {
    setTimeout(() => {
      setWrapperEl(document.getElementById(ENTITY_MODULE_ACTION_PORTAL_ID))
    })
  })
  return wrapperEl ? createPortal(children, wrapperEl) : null
}

export const EntityModuleActionPortal: FC = () => {
  return <span id={ENTITY_MODULE_ACTION_PORTAL_ID} />
}
