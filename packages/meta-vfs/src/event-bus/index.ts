import mitt from 'mitt'

export const emitters = mitt<{ updateFileMeta?: any }>()
