import { getEntityFieldTypeLabel } from '../../entity'
import {
  Entity,
  EntityField,
  EntityFieldEnum,
  EntityRelationLookupRelationTypeEnum,
} from '../../types'
import { EntityRelationTypeEnum } from '../../types/entity-relation'
import { generateId } from '../../utils'

const MOCK_FIELDS: EntityField[] = [
  {
    id: generateId(),
    type: EntityFieldEnum.AutoNumber,
    name: EntityFieldEnum.AutoNumber,
    title: EntityFieldEnum.AutoNumber,
    description: getEntityFieldTypeLabel(EntityFieldEnum.AutoNumber),
    required: false,
  },
  {
    id: generateId(),
    type: EntityFieldEnum.Date,
    name: EntityFieldEnum.Date,
    title: EntityFieldEnum.Date,
    description: getEntityFieldTypeLabel(EntityFieldEnum.Date),
    required: false,
  },
  {
    id: generateId(),
    type: EntityFieldEnum.DateTime,
    name: EntityFieldEnum.DateTime,
    title: EntityFieldEnum.DateTime,
    description: getEntityFieldTypeLabel(EntityFieldEnum.DateTime),
    required: false,
  },
  {
    id: generateId(),
    type: EntityFieldEnum.Email,
    name: EntityFieldEnum.Email,
    title: EntityFieldEnum.Email,
    description: getEntityFieldTypeLabel(EntityFieldEnum.Email),
    required: false,
  },
  {
    id: generateId(),
    type: EntityFieldEnum.Image,
    name: EntityFieldEnum.Image,
    title: EntityFieldEnum.Image,
    description: getEntityFieldTypeLabel(EntityFieldEnum.Image),
    required: false,
  },
  {
    id: generateId(),
    type: EntityFieldEnum.LongText,
    name: EntityFieldEnum.LongText,
    title: EntityFieldEnum.LongText,
    description: getEntityFieldTypeLabel(EntityFieldEnum.LongText),
    required: false,
    config: {},
  },
  {
    id: generateId(),
    type: EntityFieldEnum.Number,
    name: EntityFieldEnum.Number,
    title: EntityFieldEnum.Number,
    description: getEntityFieldTypeLabel(EntityFieldEnum.Number),
    required: false,
    config: {},
  },
  {
    id: generateId(),
    type: EntityFieldEnum.PhoneNumber,
    name: EntityFieldEnum.PhoneNumber,
    title: EntityFieldEnum.PhoneNumber,
    description: getEntityFieldTypeLabel(EntityFieldEnum.PhoneNumber),
    required: false,
  },
  {
    id: generateId(),
    type: EntityFieldEnum.Text,
    name: EntityFieldEnum.Text,
    title: EntityFieldEnum.Text,
    description: getEntityFieldTypeLabel(EntityFieldEnum.Text),
    required: false,
    config: {},
  },
  {
    id: generateId(),
    type: EntityFieldEnum.URL,
    name: EntityFieldEnum.URL,
    title: EntityFieldEnum.URL,
    description: getEntityFieldTypeLabel(EntityFieldEnum.URL),
    required: false,
  },
  {
    id: generateId(),
    type: EntityFieldEnum.Enum,
    name: EntityFieldEnum.Enum,
    title: EntityFieldEnum.Enum,
    description: getEntityFieldTypeLabel(EntityFieldEnum.Enum),
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
        relationType: EntityRelationLookupRelationTypeEnum.ManyToOne,
        description: '部门',
        sourceEntity: 'user',
        targetEntity: 'department',
        targetName: 'user',
        targetTitle: '用户',
        targetDescription: '用户',
      },
    ],
    position: {
      x: 400,
      y: 100,
    },
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
    position: {
      x: 800,
      y: 100,
    },
  },
]
