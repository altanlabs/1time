import axios from 'axios';
import CryptoJS from 'crypto-js';

const API_BASE_URL = 'https://api.altan.ai/galaxia/hook/S4e4SK';

interface CreateMessageResponse {
  id: string;
  link: string;
}

interface Message {
  encrypted_content: string;
  created_at: string;
  expires_at: string;
  viewed: boolean;
  view_count: number;
}

export const encryptMessage = (message: string): string => {
  const key = CryptoJS.lib.WordArray.random(256/8);
  const encrypted = CryptoJS.AES.encrypt(message, key.toString());
  return encrypted.toString() + '.' + key.toString();
};

export const decryptMessage = (encryptedData: string): string => {
  const [encrypted, key] = encryptedData.split('.');
  const decrypted = CryptoJS.AES.decrypt(encrypted, key);
  return decrypted.toString(CryptoJS.enc.Utf8);
};

export const createMessage = async (content: string): Promise<CreateMessageResponse> => {
  try {
    const encrypted = encryptMessage(content);
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

    const response = await axios.post(`${API_BASE_URL}/messages`, {
      encrypted_content: encrypted,
      expires_at: expiresAt,
      viewed: false,
      view_count: 0,
      deleted: false
    });

    if (!response.data || !response.data.id) {
      throw new Error('Invalid response from server');
    }

    // Get the current origin (protocol + hostname + port if any)
    const origin = window.location.origin;
    const messageId = response.data.id;
    const fullLink = `${origin}/view/${messageId}`;

    return {
      id: messageId,
      link: fullLink
    };
  } catch (error) {
    console.error('Error creating message:', error);
    throw error;
  }
};

export const getMessage = async (id: string): Promise<string> => {
  try {
    const response = await axios.get<Message>(`${API_BASE_URL}/messages/${id}`);
    
    if (!response.data || response.data.viewed) {
      throw new Error('Message not found or already viewed');
    }

    const decryptedMessage = decryptMessage(response.data.encrypted_content);

    // Mark as viewed and delete
    await axios.patch(`${API_BASE_URL}/messages/${id}`, {
      viewed: true,
      view_count: response.data.view_count + 1
    });

    // Delete the message
    await deleteMessage(id);

    return decryptedMessage;
  } catch (error) {
    console.error('Error retrieving message:', error);
    throw error;
  }
};

export const deleteMessage = async (id: string): Promise<void> => {
  try {
    await axios.delete(`${API_BASE_URL}/messages/${id}`);
  } catch (error) {
    console.error('Error deleting message:', error);
    throw error;
  }
};