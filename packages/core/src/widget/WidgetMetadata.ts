import {
  JsonSchema7ObjectType,
  mr,
  MRScheme,
  mrToJsonSchema,
  MRTypeAny,
  schemeToJsonDefault,
  MRRawShape,
} from '@modou/refine'
import { WidgetBaseProps } from './types'
import { ReactNode } from 'react'
import { mapValues } from 'lodash'
import {
  MRBooleanSetterType,
  MRNumberSetterType,
  MRSelectSetterType,
  MRStringSetterType,
  SETTER_KEY,
} from '@modou/setters'

type WidgetType = `${string}Widget`
type Slots<S extends string> = Record<
  S,
  {
    accept?: WidgetType[]
  }
>

interface BaseWidgetMetadata<S extends string> {
  version: `${number}.${number}.${number}`
  icon: ReactNode
  widgetType: WidgetType
  widgetName: string
  slots: Slots<S>
  mrPropsScheme: MRScheme
}

interface MRWidgetProps {
  [k: string]: {
    setter?:
      | MRNumberSetterType
      | MRStringSetterType
      | MRBooleanSetterType
      | MRSelectSetterType
    def: MRTypeAny
  }
}

export class WidgetMetadata<S extends string = string>
  implements BaseWidgetMetadata<S>
{
  constructor({
    version,
    widgetType,
    widgetName,
    mrPropsScheme,
    slots,
    icon,
  }: BaseWidgetMetadata<S>) {
    this.version = version
    this.widgetType = widgetType
    this.widgetName = widgetName
    this.mrPropsScheme = mrPropsScheme
    this.jsonPropsSchema = mrToJsonSchema(
      mrPropsScheme,
    ) as unknown as JsonSchema7ObjectType
    this.slots = slots
    this.icon = icon
  }

  version
  widgetType
  widgetName
  icon
  mrPropsScheme
  jsonPropsSchema: JsonSchema7ObjectType
  slots: Slots<S>

  static createMetadata<S extends string = ''>(
    metadata: BaseWidgetMetadata<S>,
  ) {
    return new WidgetMetadata(metadata)
  }

  static createMRWidgetProps<T extends MRWidgetProps, S extends MRRawShape>({
    widgetName,
    widgetType,
    props,
    slots,
  }: {
    widgetName: string
    widgetType: string
    props: T
    // TODO 限制KEY的范围
    slots?: S
  }) {
    type PropsRawShape<S extends T> = {
      [K in keyof S]: S[K]['def']
    }
    const propsRawShape: PropsRawShape<T> = mapValues(props, (prop) => {
      if (prop.setter) {
        prop.def._extra({
          [SETTER_KEY]: prop.setter,
        })
      }
      return prop.def
    })
    return mr.object({
      widgetId: mr.string(),
      widgetType: mr.literal(widgetType),
      widgetName: mr.literal(widgetName),
      props: mr.object(propsRawShape),
      slots: mr.object(slots ?? ({} as S)),
    })
  }

  static createMRWidgetState<
    T extends ReturnType<typeof WidgetMetadata.createMRWidgetProps>,
  >(mrWidgetProps: T) {
    const HACK_TYPE_REACT_NODE = mr.literal('HACK_TYPE_ReactNode')
    const RENDER_SLOT_NAMES_VALUE = mr.string()
    return mr
      .object({
        instance: mr.object({
          id: mr.string(),
          widgetId: mrWidgetProps.shape.widgetId as T['shape']['widgetId'],
        }),
        widgetName: mrWidgetProps.shape.widgetName as T['shape']['widgetName'],
        renderSlots: mr.object(
          mapValues(
            mrWidgetProps.shape.slots,
            (slot) => HACK_TYPE_REACT_NODE,
          ) as {
            [K in keyof mr.infer<T>['slots']]: typeof HACK_TYPE_REACT_NODE
          },
        ),
        renderSlotNames: mr.object(
          mapValues(mrWidgetProps.shape.slots, (slot) => mr.string()) as {
            [K in keyof mr.infer<T>['slots']]: typeof RENDER_SLOT_NAMES_VALUE
          },
        ),
      })
      .merge(mrWidgetProps.shape.props as T['shape']['props'])
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
  //     widgetId: mr.string(),
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
  //       widgetId: mrSchemeProps.shape.widgetId
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
