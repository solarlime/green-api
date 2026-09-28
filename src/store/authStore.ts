import { makeAutoObservable } from 'mobx'
import { chatStore } from './chatStore'

class AuthStore {
  idInstance: string = ''
  apiTokenInstance: string = ''

  constructor() {
    makeAutoObservable(this)

    // Load from localStorage if available
    const savedId = localStorage.getItem('idInstance')
    const savedToken = localStorage.getItem('apiTokenInstance')

    if (savedId) this.idInstance = savedId
    if (savedToken) this.apiTokenInstance = savedToken
  }

  setCredentials(idInstance: string, apiTokenInstance: string) {
    this.idInstance = idInstance
    this.apiTokenInstance = apiTokenInstance

    // Persist to localStorage
    localStorage.setItem('idInstance', idInstance)
    localStorage.setItem('apiTokenInstance', apiTokenInstance)
  }

  clearCredentials() {
    this.idInstance = ''
    this.apiTokenInstance = ''

    localStorage.removeItem('idInstance')
    localStorage.removeItem('apiTokenInstance')

    // Stop polling
    chatStore.stopPolling()
  }

  get isAuthenticated(): boolean {
    return !!this.idInstance && !!this.apiTokenInstance
  }
}

export const authStore = new AuthStore()
