import { Def } from 'tern'

import {
  CallbackFn,
  TernWorkerAction,
} from '@modou/code-editor/CodeEditor/autocomplete/types'

const ternWorker = new Worker(
  new URL('../works/Tern/tern.worker.ts', import.meta.url),
  {
    name: 'tern.worker',
    type: 'module',
  },
)

const getFile = async (ts: any, name: string): Promise<any> => {
  return new Promise((resolve) => {
    const buf = ts.docs[name]
    if (buf) {
      resolve(ts.docValue(ts, buf))
    } else if (ts.options.getFile) {
      ts.options.getFile(name, resolve)
    } else {
      resolve(null)
    }
  })
}
export class TernWorkerServer {
  // FIXME 修复类型
  constructor(ts: any) {
    // ts.worker = ternWorker
    this.worker.postMessage({
      type: TernWorkerAction.INIT,
      defs: ts.options.defs,
      plugins: ts.options.plugins,
      scripts: ts.options.workerDeps,
    })
    this.worker.onmessage = async (e) => {
      const data = e.data
      if (data.type === TernWorkerAction.GET_FILE) {
        try {
          const text = await getFile(ts, data.name)
          this.send({
            type: TernWorkerAction.GET_FILE,
            text,
            id: data.id,
          })
        } catch (err) {
          this.send({
            type: TernWorkerAction.GET_FILE,
            err: String(err),
            id: data.id,
          })
        }
      } else if (data.type === TernWorkerAction.DEBUG) {
        window.console.log(data.message)
      } else if (data.id && this.pending[data.id]) {
        this.pending[data.id](data.err, data.body)
        Reflect.deleteProperty(this.pending, data.id)
      }
    }
    this.worker.onerror = (e) => {
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

  async request(body: any) {
    return new Promise((resolve, reject) => {
      this.send({ type: TernWorkerAction.REQUEST, body }, (err, res) => {
        if (err) {
          reject(err)
        } else {
          resolve(res)
        }
      })
    })
  }

  addDefs(defs: Def[]) {
    this.send({ type: TernWorkerAction.ADD_DEF, defs })
  }

  deleteDefs(name: string) {
    this.send({ type: TernWorkerAction.DELETE_DEF, name })
  }
}
