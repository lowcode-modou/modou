import {
  InterpolationNode,
  SimpleExpressionNode,
  TextNode,
  baseParse,
} from '@vue/compiler-core'
import { mapValues, omit } from 'lodash'

import { WidgetBaseProps } from '@modou/core'
import { isExpression } from '@modou/evaluate'
import {
  computed,
  makeObservable,
  observable,
  runInAction,
} from '@modou/reactivity'
import { ParseNodeTypes } from '@modou/render/src/types'

import { BaseFile, BaseFileMete } from '../BaseFile'
import { PageFile } from '../PageFile'
import { FileTypeEnum } from '../types'

type MetaPath = string

enum MetaDepTypeEnum {
  Widget,
}

// interface MetaDep {
//   type: MetaDepTypeEnum
//   path: string
// }
interface MetaValExpression {
  type: 'Expression'
  raw: string
  ast: ReturnType<typeof baseParse>
  evalString: string
}

interface MetaValNormal {
  type: 'Normal'
  raw: any
}
type MetaVal = MetaValExpression | MetaValNormal

export type WidgetFileMeta = BaseFileMete<WidgetBaseProps>

export class WidgetFile extends BaseFile<{}, WidgetFileMeta, PageFile> {
  protected constructor(meta: WidgetFileMeta, parentFile: PageFile) {
    super({ fileType: FileTypeEnum.Widget, meta, parentFile })
    makeObservable(this, {
      subFileMap: observable,
      // depMap: computed.struct,
      flattenedMetaValMap: computed.struct,
    })
  }

  get flattenedMetaValMap(): Record<MetaPath, MetaVal> {
    return mapValues<typeof this.meta.props, MetaVal>(
      this.meta.props,
      (value) => {
        if (isExpression(value)) {
          const ast = baseParse(value)
          return {
            type: 'Expression',
            raw: value,
            ast,
            evalString: `\`${ast.children
              .map((item) => {
                // @ts-expect-error
                if (item.type === ParseNodeTypes.TEXT) {
                  return (item as unknown as TextNode).content
                  // @ts-expect-error
                } else if (item.type === ParseNodeTypes.INTERPOLATION) {
                  const content = (
                    (item as unknown as InterpolationNode)
                      .content as unknown as SimpleExpressionNode
                  ).content
                  if (content) {
                    return `\${${content}}`
                  }
                  return ''
                }
                // TODO 适配其他类型
                return item.loc.source
              })
              .join('')}\``,
          }
        } else {
          return {
            type: 'Normal',
            raw: value,
          }
        }
      },
    )
  }

  // TODO state 修改为主动 watch dep
  // 按钮-{{colDSL.span}}
  // get depMap(): Record<MetaPath, MetaDep> {
  //   return mapValues(
  //     pickBy(
  //       flatten<Record<string, any>, Record<string, any>>(this.meta.props),
  //       (value) => isExpression(value),
  //     ),
  //     (value) => ({
  //       type: MetaDepTypeEnum.Widget,
  //       path: value,
  //     }),
  //   )
  // }

  subFileMap = {}

  toJSON() {
    return {
      ...this.meta,
      ...this.subFileMapToJson(),
      fileType: this.fileType,
    }
  }

  static create(meta: Omit<WidgetFileMeta, 'version'>, parentFile: PageFile) {
    return runInAction(() => {
      const widgetFile = new WidgetFile(
        {
          ...meta,
          version: '0.0.1',
        },
        parentFile,
      )
      parentFile.widgets.push(widgetFile)
      return widgetFile
    })
  }

  static formJSON(
    json: ReturnType<WidgetFile['toJSON']>,
    parentFile: PageFile,
  ): WidgetFile {
    return WidgetFile.create(omit(json, 'fileType'), parentFile)
  }
}
