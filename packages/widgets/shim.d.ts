import 'react'

declare module 'react' {
  interface Attributes {
    ['data-widget-id']?: string
    ['data-widget-slot-name']?: string
  }
}
