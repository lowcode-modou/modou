import CodeMirror, { Hint, Hints, Pos, cmpPos } from 'codemirror'
import { Def, Document } from 'tern'

import { ENTITY_TYPE, FieldEntityInformation } from '../common/editor-config'
import { DEFS } from '../tern/defs'
import {
  getDynamicStringSegments,
  isDynamicValue,
} from '../utils/DynamicBindingUtils'
import { AutocompleteSorter } from './AutocompleteSortRules'
import { TernWorkerServer } from './TernWorkerServer'
import { getCompletionsForKeyword } from './keywordCompletion'

export enum AutocompleteDataType {
  OBJECT = 'OBJECT',
  NUMBER = 'NUMBER',
  ARRAY = 'ARRAY',
  FUNCTION = 'FUNCTION',
  BOOLEAN = 'BOOLEAN',
  STRING = 'STRING',
  UNKNOWN = 'UNKNOWN',
}
export type Completion = Hint & {
  origin: string
  type: AutocompleteDataType | string
  data: {
    doc: string
  }
  render?: any
  isHeader?: boolean
}
interface TernDoc {
  doc: CodeMirror.Doc
  name: string
  changed: { to: number; from: number } | null
}
type TernDocs = Record<string, TernDoc>

const bigDoc = 250
const cls = 'CodeMirror-Tern-'
const hintDelay = 1700
export const typeToIcon = (type: string, isKeyword: boolean) => {
  let suffix
  if (isKeyword) suffix = 'keyword'
  else if (type === '?') suffix = 'unknown'
  else if (type === 'number' || type === 'string' || type === 'bool')
    suffix = type
  else if (/^fn\(/.test(type)) suffix = 'fn'
  else if (/^\[/.test(type)) suffix = 'array'
  else suffix = 'object'
  return cls + 'completion ' + cls + 'completion-' + suffix
}

export const getDataType = (type: string): AutocompleteDataType => {
  if (type === '?') return AutocompleteDataType.UNKNOWN
  else if (type === 'number') return AutocompleteDataType.NUMBER
  else if (type === 'string') return AutocompleteDataType.STRING
  else if (type === 'bool') return AutocompleteDataType.BOOLEAN
  else if (type === 'array') return AutocompleteDataType.ARRAY
  else if (/^fn\(/.test(type)) return AutocompleteDataType.FUNCTION
  else if (/^\[/.test(type)) return AutocompleteDataType.ARRAY
  else return AutocompleteDataType.OBJECT
}
interface RequestQuery {
  type: string
  types?: boolean
  docs?: boolean
  urls?: boolean
  origins?: boolean
  caseInsensitive?: boolean
  preferFunction?: boolean
  end?: CodeMirror.Position
  guess?: boolean
  inLiteral?: boolean
  fullDocs?: any
  lineCharPositions?: any
  start?: any
  file?: any
  includeKeywords?: boolean
  depth?: number
  sort?: boolean
}

interface ArgHints {
  start: CodeMirror.Position
  type: { args: any[]; rettype: null | string }
  name: string
  guess: boolean
  doc: CodeMirror.Doc
}

export interface DataTreeDefEntityInformation {
  type: ENTITY_TYPE
  subType: string
}

class CodeMirrorTernService {
  constructor(options: { async: boolean; defs: Def[] }) {
    this.options = options
    this.server = new TernWorkerServer(this)
  }

  server: TernWorkerServer
  options: { async: boolean; defs: Def[] }

  docs: TernDocs = Object.create(null)
  cachedArgHints: ArgHints | null = null
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  active: any
  fieldEntityInformation: FieldEntityInformation = {}
  defEntityInformation: Map<string, DataTreeDefEntityInformation> = new Map<
    string,
    DataTreeDefEntityInformation
  >()

  resetServer() {
    // this.server = new tern.Server({
    //   async: true,
    //   defs: DEFS,
    // })
    this.server = new TernWorkerServer(this)
    this.docs = Object.create(null)
  }

  complete(cm: CodeMirror.Editor) {
    cm.showHint({
      hint: this.getHint.bind(this),
      completeSingle: false,
      extraKeys: {
        Up: (cm: CodeMirror.Editor, handle: any) => {
          handle.moveFocus(-1)
          if (this.active.isHeader) {
            handle.moveFocus(-1)
          }
        },
        Down: (cm: CodeMirror.Editor, handle: any) => {
          handle.moveFocus(1)
          if (this.active.isHeader) {
            handle.moveFocus(1)
          }
        },
      },
      // closeOnPick: false,
      closeOnUnfocus: false,
    })
  }

  showType(cm: CodeMirror.Editor) {
    void this.showContextInfo(cm, 'type')
  }

  async showDocs(cm: CodeMirror.Editor) {
    try {
      const data = await this.showContextInfo(cm, 'documentation')
      if (data.url) {
        window.open(data.url, '_blank')
      }
    } catch (e) {
      console.error(e)
    }
  }

  updateDef(
    name: string,
    def?: Def,
    entityInfo?: Map<string, DataTreeDefEntityInformation>,
  ) {
    if (def) {
      // Need to remove previous def as def aren't overwritten
      this.removeDef(name)
      // addDefs doesn't work for [def] and instead works with single def
      // @ts-expect-error: Types are not available
      this.server.addDefs(def)
    } else {
      this.server.deleteDefs(name)
    }

    if (entityInfo) this.defEntityInformation = entityInfo
  }

  removeDef(name: string) {
    this.server.deleteDefs(name)
  }

  // TODO 完善 types 定义
  async requestCallback(data: any, cm: CodeMirror.Editor): Promise<Hints> {
    const doc = this.findDoc(cm.getDoc())
    const lineValue = this.lineValue(doc)
    const cursor = cm.getCursor()
    const { extraChars } = this.getFocusedDocValueAndPos(doc)

    let completions: Completion[] = []
    let after = ''
    const { end, start } = data

    const from = {
      ...start,
      ch: start.ch + extraChars,
      line: cursor.line,
    }
    const to = {
      ...end,
      ch: end.ch + extraChars,
      line: cursor.line,
    }
    if (
      cm.getRange(Pos(from.line, from.ch - 2), from) === '["' &&
      cm.getRange(to, Pos(to.line, to.ch + 2)) !== '"]'
    ) {
      after = '"]'
    }

    for (let i = 0; i < data.completions.length; ++i) {
      const completion = data.completions[i]
      let className = typeToIcon(completion.type, completion.isKeyword)
      const dataType = getDataType(completion.type)
      if (data.guess) {
        className += ' ' + cls + 'guess'
      }
      let completionText = completion.name + after
      if (dataType === 'FUNCTION') {
        completionText = completionText + '()'
      }
      const codeMirrorCompletion: Completion = {
        text: completionText,
        displayText: completionText,
        className,
        data: completion,
        origin: completion.origin,
        type: dataType,
        isHeader: false,
      }
      if (completion.isKeyword) {
        codeMirrorCompletion.render = (
          element: HTMLElement,
          self: any,
          data: any,
        ) => {
          element.setAttribute('keyword', data.displayText)
          element.innerHTML = data.displayText
        }

        const trimmedFocusedValueLength = lineValue
          .substring(0, end.ch)
          .trim().length

        /**
         * end.ch counts tab space as 1 instead of 2 space chars in string
         * For eg: lets take string `  ab`. Here, end.ch = 3 & trimmedFocusedValueLength = 2
         * hence tabSpacesCount = end.ch - trimmedFocusedValueLength
         */
        const tabSpacesCount = end.ch - trimmedFocusedValueLength
        const cursorHorizontalPos =
          tabSpacesCount * 2 + trimmedFocusedValueLength - 2

        // Add relevant keyword completions
        const keywordCompletions = getCompletionsForKeyword(
          codeMirrorCompletion,
          cursorHorizontalPos,
        )
        completions = [...completions, ...keywordCompletions]
      }
      completions.push(codeMirrorCompletion)
    }

    const shouldComputeBestMatch =
      this.fieldEntityInformation.entityType !== ENTITY_TYPE.JSACTION
    completions = AutocompleteSorter.sort(
      completions,
      this.fieldEntityInformation,
      this.defEntityInformation.get(
        this.fieldEntityInformation.entityName ?? '',
      ),
      shouldComputeBestMatch,
    )
    const indexToBeSelected =
      completions.length && completions[0].isHeader ? 1 : 0
    const obj = {
      from,
      to,
      list: completions,
      selectedHint: indexToBeSelected,
    }
    let tooltip: HTMLElement | undefined

    const handleSelect = (cur: { data: { doc: any } }, node: Element) => {
      this.active = cur
      this.remove(tooltip)
      const content = cur.data.doc
      if (content) {
        tooltip = this.makeTooltip(
          (node.parentNode as Element).getBoundingClientRect().right +
            window.pageXOffset,
          node.getBoundingClientRect().top + window.pageYOffset,
          content,
        )
        tooltip.className += ' ' + cls + 'hint-doc'

        const handleKeyup = (
          cm: CodeMirror.Editor,
          keyboardEvent: KeyboardEvent,
        ) => {
          if (
            keyboardEvent.code === 'Space' &&
            keyboardEvent.ctrlKey &&
            tooltip
          ) {
            tooltip.className += ' visible'
          }
        }

        CodeMirror.on(cm, 'keyup', handleKeyup as any)
      }
    }

    CodeMirror.on(obj, 'close', () => this.remove(tooltip))
    CodeMirror.on(obj, 'update', () => this.remove(tooltip))
    CodeMirror.on(obj, 'select', handleSelect as any)
    return obj
  }

  async getHint(cm: CodeMirror.Editor): Promise<Hints | undefined> {
    try {
      const data = await this.request(cm, {
        type: 'completions',
        types: true,
        docs: true,
        urls: true,
        origins: true,
        caseInsensitive: true,
        guess: false,
        inLiteral: true,
      })
      if (data.completions?.length === 0) {
        this.showError(cm, 'No suggestions')
        return undefined
      }
      // TODO 优化 Callback => Promise
      return this.requestCallback(data, cm)
    } catch (error) {
      this.showError(cm, String(error))
    }
  }

  async showContextInfo(
    cm: CodeMirror.Editor,
    queryName: string,
  ): Promise<ReturnType<typeof this.request>> {
    try {
      const data = await this.request(cm, { type: queryName })
      const tip = this.elt(
        'span',
        null,
        this.elt('strong', null, data.type ?? 'not found'),
      )
      if (data.doc) {
        tip.appendChild(document.createTextNode(' — ' + data.doc))
      }
      if (data.url) {
        tip.appendChild(document.createTextNode(' '))
        const child = tip.appendChild(this.elt('a', null, '[docs]'))
        // @ts-expect-error: Types are not available
        child.href = data.url

        // @ts-expect-error: Types are not available
        child.target = '_blank'
      }
      this.tempTooltip(cm, tip)
      return data
    } catch (error) {
      this.showError(cm, String(error))
      throw error
    }
  }

  async request(
    cm: CodeMirror.Editor,
    query: RequestQuery | string,
    pos?: CodeMirror.Position,
  ): Promise<{
    doc?: string
    url?: string
    type?: string
    // TODO 完善；类型
    completions?: any[]
  }> {
    const doc = this.findDoc(cm.getDoc())
    const request: Document = this.buildRequest(doc, query, pos)
    return (await this.server.request(request)) as any
  }

  findDoc(doc: CodeMirror.Doc, name?: string): TernDoc {
    for (const n in this.docs) {
      const cur = this.docs[n]
      if (cur.doc === doc) return cur
    }
    if (!name) {
      let n
      for (let i = 0; ; ++i) {
        n = '[doc' + (i || '') + ']'
        if (!this.docs[n]) {
          name = n
          break
        }
      }
    }
    return this.addDoc(name, doc)
  }

  addDoc(name: string, doc: CodeMirror.Doc) {
    const data = { doc, name, changed: null }
    this.server.addFile(name, this.getFocusedDocValueAndPos(data).value)
    CodeMirror.on(doc, 'change', this.trackChange.bind(this))
    return (this.docs[name] = data)
  }

  buildRequest(
    doc: TernDoc,
    query: Partial<RequestQuery> | string,
    pos?: CodeMirror.Position,
  ): Document {
    const files = []
    let offsetLines = 0
    if (typeof query === 'string') {
      query = { type: query }
    }
    const allowFragments = !query.fullDocs
    if (!allowFragments) {
      delete query.fullDocs
    }
    query.lineCharPositions = true
    query.includeKeywords = true
    query.depth = 0
    query.sort = true
    if (query.end == null) {
      const positions = pos ?? doc.doc.getCursor('end')
      const { end } = this.getFocusedDocValueAndPos(doc)
      query.end = {
        ...positions,
        ...end,
      }

      if (doc.doc.somethingSelected()) query.start = doc.doc.getCursor('start')
    }
    const startPos = query.start || query.end

    if (doc.changed) {
      if (
        doc.doc.lineCount() > bigDoc &&
        allowFragments &&
        doc.changed.to - doc.changed.from < 100 &&
        doc.changed.from <= startPos.line &&
        doc.changed.to > query.end.line
      ) {
        files.push(this.getFragmentAround(doc, startPos, query.end))
        query.file = '#0'
        offsetLines = files[0].offsetLines
        if (query.start != null)
          query.start = Pos(query.start.line - -offsetLines, query.start.ch)
        query.end = Pos(query.end.line - offsetLines, query.end.ch)
      } else {
        files.push({
          type: 'full',
          name: doc.name,
          text: this.getFocusedDocValueAndPos(doc).value,
        })
        query.file = doc.name
        doc.changed = null
      }
    } else {
      query.file = doc.name
      // this code is different from tern.js code
      // we noticed error `TernError: meta-vfs doesn't contain line x`
      // which was due to meta-vfs not being present for the case when a codeEditor is opened and 1st character is typed
      files.push({
        type: 'full',
        name: doc.name,
        text: this.getFocusedDocValueAndPos(doc).value,
      })
    }
    for (const name in this.docs) {
      const cur = this.docs[name]
      if (cur.changed && (cur !== doc || cur.name !== doc.name)) {
        files.push({
          type: 'full',
          name: cur.name,
          text: this.getFocusedDocValueAndPos(doc).value,
        })
        cur.changed = null
      }
    }

    // @ts-expect-error
    query.filter = false
    return {
      query: query as unknown as Document['query'],
      files: files as unknown as Document['files'],
    }
  }

  trackChange(
    doc: CodeMirror.Doc,
    change: {
      to: CodeMirror.Position
      from: CodeMirror.Position
      text: string | any[]
    },
  ) {
    const data = this.findDoc(doc)

    const argHints = this.cachedArgHints
    if (
      argHints &&
      argHints.doc === doc &&
      cmpPos(argHints.start, change.to) >= 0
    )
      this.cachedArgHints = null

    let changed = data.changed
    if (changed === null)
      data.changed = changed = { from: change.from.line, to: change.from.line }
    const end = change.from.line + (change.text.length - 1)
    if (change.from.line < changed.to)
      changed.to = changed.to - (change.to.line - end)
    if (end >= changed.to) changed.to = end + 1
    if (changed.from > change.from.line) changed.from = change.from.line

    if (doc.lineCount() > bigDoc && changed.to - changed.from > 100)
      setTimeout(() => {
        if (data.changed && data.changed.to - data.changed.from > 100)
          void this.sendDoc(data)
      }, 200)
  }

  async sendDoc(doc: TernDoc) {
    try {
      await this.server.request({
        files: [
          {
            type: 'full',
            name: doc.name,
            text: this.docValue(doc),
          },
        ],
      })
      doc.changed = null
    } catch (error) {
      window.console.error(error)
    }
  }

  lineValue(doc: TernDoc) {
    const cursor = doc.doc.getCursor()

    return doc.doc.getLine(cursor.line)
  }

  docValue(doc: TernDoc) {
    return doc.doc.getValue()
  }

  getFocusedDocValueAndPos(doc: TernDoc): {
    value: string
    end: { line: number; ch: number }
    extraChars: number
  } {
    const cursor = doc.doc.getCursor('end')
    const value = this.docValue(doc)
    const lineValue = this.lineValue(doc)
    let extraChars = 0

    const stringSegments = getDynamicStringSegments(value)
    if (stringSegments.length === 1) {
      return {
        value,
        end: {
          line: cursor.line,
          ch: cursor.ch,
        },
        extraChars,
      }
    }

    let dynamicString = value

    let newCursorLine = cursor.line
    let newCursorPosition = cursor.ch

    let currentLine = 0
    let sameLineSegmentCount = 1

    const lineValueSplitByBindingStart = lineValue.split('{{')
    const lineValueSplitByBindingEnd = lineValue.split('}}')

    for (let index = 0; index < stringSegments.length; index++) {
      // segment is divided according to binding {{}}

      const segment = stringSegments[index]
      let currentSegment = segment
      if (segment.startsWith('{{')) {
        currentSegment = segment.replace('{{', '')
        if (currentSegment.endsWith('}}')) {
          currentSegment = currentSegment.slice(0, currentSegment.length - 2)
        }
      }

      // subSegment is segment further divided by EOD char (\n)
      const subSegments = currentSegment.split('\n')
      const countEODCharInSegment = subSegments.length - 1
      const segmentEndLine = countEODCharInSegment + currentLine

      /**
       * 3 case for cursor to point inside segment
       * 1. cursor is before the {{  :-
       * 2. cursor is inside segment :-
       *    - if cursor is after {{ on same line
       *    - if cursor is after {{ in different line
       *    - if cursor is before }} on same line
       * 3. cursor is after the }}   :-
       *
       */

      const posOfBindingStart = lineValueSplitByBindingStart
        .slice(0, sameLineSegmentCount)
        .join('{{').length
      const posOfBindingClose = lineValueSplitByBindingEnd
        .slice(0, sameLineSegmentCount)
        .join('}}').length

      const isCursorInBetweenSegmentStartAndEndLine =
        cursor.line > currentLine && cursor.line < segmentEndLine

      const isCursorAtSegmentEndLine = cursor.line === segmentEndLine

      const isCursorAtSegmentStartLine = cursor.line === currentLine
      const isCursorAfterBindingOpenAtSegmentStart =
        isCursorAtSegmentStartLine && cursor.ch >= posOfBindingStart
      const isCursorBeforeBindingCloseAtSegmentEnd =
        isCursorAtSegmentEndLine && cursor.ch <= posOfBindingClose

      const isSegmentStartLineAndEndLineSame = currentLine === segmentEndLine
      const isCursorBetweenSingleLineSegmentBinding =
        isSegmentStartLineAndEndLineSame &&
        isCursorBeforeBindingCloseAtSegmentEnd &&
        isCursorAfterBindingOpenAtSegmentStart

      const isCursorPointingInsideSegment =
        isCursorInBetweenSegmentStartAndEndLine ||
        (isSegmentStartLineAndEndLineSame &&
          isCursorBetweenSingleLineSegmentBinding)

      // ;(!isSegmentStartLineAndEndLineSame &&
      //   isCursorBeforeBindingCloseAtSegmentEnd) ||
      //   isCursorAfterBindingOpenAtSegmentStart

      if (isDynamicValue(segment) && isCursorPointingInsideSegment) {
        dynamicString = currentSegment
        newCursorLine = cursor.line - currentLine
        if (lineValue.includes('{{')) {
          extraChars = posOfBindingStart + 2
        }
        newCursorPosition = cursor.ch - extraChars

        break
      }

      if (currentLine !== segmentEndLine) {
        sameLineSegmentCount = 1
      } else if (isDynamicValue(segment)) {
        sameLineSegmentCount += 1
      }

      currentLine = segmentEndLine
    }

    return {
      value: dynamicString,
      end: {
        line: newCursorLine,
        ch: newCursorPosition,
      },
      extraChars,
    }
  }

  getFragmentAround(
    data: TernDoc,
    start: CodeMirror.Position,
    end: CodeMirror.Position,
  ) {
    const doc = data.doc
    let minIndent = null
    let minLine = null
    let endLine
    const tabSize = 4
    for (let p = start.line - 1, min = Math.max(0, p - 50); p >= min; --p) {
      const line = doc.getLine(p)
      const fn = line.search(/\bfunction\b/)
      if (fn < 0) continue
      const indent = CodeMirror.countColumn(line, null, tabSize)
      if (minIndent != null && minIndent <= indent) continue
      minIndent = indent
      minLine = p
    }
    if (minLine === null) minLine = Math.max(0, start.line - 1)
    const max = Math.min(doc.lastLine(), end.line + 20)
    if (
      minIndent === null ||
      minIndent ===
        CodeMirror.countColumn(doc.getLine(start.line), null, tabSize)
    )
      endLine = max
    else
      for (endLine = end.line + 1; endLine < max; ++endLine) {
        const indent = CodeMirror.countColumn(
          doc.getLine(endLine),
          null,
          tabSize,
        )
        if (indent <= minIndent) break
      }
    const from = Pos(minLine, 0)

    return {
      type: 'part',
      name: data.name,
      offsetLines: from.line,
      text: doc.getRange(
        from,
        Pos(endLine, end.line === endLine ? undefined : 0),
      ),
    }
  }

  showError(cm: CodeMirror.Editor, msg: string) {
    this.tempTooltip(cm, String(msg))
  }

  tempTooltip(cm: CodeMirror.Editor, content: HTMLElement | string) {
    if (cm.state.ternTooltip) this.remove(cm.state.ternTooltip)
    if (cm.state.completionActive) {
      cm.closeHint()
    }
    const where = cm.cursorCoords()
    const tip = (cm.state.ternTooltip = this.makeTooltip(
      // @ts-expect-error: Types are not available
      where.right + 1,
      where.bottom,
      content,
    ))
    const maybeClear = () => {
      old = true
      if (!mouseOnTip) clear()
    }
    const clear = () => {
      cm.state.ternTooltip = null
      if (tip.parentNode) this.fadeOut(tip)
      clearActivity()
    }
    let mouseOnTip = false
    let old = false
    CodeMirror.on(tip, 'mousemove', function () {
      mouseOnTip = true
    })
    CodeMirror.on(tip, 'mouseout', ((e: MouseEvent) => {
      const related = e.relatedTarget
      // @ts-expect-error: Types are not available
      if (!related || !CodeMirror.contains(tip, related)) {
        if (old) clear()
        else mouseOnTip = false
      }
    }) as unknown as any)
    setTimeout(maybeClear, hintDelay)
    const clearActivity = this.onEditorActivity(cm, clear)
  }

  onEditorActivity(
    cm: CodeMirror.Editor,
    f: (instance: CodeMirror.Editor) => void,
  ) {
    cm.on('cursorActivity', f)
    cm.on('blur', f)
    cm.on('scroll', f)
    // @ts-expect-error
    cm.on('setDoc', f)
    return () => {
      cm.off('cursorActivity', f)
      cm.off('blur', f)
      cm.off('scroll', f)
      // @ts-expect-error
      cm.off('setDoc', f)
    }
  }

  makeTooltip(x: number, y: number, content: HTMLElement | string) {
    const node = this.elt('div', cls + 'tooltip', content)
    node.style.left = x + 'px'
    node.style.top = y + 'px'
    document.body.appendChild(node)
    return node
  }

  remove(node?: HTMLElement) {
    if (node) {
      const p = node.parentNode
      if (p) p.removeChild(node)
    }
  }

  elt(
    tagName: string,
    cls: string | null,
    content: string | HTMLElement,
  ): HTMLElement {
    const e = document.createElement(tagName)
    if (cls) e.className = cls
    if (content) {
      const eltNode =
        typeof content === 'string' ? document.createTextNode(content) : content
      e.appendChild(eltNode)
    }
    return e
  }

  fadeOut(tooltip: HTMLElement) {
    this.remove(tooltip)
  }

  setEntityInformation(entityInformation: FieldEntityInformation) {
    this.fieldEntityInformation = entityInformation
  }
}

export const createCompletionHeader = (name: string): Completion => ({
  text: name,
  displayText: name,
  className: 'CodeMirror-hint-header',
  data: { doc: '' },
  origin: '',
  type: AutocompleteDataType.UNKNOWN,
  isHeader: true,
})

export const CodeMirrorTernServiceInstance = new CodeMirrorTernService({
  async: true,
  defs: DEFS,
})
