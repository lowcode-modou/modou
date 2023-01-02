// import { baseParse, generate, transform } from '@vue/compiler-core'
// import { Button } from 'antd'
import { effect, reactive } from '@vue/reactivity'
import { Button } from 'antd'
import { flatten } from 'flat'
import { parse } from 'handlebars'
import { get, set } from 'lodash'
import React, { type FC } from 'react'

enum AST_NODE_TYPE {
  ContentStatement = 'ContentStatement',
  MustacheStatement = 'MustacheStatement',
}

const EXPRESSION_REG = /[\s\S]*{{[\s\S]*}}[\s\S]*/m

const isExpression = (str: unknown) => {
  return typeof str === 'string' && EXPRESSION_REG.test(str)
}

const modou = {
  mode: 'EDIT',
  version: '1.0.0',
}

const props = reactive({
  Button1: {
    title: '我是Button1的title>>>{{Text1.value}}',
    style: {
      color: '我是Button1的color',
    },
  },
  Text1: {
    value: '我是Text1的value>>>{{Input1.value}}',
  },
  Input1: {
    value: '我是Input1的value',
  },
})

const store = reactive({
  state: {},
})

// step 初始化 state

effect(() => {
  console.log('state.Button1.title', get(store.state, 'Button1.title'))
})
effect(() => {
  console.log(
    'state.Button1.style.color',
    get(store.state, 'Button1.style.color'),
  )
})
effect(() => {
  console.log('state.Text1', get(store.state, 'Text1.value'))
})

// step 1

// eslint-disable-next-line no-template-curly-in-string
// const TEMPLATE_STR = '{{Button1.text}}-<div>123</div>-{{`测试${Button2.text}`}}'

const evalExpression = (expression: string) => {
  // eslint-disable-next-line @typescript-eslint/no-implied-eval,no-new-func,no-useless-call
  return new Function(
    'state',
    `with(state){
      return ${expression}
    }`,
  ).call(null, store.state)
}

effect(() => {
  const fState: Record<string, any> = flatten(store.state)
  // 初始化state和expression的关系
  // 增加和删除state的时候要做这一步
  Object.entries(fState).forEach(([path, value]) => {
    effect(() => {
      const rawPropVal = get(props, path)
      if (isExpression(rawPropVal)) {
        const ast = parse(rawPropVal)
        const expression = `\`${ast.body
          .map((item) => {
            if (item.type === AST_NODE_TYPE.ContentStatement) {
              return (item as unknown as hbs.AST.ContentStatement).value
            } else if (item.type === AST_NODE_TYPE.MustacheStatement) {
              return `\${${
                (
                  (item as unknown as hbs.AST.MustacheStatement)
                    .path as unknown as hbs.AST.PathExpression
                ).original
              }}`
            }
            // TODO 适配其他类型
            return ''
          })
          .join('')}\``
        set(store.state, path, evalExpression(expression))
      } else {
        set(store.state, path, rawPropVal)
      }
    })
  })
})

export const Foo: FC<{
  title: string
}> = ({ title }) => {
  const test = () => {
    set(store.state, 'Input1.value', 'Input1-value-' + Math.random())
    console.log(store.state)
  }
  return (
    <div>
      <Button type="primary" onClick={test}>
        测试
      </Button>
    </div>
  )
}
