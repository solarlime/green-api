import { authStore } from '../store/authStore'

const API_URL = 'https://api.green-api.com'

export interface CheckAccountResponse {
  exist: boolean
  chatId: string
  username?: string
  phoneNumber: number
  fromCache: boolean
}

export interface CheckAccountError {
  status: boolean
  reason?: string
}

export async function checkAccount(phoneNumber?: number, username?: string): Promise<CheckAccountResponse> {
  const url = `${API_URL}/waInstance${authStore.idInstance}/checkAccount/${authStore.apiTokenInstance}`

  const body: { phoneNumber?: number; username?: string } = {}
  if (phoneNumber !== undefined) {
    body.phoneNumber = phoneNumber
  }
  if (username !== undefined) {
    body.username = username
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    const error: CheckAccountError = await response.json()
    throw new Error(error.reason || 'Failed to check account')
  }

  return response.json()
}
