import { useState } from 'react'

import { makeObservable } from '@modou/reactivity'

if (!useState) {
  throw new Error('mobx-react-lite requires React with Hooks support')
}
if (!makeObservable) {
  throw new Error(
    'mobx-react-lite@3 requires mobx at least version 6 to be available',
  )
}
