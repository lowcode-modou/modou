import { mapValues } from 'lodash'
import { FC, ReactNode } from 'react'

import {
  JsonSchema7ObjectType,
  MRRawShape,
  MRScheme,
  MRTypeAny,
  mr,
  mrToJsonSchema,
  schemeToJsonDefault,
} from '@modou/refine'
import {
  BaseSetterProps,
  MRArraySetterType,
  MRBooleanSetterType,
  MRNumberSetterType,
  MRSelectSetterType,
  MRStringSetterType,
  SETTER_KEY,
} from '@modou/setters'
import { InferWidgetState } from '@modou/widgets-antd'

import { MDVersion } from '../types'
import { WidgetBaseProps } from './types'

type WidgetType = `${string}Widget`

export interface WidgetSlot {
  name: string
  accept?: WidgetType[]
}
export type WidgetSlots<S extends string> = Record<S, WidgetSlot>

interface BaseWidgetMetadata<
  PropsMRScheme extends MRScheme,
  StateMRScheme extends MRScheme,
  S extends string = '',
> {
  version: MDVersion
  icon: ReactNode
  type: WidgetType
  name: string
  slots: WidgetSlots<S>
  // TODO FIX TYPE
  setters: Record<string, FC<BaseSetterProps<any>>>
  mrPropsScheme: PropsMRScheme
  mrStateScheme: StateMRScheme
  // TODO 通过 props 和 state 的类型对比判断 initState 是否是必传的
  initState?: (
    widget: mr.infer<PropsMRScheme>,
  ) => Omit<
    InferWidgetState<StateMRScheme>,
    | keyof mr.infer<PropsMRScheme>['props']
    | 'renderSlotPaths'
    | 'renderSlots'
    | 'updateState'
    | 'instance'
  >
}

export interface MRWidgetProps {
  [k: string]: {
    setter?:
      | MRNumberSetterType
      | MRStringSetterType
      | MRBooleanSetterType
      | MRSelectSetterType
      | MRArraySetterType
    def: MRTypeAny
  }
}

export class WidgetMetadata<
  PropsMRScheme extends MRScheme,
  StateMRScheme extends MRScheme,
  S extends string = string,
> implements BaseWidgetMetadata<PropsMRScheme, StateMRScheme, S>
{
  constructor({
    version,
    type,
    name,
    mrPropsScheme,
    mrStateScheme,
    slots,
    setters,
    icon,
    initState,
  }: BaseWidgetMetadata<PropsMRScheme, StateMRScheme, S>) {
    this.version = version
    this.type = type
    this.name = name
    this.mrPropsScheme = mrPropsScheme
    this.mrStateScheme = mrStateScheme
    this.jsonPropsSchema = mrToJsonSchema(
      mrPropsScheme,
    ) as unknown as JsonSchema7ObjectType
    this.jsonStateSchema = mrToJsonSchema(
      mrStateScheme,
    ) as unknown as JsonSchema7ObjectType
    this.slots = slots
    // TODO FIX TYPE
    this.setters = setters
    this.icon = icon
    // TODO IMPORTANT 完善类型定义
    this.initState = ((...args: [{ id: string }]) => {
      const { id } = args[0]
      return {
        instance: {
          id,
          widgetId: id,
          initialized: false,
        },
        ...(initState?.(...args) ?? {}),
      }
    }) as unknown as Required<
      BaseWidgetMetadata<PropsMRScheme, StateMRScheme, S>
    >['initState']
  }

  version
  type
  name
  icon
  mrPropsScheme
  mrStateScheme
  jsonPropsSchema: JsonSchema7ObjectType
  jsonStateSchema: JsonSchema7ObjectType
  initState
  slots: WidgetSlots<S>
  setters: Record<string, FC<BaseSetterProps<any>>>

  static createMetadata<
    PropsMRScheme extends MRScheme,
    StateMRScheme extends MRScheme,
  >(
    metadata: BaseWidgetMetadata<
      PropsMRScheme,
      StateMRScheme,
      // @ts-expect-error
      keyof mr.infer<PropsMRScheme>['slots']
    >,
  ) {
    return new WidgetMetadata(metadata)
  }

  static createMRWidgetProps<T extends MRWidgetProps, S extends MRRawShape>({
    name,
    type,
    props,
    slots,
  }: {
    name: string
    type: string
    props: T
    // TODO 限制KEY的范围
    slots?: S
  }) {
    type PropsRawShape<S extends T> = {
      [K in keyof S]: S[K]['def']
    }
    const propsRawShape: PropsRawShape<T> = mapValues(props, (prop) => {
      if (prop.setter) {
        return prop.def._extra({
          [SETTER_KEY]: prop.setter,
        })
      }
      return prop.def
    })

    return mr.object({
      id: mr.string(),
      type: mr.literal(type),
      name: mr.literal(name),
      props: mr.object(propsRawShape),
      slots: mr.object(slots ?? ({} as unknown as S)),
    })
  }

  static createMRWidgetState<
    T extends ReturnType<typeof WidgetMetadata.createMRWidgetProps>,
    S extends MRRawShape,
  >(mrWidgetProps: T, state: S) {
    const HACK_TYPE_REACT_NODE = mr.literal('HACK_TYPE_ReactNode')
    const RENDER_SLOT_NAMES_VALUE = mr.string()
    return (
      mr
        .object({
          renderSlots: mr.object(
            mapValues(
              mrWidgetProps.shape.slots,
              (slot) => HACK_TYPE_REACT_NODE,
            ) as {
              [K in keyof mr.infer<T>['slots']]: typeof HACK_TYPE_REACT_NODE
            },
          ),
          renderSlotPaths: mr.object(
            mapValues(mrWidgetProps.shape.slots, (slot) => mr.string()) as {
              [K in keyof mr.infer<T>['slots']]: typeof RENDER_SLOT_NAMES_VALUE
            },
          ),
        })
        .merge(mrWidgetProps.shape.props as T['shape']['props'])
        // .merge(mr.object(state ?? ({} as unknown as S)))
        .merge(
          mr.object({
            ...state,
            instance: mr.object({
              id: mr.string(),
              widgetId: mrWidgetProps.shape.id as T['shape']['id'],
              initialized: mr.boolean(),
            }),
          }),
        )
    )
  }

  // static createMRSchemeWidgetProps({
  //   widgetType,
  //   widgetName,
  // }: // props,
  // // slots
  // {
  //   widgetType: `${string}Widget`
  //   widgetName: string
  //   // props: unknown
  //   // slots: Record<SlotName, MRArray<MRString> | MRDefault<MRArray<MRString>>>
  // }) {
  //   return mr.object({
  //     id: mr.string(),
  //     widgetType: mr.literal(widgetType),
  //     widgetName: mr.literal(widgetName),
  //     // props: mr.object(props),
  //     // slots: mr.object<Record<SlotName, MRArray<MRString> | MRDefault<MRArray<MRString>>>>(slots)
  //   })
  // }

  // static createMRSchemeWidgetState<T extends MRObject<{ props: MRObject<any> }>
  // & (ReturnType<typeof WidgetMetadata.createMRSchemeWidgetProps>)>
  // (mrSchemeProps: T) {
  //   return mrSchemeProps.shape.props.extend({
  //     instance: mr.object({
  //       id: mr.string(),
  //       id: mrSchemeProps.shape.id
  //     }),
  //     widgetName: mrSchemeProps.shape.widgetName
  //   })
  // }

  static mrSchemeToDefaultJson(
    scheme: Parameters<typeof schemeToJsonDefault>[0],
  ): WidgetBaseProps {
    // TODO 增加WidgetId
    return schemeToJsonDefault(scheme) as unknown as WidgetBaseProps
  }
}
