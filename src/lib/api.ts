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
  const encrypted = encryptMessage(content);
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

  const response = await axios.post(`${API_BASE_URL}/messages`, {
    encrypted_content: encrypted,
    expires_at: expiresAt,
  });

  return {
    id: response.data.id,
    link: `${window.location.origin}/view/${response.data.id}`,
  };
};

export const getMessage = async (id: string): Promise<string> => {
  const response = await axios.get<Message>(`${API_BASE_URL}/messages/${id}`);
  
  if (response.data.viewed) {
    throw new Error('This message has already been viewed');
  }

  // Mark as viewed
  await axios.patch(`${API_BASE_URL}/messages/${id}`, {
    viewed: true,
    view_count: response.data.view_count + 1,
  });

  return decryptMessage(response.data.encrypted_content);
};