import mitt from 'mitt'

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
type Events = {
  // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
  onWidgetElementChange: void
}

export const emitter = mitt<Events>()
