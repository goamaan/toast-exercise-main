const errorMessageMap = {
  "server error": "Received a server error. Please try again.",
}

export const errorMessage = (message) => errorMessageMap[message] ?? message
