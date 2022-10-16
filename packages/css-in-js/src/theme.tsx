import {
  ThemeProvider as ThemeProvider_,
  useTheme as useTheme_,
} from '@emotion/react'
import { theme } from 'antd'
import { FC, ReactNode, useMemo } from 'react'

interface MDTheme {
  colorPrimary: string
  colorError: string
}

interface ThemeProviderProps {
  // theme: Partial<MDTheme> | ((outerTheme: MDTheme) => MDTheme)
  children: ReactNode
}

export const ThemeProvider: FC<ThemeProviderProps> = ({ children }) => {
  const { token } = theme.useToken()
  const mdTheme = useMemo<MDTheme>(() => {
    return {
      colorPrimary: token.colorPrimary,
      colorError: token.colorError,
    }
  }, [token])
  return <ThemeProvider_ theme={mdTheme}>{children}</ThemeProvider_>
}
export const useTheme = (): MDTheme => {
  return useTheme_() as unknown as MDTheme
}
