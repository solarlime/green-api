import { authStore } from '../store/authStore';

const API_URL = 'https://api.green-api.com';

export interface CheckAccountResponse {
  exist: boolean;
  chatId: string;
  username?: string;
  phoneNumber: number;
  fromCache: boolean;
}

export interface CheckAccountError {
  status: boolean;
  reason?: string;
}

export interface SendMessageResponse {
  idMessage: string;
}

export interface NotificationBody {
  typeWebhook: string;
  instanceData: {
    idInstance: number;
    wid: string;
    typeInstance: string;
  };
  timestamp: number;
  idMessage: string;
  senderData: {
    chatId: string;
    sender: string;
    senderName?: string;
  };
  messageData: {
    typeMessage: string;
    textMessageData?: {
      textMessage: string;
    };
  };
}

export interface ReceiveNotificationResponse {
  receiptId: number;
  body: NotificationBody;
}

export async function receiveNotification(
  receiveTimeout: number = 30
): Promise<ReceiveNotificationResponse | null> {
  const url = `${API_URL}/waInstance${authStore.idInstance}/receiveNotification/${authStore.apiTokenInstance}?receiveTimeout=${receiveTimeout}`;

  const response = await fetch(url, {
    method: 'GET',
  });

  if (!response.ok) {
    throw new Error('Failed to receive notification');
  }

  const data = await response.json();

  return data;
}

export interface DeleteNotificationResponse {
  result: boolean;
  reason?: string;
}

export async function deleteNotification(
  receiptId: number
): Promise<DeleteNotificationResponse> {
  const url = `${API_URL}/waInstance${authStore.idInstance}/deleteNotification/${authStore.apiTokenInstance}/${receiptId}`;

  const response = await fetch(url, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to delete notification');
  }

  return response.json();
}

export async function sendMessage(
  chatId: string,
  message: string
): Promise<SendMessageResponse> {
  const url = `${API_URL}/waInstance${authStore.idInstance}/sendMessage/${authStore.apiTokenInstance}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ chatId, message }),
  });

  if (!response.ok) {
    const error: CheckAccountError = await response.json();
    throw new Error(error.reason || 'Failed to send message');
  }

  return response.json();
}

export async function checkAccount(
  phoneNumber?: number,
  username?: string
): Promise<CheckAccountResponse> {
  const url = `${API_URL}/waInstance${authStore.idInstance}/checkAccount/${authStore.apiTokenInstance}`;

  const body: { phoneNumber?: number; username?: string } = {};
  if (phoneNumber !== undefined) {
    body.phoneNumber = phoneNumber;
  }
  if (username !== undefined) {
    body.username = username;
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const error: CheckAccountError = await response.json();
    throw new Error(error.reason || 'Failed to check account');
  }

  return response.json();
}
