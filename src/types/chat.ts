export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export interface WebhookResponse {
  response?: string;
  message?: string;
  reply?: string;
  answer?: string;
}