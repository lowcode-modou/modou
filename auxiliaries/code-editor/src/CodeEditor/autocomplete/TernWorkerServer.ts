import { Def, Server } from 'tern'

import {
  CallbackFn,
  TernWorkerAction,
} from '@modou/code-editor/CodeEditor/autocomplete/types'

const ternWorker = new Worker(
  new URL('../works/tern/tern.worker.ts', import.meta.url),
  {
    name: 'tern.worker',
    type: 'module',
  },
)

const getFile = (ts: any, name: string, c: CallbackFn) => {
  const buf = ts.docs[name]
  if (buf) c(ts.docValue(ts, buf))
  else if (ts.options.getFile) ts.options.getFile(name, c)
  else c(null)
}
export class TernWorkerServer implements Partial<Server> {
  // FIXME 修复类型
  constructor(ts: any) {
    // ts.worker = ternWorker
    this.worker.postMessage({
      type: TernWorkerAction.INIT,
      defs: ts.options.defs,
      plugins: ts.options.plugins,
      scripts: ts.options.workerDeps,
    })
    this.worker.onmessage = (e) => {
      const data = e.data
      if (data.type === TernWorkerAction.GET_FILE) {
        getFile(ts, data.name, (err, text) => {
          this.send({
            type: TernWorkerAction.GET_FILE,
            err: String(err),
            text,
            id: data.id,
          })
        })
      } else if (data.type === TernWorkerAction.DEBUG) {
        window.console.log(data.message)
      } else if (data.id && this.pending[data.id]) {
        this.pending[data.id](data.err, data.body)
        Reflect.deleteProperty(this.pending, data.id)
      }
    }
    this.worker.onerror = (e) => {
      console.log('__CallbackFn__onerror')
      for (const id in this.pending) {
        this.pending[id](e)
      }
      this.pending = {}
    }
  }

  private readonly worker: Worker = ternWorker

  private msgId = 0
  private pending: { [x: number]: CallbackFn } = {}
  private send(data: any, c?: CallbackFn) {
    if (c) {
      data.id = ++this.msgId
      this.pending[this.msgId] = c
    }
    this.worker.postMessage(data)
  }

  addFile(name: string, text: string) {
    this.send({ type: TernWorkerAction.ADD_FILE, name, text })
  }

  delFile(name: string) {
    this.send({ type: TernWorkerAction.DELETE_FILE, name })
  }

  request(body: any, c: CallbackFn) {
    this.send({ type: TernWorkerAction.REQUEST, body }, c)
  }

  addDefs(defs: Def[]) {
    this.send({ type: TernWorkerAction.ADD_DEF, defs })
  }

  deleteDefs(name: string) {
    this.send({ type: TernWorkerAction.DELETE_DEF, name })
  }
}
