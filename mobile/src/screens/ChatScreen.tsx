import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, TextInput, StyleSheet, FlatList, TouchableOpacity, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { v4 as uuidv4 } from 'uuid';
import { theme } from '../theme';
import { characterColors } from '../data/characters';
import { sendMessage } from '../api/chat';
import { ChatBubble } from '../components/ChatBubble';
import { Header } from '../components/Header';
import { Message, Language } from '../types';
import { saveConversation, loadConversation } from '../hooks/useStorage';
import { RootStackParamList } from '../navigation/AppNavigator';
import i18n from '../i18n';

type Route = RouteProp<RootStackParamList, 'Chat'>;

export function ChatScreen() {
  const { t } = useTranslation();
  const route = useRoute<Route>();
  const navigation = useNavigation();
  const { character } = route.params;
  const accent = characterColors[character.id];
  const [messages, setMessages] = useState<Message[]>([]);
  const [sessionId] = useState(() => uuidv4());
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const flatRef = useRef<FlatList>(null);

  useEffect(() => {
    (async () => {
      const stored = await loadConversation(character.id);
      if (stored?.messages?.length) setMessages(stored.messages);
    })();
  }, [character.id]);

  const handleSend = useCallback(async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput('');
    const userMsg: Message = { id: uuidv4(), text, isUser: true, timestamp: Date.now() };
    const next = [...messages, userMsg];
    setMessages(next);
    setLoading(true);
    try {
      const context = next.slice(-6).map(m => `${m.isUser ? 'User' : 'AI'}: ${m.text}`).join('\n');
      const lang = (i18n.language ?? 'en') as Language;
      const reply = await sendMessage({ character: character.id, message: text, sessionId, language: lang, context });
      const aiMsg: Message = { id: uuidv4(), text: reply, isUser: false, timestamp: Date.now() };
      const final = [...next, aiMsg];
      setMessages(final);
      await saveConversation(character.id, final, sessionId);
    } catch { Alert.alert('Error', t('chat.errorMsg')); }
    finally { setLoading(false); }
  }, [input, loading, messages, character.id, sessionId, t]);

  const handleClear = () => {
    Alert.alert(t('chat.clearConfirmTitle'), t('chat.clearConfirmMsg'), [
      { text: t('chat.cancel'), style: 'cancel' },
      { text: t('chat.confirm'), style: 'destructive', onPress: async () => { setMessages([]); await saveConversation(character.id, [], sessionId); } },
    ]);
  };

  useEffect(() => {
    if (messages.length) setTimeout(() => flatRef.current?.scrollToEnd({ animated: true }), 100);
  }, [messages]);

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={0}>
      <Header title={t(`characters.${character.id}.name`)} subtitle={t(`characters.${character.id}.tagline`)} accentColor={accent} onBack={() => navigation.goBack()} rightIcon="trash-outline" onRightPress={handleClear} />
      <FlatList ref={flatRef} data={messages} keyExtractor={m => m.id} renderItem={({ item }) => <ChatBubble message={item} accentColor={accent} />} contentContainerStyle={styles.list} showsVerticalScrollIndicator={false} />
      {loading && <View style={styles.typingRow}><View style={[styles.dot, { backgroundColor: accent }]} /><View style={[styles.dot, { backgroundColor: accent, opacity: 0.6 }]} /><View style={[styles.dot, { backgroundColor: accent, opacity: 0.3 }]} /></View>}
      <View style={[styles.inputBar, { borderTopColor: theme.colors.border }]}>
        <TextInput style={styles.input} value={input} onChangeText={setInput} placeholder={t('chat.placeholder')} placeholderTextColor={theme.colors.textMuted} multiline maxLength={1000} />
        <TouchableOpacity style={[styles.sendBtn, { backgroundColor: input.trim() ? accent : theme.colors.surface }]} onPress={handleSend} disabled={!input.trim() || loading}>
          <Ionicons name="send" size={18} color={input.trim() ? '#fff' : theme.colors.textMuted} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  list: { paddingTop: 16, paddingBottom: 8 },
  typingRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingBottom: 8 },
  dot: { width: 6, height: 6, borderRadius: 3, marginRight: 4 },
  inputBar: { flexDirection: 'row', alignItems: 'flex-end', paddingHorizontal: 12, paddingVertical: 10, borderTopWidth: 1, backgroundColor: theme.colors.background },
  input: { flex: 1, backgroundColor: theme.colors.surface, borderRadius: 20, paddingHorizontal: 16, paddingVertical: 10, color: theme.colors.text, fontSize: 15, maxHeight: 100, marginRight: 8, borderWidth: 1, borderColor: theme.colors.border },
  sendBtn: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
});
