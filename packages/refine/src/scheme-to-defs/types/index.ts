export type MDTernDefs = {
  '!doc'?: string
  '!type'?: string
  '!url'?: string
  '!define'?: Record<string, MDTernDefs>
  '!name'?: string
} & {
  // [k: string]: MDTernDefs
  [K in `!${string}`]?: string
} & {
  // TODO 定义 非特定字符串开头
  // https://stackoverflow.com/questions/73306648/typescript-type-for-object-key-to-not-start-with-specific-character
  [K in `!!${string}`]?: MDTernDefs
}

export interface MixedMDTernDefs {
  defs: MDTernDefs
  scopedDefs?: Record<string, MDTernDefs>
}
