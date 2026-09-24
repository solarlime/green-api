import { useState } from 'react'
import { observer } from 'mobx-react-lite'
import { X } from '@phosphor-icons/react'
import { checkAccount } from '../services/greenApi'
import { chatStore } from '../store/chatStore'
import './AddChatModal.css'

interface AddChatModalProps {
  isOpen: boolean
  onClose: () => void
}

const AddChatModal = observer(({ isOpen, onClose }: AddChatModalProps) => {
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const trimmedInput = input.trim()

    if (!trimmedInput) {
      setError('Введите номер телефона или username')
      return
    }

    setIsLoading(true)

    try {
      let result

      if (trimmedInput.startsWith('@')) {
        // Parse as username
        const username = trimmedInput
        result = await checkAccount(undefined, username)
      } else {
        // Parse as phone number
        const phoneNum = parseInt(trimmedInput.replace(/\D/g, ''))
        if (isNaN(phoneNum) || trimmedInput.replace(/\D/g, '').length < 11) {
          setError('Введите номер телефона в международном формате (11-12 цифр)')
          setIsLoading(false)
          return
        }
        result = await checkAccount(phoneNum)
      }

      if (result.exist) {
        chatStore.addChat({
          id: result.chatId,
          phoneNumber: result.phoneNumber,
          username: result.username,
        })
        chatStore.selectChat(result.chatId)
        onClose()
        setInput('')
      } else {
        setError('Аккаунт Telegram не найден')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка при проверке')
    } finally {
      setIsLoading(false)
    }
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal-content">
        <div className="modal-header">
          <h2>Введите номер телефона или username</h2>
          <button className="modal-close" onClick={onClose}>
            <X size={20} weight="bold" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="79991234567 или @username"
              disabled={isLoading}
            />
            <small>Номер телефона (11-12 цифр) или username с @</small>
          </div>
          {error && <div className="modal-error">{error}</div>}
          <button type="submit" className="modal-submit" disabled={isLoading}>
            {isLoading ? 'Проверка...' : 'Начать чат'}
          </button>
        </form>
      </div>
    </div>
  )
})

export default AddChatModal
