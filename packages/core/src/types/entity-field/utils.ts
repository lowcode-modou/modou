export enum FieldEnum {
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

export interface BaseEntityField<T extends FieldEnum> {
  id: string
  name: string
  type: T
  description: string
  required: boolean
}
