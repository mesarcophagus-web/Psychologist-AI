import AsyncStorage from '@react-native-async-storage/async-storage';
import { Message, CharacterId, StoredConversation } from '../types';

const CONV_KEY = (id: CharacterId) => `@psychai_conv_${id}`;

export async function saveConversation(characterId: CharacterId, messages: Message[], sessionId: string): Promise<void> {
  const data: StoredConversation = { characterId, messages, sessionId, lastUpdated: Date.now() };
  await AsyncStorage.setItem(CONV_KEY(characterId), JSON.stringify(data));
}

export async function loadConversation(characterId: CharacterId): Promise<StoredConversation | null> {
  try {
    const raw = await AsyncStorage.getItem(CONV_KEY(characterId));
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

export async function clearConversation(characterId: CharacterId): Promise<void> {
  await AsyncStorage.removeItem(CONV_KEY(characterId));
}

export async function clearAllConversations(): Promise<void> {
  await Promise.all((['stoic', 'mom', 'coach'] as CharacterId[]).map(id => AsyncStorage.removeItem(CONV_KEY(id))));
}
