import {
  JsonSchema7ObjectType,
  mr,
  MRArray, MRDefault, MRObject,
  MRRawShape,
  MRScheme, MRString,
  mrToJsonSchema, MRTypeAny,
  schemeToJsonDefault
} from '@modou/refine'
import { WidgetBaseProps } from './types'

interface BaseWidgetMetadata {
  version: `${number}.${number}.${number}`
  widgetType: `${string}Widget`
  widgetName: string
  mrPropsScheme: MRScheme
}

export class Widget implements BaseWidgetMetadata {
  constructor ({
    version,
    widgetType,
    widgetName,
    mrPropsScheme
  }: BaseWidgetMetadata) {
    this.version = version
    this.widgetType = widgetType
    this.widgetName = widgetName
    this.mrPropsScheme = mrPropsScheme
    this.jsonPropsSchema = mrToJsonSchema(mrPropsScheme) as unknown as JsonSchema7ObjectType
  }

  version
  widgetType
  widgetName
  mrPropsScheme
  jsonPropsSchema: JsonSchema7ObjectType

  static createMetadata (metadata: BaseWidgetMetadata) {
    return new Widget(metadata)
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
  // & (ReturnType<typeof Widget.createMRSchemeWidgetProps>)>
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
