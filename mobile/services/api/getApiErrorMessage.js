export default function getApiErrorMessage(error) {
  const responseData = error?.response?.data

  if (responseData?.errors) {
    const firstField = Object.values(responseData.errors)[0]
    if (Array.isArray(firstField) && firstField[0]) {
      return firstField[0]
    }
  }

  if (responseData?.message) {
    return responseData.message
  }

  console.log("API error:", error)
  console.log("API error:", process.env.EXPO_PUBLIC_API_URL)

  if (error?.code === "ECONNABORTED") {
    return "A solicitacao demorou demais. Tente novamente."
  }

  return "Nao foi possivel conectar a API. Verifique a URL configurada e tente novamente."
}
