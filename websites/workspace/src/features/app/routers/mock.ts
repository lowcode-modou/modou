import {
  EntityField,
  EntityFieldEnum,
  EntityRelationLookupRelationTypeEnum,
  WidgetBaseProps,
  WidgetMetadata,
  generateId,
  getEntityFieldTypeLabel,
} from '@modou/core'
import { EntityRelationTypeEnum } from '@modou/core/src/types/entity-relation'
import {
  AppFile,
  EntityFieldFile,
  EntityFile,
  EntityRelationFile,
  PageFile,
  WidgetFile,
} from '@modou/meta-vfs'
import {
  buttonWidgetMetadata,
  colWidgetMetadata,
  rowWidgetMetadata,
} from '@modou/widgets-antd'

const MOCK_PAGE_ID = 'MOCK_PAGE_ID'
const MOCK_ROOT_WIDGET_ID = 'MOCK_ROOT_WIDGET_ID'

// mock app start
export const mock_appFile = AppFile.create({
  id: 'app_id_mock',
  name: 'app_name_mock',
  version: '0.0.1',
})
// mock app end

// mock page start
const buttonDSL: WidgetBaseProps = {
  ...WidgetMetadata.mrSchemeToDefaultJson(buttonWidgetMetadata.jsonPropsSchema),
  id: generateId(),
}

const colDSL: WidgetBaseProps = {
  ...WidgetMetadata.mrSchemeToDefaultJson(colWidgetMetadata.jsonPropsSchema),
  id: generateId(),
  slots: {
    children: [buttonDSL.id],
  },
}

const rowDSL: WidgetBaseProps = {
  ...WidgetMetadata.mrSchemeToDefaultJson(rowWidgetMetadata.jsonPropsSchema),
  id: MOCK_ROOT_WIDGET_ID,
  slots: {
    children: [colDSL.id],
  },
}

const MOCK_WIDGETS = [rowDSL, colDSL, buttonDSL]

const pageFile1 = PageFile.create(
  {
    name: '大漠孤烟直',
    id: MOCK_PAGE_ID,
    version: '0.0.0',
    rootWidgetId: MOCK_ROOT_WIDGET_ID,
  },
  mock_appFile,
)

// const pageFile2 = PageFile.create(
//   {
//     name: '测试',
//     id: MOCK_PAGE_ID + '___',
//     version: '0.0.0',
//     rootWidgetId: MOCK_ROOT_WIDGET_ID + MOCK_PAGE_ID + '___',
//   },
//   mock_appFile,
// )
// const pageFile3 = PageFile.create(
//   {
//     name: '长河落日圆',
//     id: MOCK_PAGE_ID + '________',
//     version: '0.0.0',
//     rootWidgetId: MOCK_ROOT_WIDGET_ID + MOCK_PAGE_ID + '________',
//   },
//   mock_appFile,
// )
MOCK_WIDGETS.forEach((widget) =>
  WidgetFile.create(
    {
      ...widget,
      version: '0.0.1',
      id: widget.id,
    },
    pageFile1,
  ),
)
// MOCK_WIDGETS.forEach((widget) =>
//   WidgetFile.create(
//     {
//       ...widget,
//       version: '0.0.1',
//       id: widget.id + pageFile2.meta.id,
//     },
//     pageFile2,
//   ),
// )
// MOCK_WIDGETS.forEach((widget) =>
//   WidgetFile.create(
//     {
//       ...widget,
//       version: '0.0.1',
//       id: widget.id + pageFile3.meta.id,
//     },
//     pageFile3,
//   ),
// )
// mock page end
const MOCK_FIELDS: EntityField[] = [
  {
    id: generateId(),
    type: EntityFieldEnum.AutoNumber,
    name: EntityFieldEnum.AutoNumber,
    title: EntityFieldEnum.AutoNumber,
    description: getEntityFieldTypeLabel(EntityFieldEnum.AutoNumber),
    required: false,
    config: {},
  },
  {
    id: generateId(),
    type: EntityFieldEnum.Date,
    name: EntityFieldEnum.Date,
    title: EntityFieldEnum.Date,
    description: getEntityFieldTypeLabel(EntityFieldEnum.Date),
    required: false,
    config: {},
  },
  {
    id: generateId(),
    type: EntityFieldEnum.DateTime,
    name: EntityFieldEnum.DateTime,
    title: EntityFieldEnum.DateTime,
    description: getEntityFieldTypeLabel(EntityFieldEnum.DateTime),
    required: false,
    config: {},
  },
  {
    id: generateId(),
    type: EntityFieldEnum.Email,
    name: EntityFieldEnum.Email,
    title: EntityFieldEnum.Email,
    description: getEntityFieldTypeLabel(EntityFieldEnum.Email),
    required: false,
    config: {},
  },
  {
    id: generateId(),
    type: EntityFieldEnum.Image,
    name: EntityFieldEnum.Image,
    title: EntityFieldEnum.Image,
    description: getEntityFieldTypeLabel(EntityFieldEnum.Image),
    required: false,
    config: {},
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
    config: {},
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
    config: {},
  },
  {
    id: generateId(),
    type: EntityFieldEnum.Enum,
    name: EntityFieldEnum.Enum,
    title: EntityFieldEnum.Enum,
    description: getEntityFieldTypeLabel(EntityFieldEnum.Enum),
    required: false,
    config: {
      enumCode: '',
      multiple: true,
    },
  },
]
// mock entity start
const entityFile1 = EntityFile.create(
  {
    version: '0.0.1',
    id: generateId(),
    name: 'user',
    title: '人员',
    description: '人员',
    position: {
      x: 400,
      y: 100,
    },
  },
  mock_appFile,
)

MOCK_FIELDS.forEach((field) => {
  EntityFieldFile.create(
    {
      ...field,
      version: '0.0.1',
    },
    entityFile1,
  )
})

const entityFile2 = EntityFile.create(
  {
    version: '0.0.1',
    id: generateId(),
    name: 'department',
    title: '部门',
    description: '部门',
    position: {
      x: 800,
      y: 100,
    },
  },
  mock_appFile,
)

EntityRelationFile.create(
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
    version: '0.0.1',
  },
  entityFile1,
)

MOCK_FIELDS.forEach((field) => {
  EntityFieldFile.create(
    {
      ...field,
      version: '0.0.1',
      required: true,
      id: field.id + entityFile2.meta.id,
    },
    entityFile2,
  )
})
// mock entity end
