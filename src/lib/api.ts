import axios from 'axios';
import CryptoJS from 'crypto-js';

const API_BASE_URL = 'https://api.altan.ai/galaxia/hook/S4e4SK';

interface CreateMessageResponse {
  id: string;
  link: string;
}

interface Message {
  id: string;
  encrypted_content: string;
  created_at: string;
  expires_at: string;
  viewed: boolean;
  view_count: number;
  deleted: boolean;
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

    const response = await axios.post<Message>(`${API_BASE_URL}/messages`, {
      encrypted_content: encrypted,
      expires_at: expiresAt,
      viewed: false,
      view_count: 0,
      deleted: false
    });

    if (!response.data || !response.data.id) {
      throw new Error('Failed to create message');
    }

    // Construct the full URL using window.location
    const baseUrl = window.location.origin;
    const link = `${baseUrl}/view/${response.data.id}`;

    return {
      id: response.data.id,
      link: link
    };
  } catch (error) {
    console.error('Error creating message:', error);
    throw new Error('Failed to create secure message');
  }
};

export const getMessage = async (id: string): Promise<string> => {
  try {
    const response = await axios.get<Message>(`${API_BASE_URL}/messages/${id}`);
    
    if (!response.data || response.data.deleted || response.data.viewed) {
      throw new Error('Message not found or already viewed');
    }

    const decryptedMessage = decryptMessage(response.data.encrypted_content);

    // Mark as viewed and increment view count
    await axios.patch(`${API_BASE_URL}/messages/${id}`, {
      viewed: true,
      view_count: response.data.view_count + 1,
      deleted: true // Delete immediately after viewing
    });

    return decryptedMessage;
  } catch (error) {
    console.error('Error retrieving message:', error);
    throw new Error('Failed to retrieve message');
  }
};

export const deleteMessage = async (id: string): Promise<void> => {
  try {
    await axios.patch(`${API_BASE_URL}/messages/${id}`, {
      deleted: true
    });
  } catch (error) {
    console.error('Error deleting message:', error);
    throw new Error('Failed to delete message');
  }
};