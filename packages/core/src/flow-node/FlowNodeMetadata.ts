import { mapValues } from 'lodash'
import { ReactNode } from 'react'

import {
  JsonSchema7ObjectType,
  MRScheme,
  MRTypeAny,
  mr,
  mrToJsonSchema,
  schemeToJsonDefault,
} from '@modou/refine'
import {
  MRArraySetterType,
  MRBooleanSetterType,
  MRNumberSetterType,
  MRSelectSetterType,
  MRStringSetterType,
  SETTER_KEY,
} from '@modou/setters'
import { generateId } from '@modou/shared'

import { MDVersion } from '../types'
import { FlowNodeBaseProps, FlowNodePortNameEnum } from './types'

// TODO 合并 Widget 类型定义
export interface MRFlowNodeProps {
  [k: string]: {
    setter?:
      | MRNumberSetterType
      | MRStringSetterType
      | MRBooleanSetterType
      | MRSelectSetterType
      | MRArraySetterType
    def: MRTypeAny
  }
}
interface BaseFlowNodeMetadata<PropsMRScheme extends MRScheme> {
  version: MDVersion
  icon: ReactNode
  name: string
  type: string
  mrPropsScheme: PropsMRScheme
}
export class FlowNodeMetadata<PropsMRScheme extends MRScheme>
  implements BaseFlowNodeMetadata<PropsMRScheme>
{
  constructor({
    type,
    icon,
    name,
    version,
    mrPropsScheme,
  }: BaseFlowNodeMetadata<PropsMRScheme>) {
    this.type = type
    this.icon = icon
    this.name = name
    this.version = version
    this.mrPropsScheme = mrPropsScheme
    this.jsonPropsSchema = mrToJsonSchema(
      mrPropsScheme,
    ) as unknown as JsonSchema7ObjectType
  }

  type
  icon
  name
  version
  mrPropsScheme
  jsonPropsSchema: JsonSchema7ObjectType

  static createMetadata<PropsMRScheme extends MRScheme>(
    metadata: BaseFlowNodeMetadata<PropsMRScheme>,
  ) {
    return new FlowNodeMetadata<PropsMRScheme>(metadata)
  }

  static createMRFlowNodeProps<T extends MRFlowNodeProps>({
    name,
    type,
    props,
    defaultSources,
  }: {
    name: string
    type: string
    props: T
    defaultSources?: Array<{ name: string }>
  }) {
    type PropsRawShape<S extends T> = {
      [K in keyof S]: S[K]['def']
    }
    const propsRawShape: PropsRawShape<T> = mapValues(props, (prop) => {
      if (prop.setter) {
        return prop.def._extra({
          [SETTER_KEY]: prop.setter,
        })
      }
      return prop.def
    })

    return mr.object({
      id: mr.string(),
      type: mr.literal(type),
      name: mr.literal(name),
      position: mr.object({
        x: mr.number().default(100),
        y: mr.number().default(100),
      }),
      // 作为 source
      sources: mr
        .array(
          mr.object({
            name: mr.string(),
          }),
        )
        .default(
          defaultSources ?? [
            {
              name: FlowNodePortNameEnum.SOURCE,
            },
          ],
        ),
      // 作为 target
      targets: mr
        .array(
          mr.object({
            name: mr.string(),
          }),
        )
        .default([
          {
            name: FlowNodePortNameEnum.TARGET,
          },
        ]),
      props: mr.object(propsRawShape),
    })
  }

  static mrSchemeToDefaultJson(
    scheme: Parameters<typeof schemeToJsonDefault>[0],
  ): FlowNodeBaseProps {
    const props = schemeToJsonDefault(scheme) as unknown as FlowNodeBaseProps
    props.id = generateId()
    return props
  }
}
