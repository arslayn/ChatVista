import { WebhookResponse } from '../types/chat';

const WEBHOOK_URL = 'https://hook.us2.make.com/fkonkoro556grnnaatm5o9ucxzsvtbvv';

export const sendMessageToWebhook = async (message: string): Promise<string> => {
  try {
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: message,
        question: message,
        user_input: message,
        timestamp: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Get the response as text first
    const responseText = await response.text();
    
    // Check if response is empty
    if (!responseText || !responseText.trim()) {
      return "I received your message, but got an empty response.";
    }

    // Check if it's a JSON response
    if (responseText.trim().startsWith('{') || responseText.trim().startsWith('[')) {
      try {
        const data: WebhookResponse = JSON.parse(responseText);
        
        // Try to extract the response from various possible fields
        const botResponse = data.response || data.message || data.reply || data.answer;
        
        if (botResponse) {
          return botResponse;
        }
        
        // If no recognized fields, return the whole response as string
        return responseText;
        
      } catch (jsonError) {
        console.error('JSON parsing error:', jsonError);
        return "I received a response, but couldn't parse it properly. Please check your webhook configuration.";
      }
    }

    // Handle plain text responses (like your markdown content)
    const trimmedResponse = responseText.trim();
    
    // Handle common webhook status responses
    if (trimmedResponse.toLowerCase() === 'accepted') {
      return "Your message was received! The system is processing it, but no response was generated yet. Please check your Make.com scenario configuration.";
    }
    
    // For any other text response (including markdown), return it directly
    return trimmedResponse;
    
  } catch (error) {
    console.error('Webhook error:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('fetch')) {
        return "I'm having trouble connecting right now. Please try again in a moment.";
      }
    }
    
    return "Sorry, I encountered an error while processing your message. Please try again.";
  }
};