export function getErrorMessage(
  statusCode?: number | string,
  errorField?: string,
): string {
  const statusCodeMessage = statusCode != null ? `Status code "${statusCode}".` : null
  const errorFieldMessage = errorField != null ? `Error field "${errorField}".` : null

  const errorMessageArray = [
    statusCodeMessage,
    errorFieldMessage,
  ].filter((message) => {
    return message != null
  })

  return errorMessageArray.join(' ')
}
