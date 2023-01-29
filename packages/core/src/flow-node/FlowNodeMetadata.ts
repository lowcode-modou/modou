import { mapValues } from 'lodash'
import { ReactNode } from 'react'

import { MRScheme, MRTypeAny, mr } from '@modou/refine'
import {
  MRArraySetterType,
  MRBooleanSetterType,
  MRNumberSetterType,
  MRSelectSetterType,
  MRStringSetterType,
  SETTER_KEY,
} from '@modou/setters'

import { MDVersion } from '../types'

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
  }

  type
  icon
  name
  version
  mrPropsScheme

  static createMetadata<PropsMRScheme extends MRScheme>(
    metadata: BaseFlowNodeMetadata<PropsMRScheme>,
  ) {
    return new FlowNodeMetadata<PropsMRScheme>(metadata)
  }

  static createMRFlowNodeProps<T extends MRFlowNodeProps>({
    name,
    type,
    props,
  }: {
    name: string
    type: string
    props: T
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
        x: mr.number(),
        y: mr.number(),
      }),
      sources: mr.array(
        mr.object({
          name: mr.string(),
          id: mr.string(),
        }),
      ),
      targets: mr.array(
        mr.object({
          name: mr.string(),
          id: mr.string(),
        }),
      ),
      props: mr.object(propsRawShape),
    })
  }
}
