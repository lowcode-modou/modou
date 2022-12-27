type WidgetDerivedPropertyType = any
export type WidgetTypeConfigMap = Record<
  string,
  {
    defaultProperties: Record<string, string>
    metaProperties: Record<string, any>
    derivedProperties: WidgetDerivedPropertyType
  }
>
