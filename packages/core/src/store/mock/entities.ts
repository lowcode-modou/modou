import { getEntityTypeLabel } from '../../entity'
import {
  Entity,
  EntityField,
  EntityRelationLookupRelationTypeEnum,
  FieldEnum,
} from '../../types'
import { EntityRelationTypeEnum } from '../../types/entity-relation'
import { generateId } from '../../utils'

const MOCK_FIELDS: EntityField[] = [
  {
    id: generateId(),
    type: FieldEnum.AutoNumber,
    name: FieldEnum.AutoNumber,
    title: FieldEnum.AutoNumber,
    description: getEntityTypeLabel(FieldEnum.AutoNumber),
    required: false,
  },
  {
    id: generateId(),
    type: FieldEnum.Date,
    name: FieldEnum.Date,
    title: FieldEnum.Date,
    description: getEntityTypeLabel(FieldEnum.Date),
    required: false,
  },
  {
    id: generateId(),
    type: FieldEnum.DateTime,
    name: FieldEnum.DateTime,
    title: FieldEnum.DateTime,
    description: getEntityTypeLabel(FieldEnum.DateTime),
    required: false,
  },
  {
    id: generateId(),
    type: FieldEnum.Email,
    name: FieldEnum.Email,
    title: FieldEnum.Email,
    description: getEntityTypeLabel(FieldEnum.Email),
    required: false,
  },
  {
    id: generateId(),
    type: FieldEnum.Image,
    name: FieldEnum.Image,
    title: FieldEnum.Image,
    description: getEntityTypeLabel(FieldEnum.Image),
    required: false,
  },
  {
    id: generateId(),
    type: FieldEnum.LongText,
    name: FieldEnum.LongText,
    title: FieldEnum.LongText,
    description: getEntityTypeLabel(FieldEnum.LongText),
    required: false,
    config: {},
  },
  {
    id: generateId(),
    type: FieldEnum.Number,
    name: FieldEnum.Number,
    title: FieldEnum.Number,
    description: getEntityTypeLabel(FieldEnum.Number),
    required: false,
    config: {},
  },
  {
    id: generateId(),
    type: FieldEnum.PhoneNumber,
    name: FieldEnum.PhoneNumber,
    title: FieldEnum.PhoneNumber,
    description: getEntityTypeLabel(FieldEnum.PhoneNumber),
    required: false,
  },
  {
    id: generateId(),
    type: FieldEnum.Text,
    name: FieldEnum.Text,
    title: FieldEnum.Text,
    description: getEntityTypeLabel(FieldEnum.Text),
    required: false,
    config: {},
  },
  {
    id: generateId(),
    type: FieldEnum.URL,
    name: FieldEnum.URL,
    title: FieldEnum.URL,
    description: getEntityTypeLabel(FieldEnum.URL),
    required: false,
  },
  {
    id: generateId(),
    type: FieldEnum.Enum,
    name: FieldEnum.Enum,
    title: FieldEnum.Enum,
    description: getEntityTypeLabel(FieldEnum.Enum),
    required: false,
  },
]

export const MOCK_ENTITIES: Entity[] = [
  {
    id: generateId(),
    name: 'user',
    title: '人员',
    description: '人员',
    fields: MOCK_FIELDS,
    relations: [
      {
        id: generateId(),
        name: 'department',
        title: '部门',
        type: EntityRelationTypeEnum.Lookup,
        relationType: EntityRelationLookupRelationTypeEnum.ManyToMany,
        description: '部门',
        sourceEntity: 'user',
        targetEntity: 'department',
        targetName: 'user',
        targetTitle: '用户',
        targetDescription: '用户',
      },
    ],
  },
  {
    id: generateId(),
    name: 'department',
    title: '部门',
    description: '部门',
    fields: MOCK_FIELDS.map((field) => ({
      ...field,
      required: true,
    })),
    relations: [],
  },
]
