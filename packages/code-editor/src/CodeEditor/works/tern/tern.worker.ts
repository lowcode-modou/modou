import { head, last } from 'lodash'
import tern, { Def, Server } from 'tern'

import { CallbackFn, TernWorkerAction } from '../../autocomplete/types'

let server: Server

let nextId = 0
const pending: { [x: number]: CallbackFn } = {}

const startServer = (defs: Def[], plugins = {}, scripts?: string[]) => {
  if (scripts) self.importScripts.apply(null, scripts)

  server = new tern.Server({
    getFile,
    async: true,
    defs,
    plugins,
  })
}

const HEAD_EXPRESSION_REG = /^{{((\n|.)*)}}$/
self.onmessage = (e) => {
  const data = e.data
  switch (data.type) {
    case TernWorkerAction.INIT:
      return startServer(data.defs, data.plugins, data.scripts)
    case TernWorkerAction.ADD_FILE:
      return server.addFile(data.name, data.text)
    case TernWorkerAction.DELETE_FILE:
      return server.delFile(data.name)
    case TernWorkerAction.REQUEST:
      return server.request(data.body, (err, resData: any) => {
        // let searchVal =
        //   last(
        //     ((head(e.data.body.files) as { text: string }).text ?? '').split(
        //       '.',
        //     ),
        //   ) ?? ''
        // if (HEAD_EXPRESSION_REG.test(searchVal)) {
        //   searchVal = searchVal.match(HEAD_EXPRESSION_REG)?.[1] ?? ''
        // }
        // if (resData) {
        //   resData.completions = resData.completions.filter((item: any) =>
        //     item.name.includes(searchVal),
        //   )
        // }
        postMessage({ id: data.id, body: resData, err: err && String(err) })
      })
    case TernWorkerAction.GET_FILE: {
      const c = pending[data.id]
      Reflect.deleteProperty(pending, data.id)
      return c(data.err, data.text)
    }
    case TernWorkerAction.DELETE_DEF:
      return server.deleteDefs(data.name)
    case TernWorkerAction.ADD_DEF:
      return server.addDefs(data.defs)
    default:
      throw new Error('Unknown message type: ' + data.type)
  }
}

const getFile = (file: string, c: CallbackFn) => {
  postMessage({ type: TernWorkerAction.GET_FILE, name: file, id: ++nextId })
  pending[nextId] = c
}

const _consoleLog = self.console.log
self.console = {
  ...self.console,
  log(...args) {
    _consoleLog(...args)
    // TODO 传递全部的args
    postMessage({ type: TernWorkerAction.DEBUG, message: args[0] })
  },
}
