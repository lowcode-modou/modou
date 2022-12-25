export const getEntityNameAndPropertyPath = (
  fullPath: string,
): {
  entityName: string
  propertyPath: string
} => {
  const indexOfFirstDot = fullPath.indexOf('.')
  if (indexOfFirstDot === -1) {
    // No dot was found so path is the entity name itself
    return {
      entityName: fullPath,
      propertyPath: '',
    }
  }
  const entityName = fullPath.substring(0, indexOfFirstDot)
  const propertyPath = fullPath.substring(indexOfFirstDot + 1)
  return { entityName, propertyPath }
}
