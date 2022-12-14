export const getInputValue = (inputValue: any) => {
  if (typeof inputValue === 'object' || typeof inputValue === 'boolean') {
    inputValue = JSON.stringify(inputValue, null, 2)
  } else if (typeof inputValue === 'number' || typeof inputValue === 'string') {
    inputValue += ''
  }
  return inputValue
}

export const removeNewLineChars = (inputValue: any) => {
  return inputValue?.replace?.(/(\r\n|\n|\r)/gm, '')
}
