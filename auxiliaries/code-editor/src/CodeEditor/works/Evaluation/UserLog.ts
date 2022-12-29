import { klona } from 'klona/full'
import moment from 'moment'
import { nanoid } from 'nanoid'

import { EventType } from '@modou/code-editor/CodeEditor/constants/AppsmithActionConstants/ActionConstants'
import { TriggerMeta } from '@modou/code-editor/CodeEditor/sagas/ActionExecution/ActionExecutionSagas'
import {
  _internalClearTimeout,
  _internalSetTimeout,
} from '@modou/code-editor/CodeEditor/works/Evaluation/TimeoutOverride'

import { LogObject, Methods, Severity } from '../../entities/AppsmithConsole'

class UserLog {
  private readonly flushLogsTimerDelay = 0
  private logs: LogObject[] = []
  private flushLogTimerId: number | undefined
  private requestInfo: {
    requestId?: string
    eventType?: EventType
    triggerMeta?: TriggerMeta
  } | null = null

  public setCurrentRequestInfo(requestInfo: {
    requestId?: string
    eventType?: EventType
    triggerMeta?: TriggerMeta
  }) {
    this.requestInfo = requestInfo
  }

  private resetFlushTimer() {
    if (this.flushLogTimerId) _internalClearTimeout(this.flushLogTimerId)
    this.flushLogTimerId = _internalSetTimeout(() => {
      const logs = this.flushLogs()
      self.postMessage({
        promisified: true,
        responseData: {
          logs,
          eventType: this.requestInfo?.eventType,
          triggerMeta: this.requestInfo?.triggerMeta,
        },
        requestId: this.requestInfo?.requestId,
      })
    }, this.flushLogsTimerDelay)
  }

  private saveLog(method: Methods, data: any[]) {
    const parsed = this.parseLogs(method, data)
    this.logs.push(parsed)
    this.resetFlushTimer()
  }

  public overrideConsoleAPI() {
    const { debug, error, info, log, table, warn } = console
    // eslint-disable-next-line no-global-assign
    console = {
      ...console,
      table: (...args: any) => {
        table.call(this, args)
        this.saveLog('table', args)
      },
      error: (...args: any) => {
        error.apply(this, args)
        this.saveLog('error', args)
      },
      log: (...args: any) => {
        log.apply(this, args)
        this.saveLog('log', args)
      },
      debug: (...args: any) => {
        debug.apply(this, args)
        this.saveLog('debug', args)
      },
      warn: (...args: any) => {
        warn.apply(this, args)
        this.saveLog('warn', args)
      },
      info: (...args: any) => {
        info.apply(this, args)
        this.saveLog('info', args)
      },
    }
  }

  private replaceFunctionWithNamesFromObjects(data: any) {
    if (typeof data === 'function') return `func() ${data.name}`
    if (!data || typeof data !== 'object') return data
    if (data instanceof Promise) return 'Promise'
    const acc: any =
      Object.prototype.toString.call(data) === '[object Array]' ? [] : {}
    return Object.keys(data).reduce((acc, key) => {
      acc[key] = this.replaceFunctionWithNamesFromObjects(data[key])
      return acc
    }, acc)
  }

  // iterates over the data and if data is object/array, then it will remove any functions from it
  private sanitizeData(data: any): any {
    try {
      const returnData = this.replaceFunctionWithNamesFromObjects(data)
      return returnData
    } catch (e) {
      return [`There was some error: ${e} ${JSON.stringify(data)}`]
    }
  }

  // returns the logs from the function execution after sanitising them and resets the logs object after that
  public flushLogs(): LogObject[] {
    const sanitisedLogs = this.logs.map((log) => {
      return {
        ...log,
        data: this.sanitizeData(log.data),
      }
    })
    this.resetLogs()
    return sanitisedLogs
  }

  // parses the incoming log and converts it to the log object
  public parseLogs(method: Methods, data: any[]): LogObject {
    // Create an ID
    const id = nanoid()
    const timestamp = moment().format('hh:mm:ss')
    // Parse the methods
    let output = data
    // For logs UI we only keep 3 levels of severity, info, warn, error
    let severity = Severity.INFO
    if (method === 'error') {
      severity = Severity.ERROR
      output = data.map((error) => {
        try {
          return error.stack || error
        } catch (e) {
          return error
        }
      })
    } else if (method === 'warn') {
      severity = Severity.WARNING
    }

    return {
      method,
      id,
      data: klona(output),
      timestamp,
      severity,
    }
  }

  public resetLogs() {
    this.logs = []
  }
}

export const userLogs = new UserLog()
