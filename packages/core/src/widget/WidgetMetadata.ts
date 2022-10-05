import {
  JsonSchema7ObjectType,
  mr,
  MRScheme,
  mrToJsonSchema,
  schemeToJsonDefault
} from '@modou/refine'
import { WidgetBaseProps } from './types'
import { ReactNode } from 'react'

type WidgetType = `${string}Widget`
type Slots<S extends string> = Record<S, {
  accept?: WidgetType[]
}>

interface BaseWidgetMetadata<S extends string> {
  version: `${number}.${number}.${number}`
  icon: ReactNode
  widgetType: WidgetType
  widgetName: string
  slots: Slots<S>
  mrPropsScheme: MRScheme
}

export class WidgetMetadata<S extends string = string> implements BaseWidgetMetadata<S> {
  constructor ({
    version,
    widgetType,
    widgetName,
    mrPropsScheme,
    slots,
    icon
  }: BaseWidgetMetadata<S>) {
    this.version = version
    this.widgetType = widgetType
    this.widgetName = widgetName
    this.mrPropsScheme = mrPropsScheme
    this.jsonPropsSchema = mrToJsonSchema(mrPropsScheme) as unknown as JsonSchema7ObjectType
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

  static createMetadata<S extends string = ''> (metadata: BaseWidgetMetadata<S>) {
    return new WidgetMetadata(metadata)
  }

  static createMRSchemeWidgetProps
  // <SlotName extends string>
  ({
    widgetType,
    widgetName
    // props,
    // slots
  }: {
    widgetType: `${string}Widget`
    widgetName: string
    // props: unknown
    // slots: Record<SlotName, MRArray<MRString> | MRDefault<MRArray<MRString>>>
  }) {
    return mr.object({
      widgetId: mr.string(),
      widgetType: mr.literal(widgetType),
      widgetName: mr.literal(widgetName)
      // props: mr.object(props),
      // slots: mr.object<Record<SlotName, MRArray<MRString> | MRDefault<MRArray<MRString>>>>(slots)
    })
  }

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

  static mrSchemeToDefaultJson (scheme: Parameters<typeof schemeToJsonDefault>[0]): WidgetBaseProps {
    // TODO 增加WidgetId
    return schemeToJsonDefault(scheme) as unknown as WidgetBaseProps
  }
}
