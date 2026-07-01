export type Language = 'en' | 'fr' | 'es' | 'ru';
export type CharacterId = 'stoic' | 'mom' | 'coach';

export interface Character {
  id: CharacterId;
  personality: string;
  mode: string;
}

export interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: number;
}

export interface StoredConversation {
  characterId: CharacterId;
  messages: Message[];
  sessionId: string;
  lastUpdated: number;
}
