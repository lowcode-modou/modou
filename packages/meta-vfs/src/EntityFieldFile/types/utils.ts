export enum EntityFieldEnum {
  Text = 'Text',
  LongText = 'LongText',
  Date = 'Date',
  DateTime = 'DateTime',
  Enum = 'Enum',
  Number = 'Number',
  AutoNumber = 'AutoNumber',
  PhoneNumber = 'PhoneNumber',
  Email = 'Email',
  URL = 'URL',
  Image = 'Image',
}

export interface BaseEntityField<
  T extends EntityFieldEnum,
  Config extends object,
> {
  id: string
  name: string
  title: string
  description: string
  type: T
  required: boolean
  config: Config
}
