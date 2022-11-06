import { getEntityTypeLabel } from '../../entity'
import { Entity, FieldEnum } from '../../types'
import { EntityField } from '../../types/entity-field'
import { generateId } from '../../utils'

const MOCK_FIELDS: EntityField[] = [
  {
    id: generateId(),
    type: FieldEnum.AutoNumber,
    name: FieldEnum.AutoNumber,
    description: getEntityTypeLabel(FieldEnum.AutoNumber),
    required: false,
  },
  {
    id: generateId(),
    type: FieldEnum.Date,
    name: FieldEnum.Date,
    description: getEntityTypeLabel(FieldEnum.Date),
    required: false,
  },
  {
    id: generateId(),
    type: FieldEnum.DateTime,
    name: FieldEnum.DateTime,
    description: getEntityTypeLabel(FieldEnum.DateTime),
    required: false,
  },
  {
    id: generateId(),
    type: FieldEnum.Email,
    name: FieldEnum.Email,
    description: getEntityTypeLabel(FieldEnum.Email),
    required: false,
  },
  {
    id: generateId(),
    type: FieldEnum.Image,
    name: FieldEnum.Image,
    description: getEntityTypeLabel(FieldEnum.Image),
    required: false,
  },
  {
    id: generateId(),
    type: FieldEnum.LongText,
    name: FieldEnum.LongText,
    description: getEntityTypeLabel(FieldEnum.LongText),
    required: false,
    config: {},
  },
  {
    id: generateId(),
    type: FieldEnum.Number,
    name: FieldEnum.Number,
    description: getEntityTypeLabel(FieldEnum.Number),
    required: false,
    config: {},
  },
  {
    id: generateId(),
    type: FieldEnum.PhoneNumber,
    name: FieldEnum.PhoneNumber,
    description: getEntityTypeLabel(FieldEnum.PhoneNumber),
    required: false,
  },
  {
    id: generateId(),
    type: FieldEnum.Text,
    name: FieldEnum.Text,
    description: getEntityTypeLabel(FieldEnum.Text),
    required: false,
    config: {},
  },
  {
    id: generateId(),
    type: FieldEnum.URL,
    name: FieldEnum.URL,
    description: getEntityTypeLabel(FieldEnum.URL),
    required: false,
  },
  {
    id: generateId(),
    type: FieldEnum.Enum,
    name: FieldEnum.Enum,
    description: getEntityTypeLabel(FieldEnum.Enum),
    required: false,
  },
]

export const MOCK_ENTITIES: Entity[] = [
  {
    id: generateId(),
    name: 'user',
    description: '人员',
    fields: MOCK_FIELDS,
  },
  {
    id: generateId(),
    name: 'department',
    description: '部门',
    fields: MOCK_FIELDS.map((field) => ({
      ...field,
      required: true,
    })),
  },
]
