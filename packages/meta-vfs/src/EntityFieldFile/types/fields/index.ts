import { AutoNumberField } from './auto-number'
import { DateField } from './date'
import { DateTimeField } from './date-time'
import { EmailField } from './email'
import { EnumField } from './enum'
import { ImageField } from './image'
import { LongTextField } from './long-text'
import { NumberField } from './number'
import { PhoneNumberField } from './phone-number'
import { TextField } from './text'
import { UrlField } from './url'

export type EntityField =
  | AutoNumberField
  | DateField
  | DateTimeField
  | EmailField
  | ImageField
  | LongTextField
  | NumberField
  | PhoneNumberField
  | TextField
  | UrlField
  | EnumField
