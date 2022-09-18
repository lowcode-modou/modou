import { JsonSchema7ObjectType, MRScheme, mrToJsonSchema } from '@modou/refine'

interface BaseWidgetMetadata {
  version: `${number}.${number}.${number}`
  widgetType: `${string}Widget`
  widgetName: string
  mrPropsScheme: MRScheme
}

export class WidgetMetadata implements BaseWidgetMetadata {
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

  static create (metadata: BaseWidgetMetadata) {
    return new WidgetMetadata(metadata)
  }
}
