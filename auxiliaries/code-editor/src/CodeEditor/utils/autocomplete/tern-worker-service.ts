import { Def, Server } from 'tern'

import { CallbackFn, TernWorkerActionEnum } from './types'

const ternWorker = new Worker(
  new URL('../../workers/tern.worker.ts', import.meta.url),
  {
    name: 'TernWorker',
    type: 'module',
  },
)

function getFile(ts: any, name: string, c: CallbackFn) {
  const buf = ts.docs[name]
  if (buf) c(ts.docValue(ts, buf))
  else if (ts.options.getFile) ts.options.getFile(name, c)
  else c(null)
}

interface TernWorkerServerConstructor {
  (ts: any): void
  new (ts: any): Server
}

function TernWorkerServer(this: any, ts: any) {
  const worker = (ts.worker = ternWorker)
  worker.postMessage({
    type: TernWorkerActionEnum.INIT,
    defs: ts.options.defs,
    plugins: ts.options.plugins,
    scripts: ts.options.workerDeps,
  })
  let msgId = 0
  let pending: { [x: number]: CallbackFn } = {}

  function send(data: any, c?: CallbackFn) {
    if (c) {
      data.id = ++msgId
      pending[msgId] = c
    }
    worker.postMessage(data)
  }
  worker.onmessage = function (e) {
    const data = e.data
    if (data.type === TernWorkerActionEnum.GET_FILE) {
      getFile(ts, data.name, function (err, text) {
        send({
          type: TernWorkerActionEnum.GET_FILE,
          err: String(err),
          text: text,
          id: data.id,
        })
      })
    } else if (data.type === TernWorkerActionEnum.DEBUG) {
      window.console.log(data.message)
    } else if (data.id && pending[data.id]) {
      pending[data.id](data.err, data.body)
      Reflect.deleteProperty(pending, data.id)
    }
  }
  worker.onerror = function (e) {
    for (const id in pending) pending[id](e)
    pending = {}
  }

  this.addFile = function (name: string, text: string) {
    send({ type: TernWorkerActionEnum.ADD_FILE, name: name, text: text })
  }
  this.delFile = function (name: string) {
    send({ type: TernWorkerActionEnum.DELETE_FILE, name: name })
  }
  this.request = function (body: any, c: CallbackFn) {
    send({ type: TernWorkerActionEnum.REQUEST, body: body }, c)
  }
  this.addDefs = function (defs: Def) {
    send({ type: TernWorkerActionEnum.ADD_DEF, defs })
  }
  this.deleteDefs = function (name: string) {
    send({ type: TernWorkerActionEnum.DELETE_DEF, name })
  }
}

export default TernWorkerServer as TernWorkerServerConstructor
