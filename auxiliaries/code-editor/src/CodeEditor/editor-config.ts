export enum CodeEditorModeEnum {
  Text = 'text/plain',
  SQL = 'sql',
  TextWithJs = 'text-js',
  Json = 'application/json',
  JsonWithJs = 'json-js',
  SQLWithJs = 'sql-js',
  Javascript = 'javascript',
  Graphql = 'graphql',
  GraphqlWithJs = 'graphql-js',
}

export enum CodeEditorThemeEnum {
  Light = 'LIGHT',
  Dark = 'DARK',
}

export enum CodeEditorTabBehaviourEnum {
  Input = 'INPUT',
  Indent = 'INDENT',
}

export enum CodeEditorSizeEnum {
  Compact = 'COMPACT',
  Extended = 'EXTENDED',
}

export const CodeEditorThemes: Record<CodeEditorThemeEnum, string> = {
  [CodeEditorThemeEnum.Light]: 'duotone-light',
  [CodeEditorThemeEnum.Dark]: 'duotone-dark',
}

export enum CodeEditorBorder {
  NONE = 'none',
  ALL_SIDE = 'all-side',
  BOTTOM_SIDE = 'bottom-side',
}

export enum AutocompleteCloseKeyEnum {
  Enter,
  Tab,
  Escape,
  Comma,
  Semicolon,
  Space,
  Delete,
  'Ctrl+Backspace',
  OSLeft,
  '(',
  ')',
}
