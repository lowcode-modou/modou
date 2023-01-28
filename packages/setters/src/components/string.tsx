import { FC } from 'react'

import { CodeEditor } from '@modou/code-editor'

import { SetterTypeEnum } from '../constants'
import { BaseMRSetterOptions, BaseSetterProps } from '../types'

const mock_dyn_def = {
  '!name': 'DATA_TREE',
  '!define': {
    '0_1421776803503454': {
      dataIndex: {
        '!type': 'string',
        '!doc': '',
      },
      title: {
        '!type': 'string',
        '!doc': '',
      },
      valueType: {
        '!type': 'string',
        '!doc': '',
      },
      buildIn: {
        '!type': 'bool',
        '!doc': '',
      },
      align: {
        '!type': 'string',
        '!doc': '',
      },
      fixed: {
        '!type': 'string',
        '!doc': '',
      },
      width: {
        '!type': 'number',
        '!doc': '',
      },
      mappedValue: {
        '!type': 'any',
        '!doc': '',
      },
      hideInTable: {
        '!type': 'bool',
        '!doc': '',
      },
    },
  },
  表格_fbsm: {
    dataSource: {
      '!type': '[any]',
      '!doc': '数据源',
    },
    size: {
      '!type': 'string',
      '!doc': '设置表格尺寸',
    },
    columns: {
      '!type': '[0_1421776803503454]',
      '!doc': '表格列',
    },
  },
  按钮1: {
    '!doc': '我是一个按钮',
    '!url': 'https://docs.modou.com/widget-reference/button',
    isVisible: {
      '!type': 'bool',
      '!doc': 'Boolean value indicating if the widget is in visible state',
    },
    text: 'string',
    isDisabled: 'bool',
    recaptchaToken: 'string',
  },
  '按钮1.isVisible': {
    '!type': 'bool',
    '!doc': 'Boolean value indicating if the widget is in visible state',
  },
  '按钮1.text': 'string',
  '按钮1.isDisabled': 'bool',
  '按钮1.recaptchaToken': 'string',
  Input1: {
    '!doc':
      'An input text field is used to capture a users textual input such as their names, numbers, emails etc. Inputs are used in forms and can have custom validations.',
    '!url': 'https://docs.modou.com/widget-reference/input',
    text: {
      '!type': 'string',
      '!doc': 'The text value of the input',
      '!url': 'https://docs.modou.com/widget-reference/input',
    },
    inputText: {
      '!type': 'string',
      '!doc': 'The unformatted text value of the input',
      '!url': 'https://docs.modou.com/widget-reference/input',
    },
    isValid: 'bool',
    isVisible: {
      '!type': 'bool',
      '!doc': 'Boolean value indicating if the widget is in visible state',
    },
    isDisabled: 'bool',
  },
  'Input1.text': {
    '!type': 'string',
    '!doc': 'The text value of the input',
    '!url': 'https://docs.modou.com/widget-reference/input',
  },
  'Input1.inputText': {
    '!type': 'string',
    '!doc': 'The unformatted text value of the input',
    '!url': 'https://docs.modou.com/widget-reference/input',
  },
  'Input1.isValid': 'bool',
  'Input1.isVisible': {
    '!type': 'bool',
    '!doc': 'Boolean value indicating if the widget is in visible state',
  },
  'Input1.isDisabled': 'bool',
  modou: {
    user: {
      email: 'string',
      workspaceIds: '[string]',
      username: 'string',
      name: 'string',
      role: 'string',
      useCase: 'string',
      enableTelemetry: 'bool',
      idToken: {},
      emptyInstance: 'bool',
      accountNonExpired: 'bool',
      accountNonLocked: 'bool',
      credentialsNonExpired: 'bool',
      isAnonymous: 'bool',
      isEnabled: 'bool',
      isSuperUser: 'bool',
      isConfigurable: 'bool',
    },
    URL: {
      fullPath: 'string',
      host: 'string',
      hostname: 'string',
      queryParams: {},
      protocol: 'string',
      pathname: 'string',
      port: 'string',
      hash: 'string',
    },
    store: {},
    geolocation: {
      canBeRequested: 'bool',
      currentPosition: {},
      '!doc':
        "The user's geo location information. Only available when requested",
      '!url': 'https://docs.modou.com/v/v1.2.1/framework-reference/geolocation',
      getCurrentPosition:
        'fn(onSuccess: fn() -> void, onError: fn() -> void, options: object) -> void',
      watchPosition: 'fn(options: object) -> void',
      clearWatch: 'fn() -> void',
    },
    mode: 'string',
    theme: {
      colors: {
        primaryColor: 'string',
        backgroundColor: 'string',
      },
      borderRadius: {
        appBorderRadius: 'string',
      },
      boxShadow: {
        appBoxShadow: 'string',
      },
      fontFamily: {
        appFont: 'string',
      },
    },
  },
}
export interface MRStringSetterType extends BaseMRSetterOptions {
  type: SetterTypeEnum.String
  textArea?: boolean
}

type Props = BaseSetterProps<string, MRStringSetterType>

// export const StringSetter: FC<Props> = ({ value, onChange, options }) => {
//   const Component = options?.textArea ? Input.TextArea : Input
//   const [realValue, setRealValue] = useState(value)
//   const { run } = useDebounceFn(onChange, { wait: 300 })
//   const debounceSetValue = useMemoizedFn(
//     (valOrUpdater: ((currVal: any) => any) | any): void => {
//       setRealValue(valOrUpdater)
//       run(valOrUpdater)
//     },
//   )
//   useEffect(() => {
//     setRealValue(value)
//   }, [value])
//   return (
//     <Component
//       value={realValue}
//       onChange={(val) => debounceSetValue(val.target.value)}
//     />
//   )
// }

export const StringSetter: FC<Props> = ({
  value,
  onChange,
  options,
  getDataTreeDefs,
}) => {
  return (
    // @ts-expect-error
    <CodeEditor
      value={value}
      onChange={onChange}
      getDataTreeDefs={getDataTreeDefs}
    />
  )
}
