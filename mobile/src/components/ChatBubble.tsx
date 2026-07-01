import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../theme';
import { Message } from '../types';

interface Props { message: Message; accentColor: string; }

export function ChatBubble({ message, accentColor }: Props) {
  const isUser = message.isUser;
  const time = new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  return (
    <View style={[styles.row, isUser ? styles.rowUser : styles.rowAI]}>
      {!isUser && <View style={[styles.avatar, { backgroundColor: accentColor + '33', borderColor: accentColor + '66' }]}><Text style={[styles.avatarText, { color: accentColor }]}>AI</Text></View>}
      <View style={[styles.bubble, isUser ? [styles.userBubble, { backgroundColor: accentColor }] : styles.aiBubble]}>
        <Text style={[styles.text, isUser ? styles.userText : styles.aiText]}>{message.text}</Text>
        <Text style={[styles.time, isUser ? styles.userTime : styles.aiTime]}>{time}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', marginBottom: 12, paddingHorizontal: 16, alignItems: 'flex-end' },
  rowUser: { justifyContent: 'flex-end' },
  rowAI: { justifyContent: 'flex-start' },
  avatar: { width: 32, height: 32, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginRight: 8, borderWidth: 1 },
  avatarText: { fontSize: 11, fontWeight: '700' },
  bubble: { maxWidth: '80%', borderRadius: 18, paddingHorizontal: 14, paddingVertical: 10 },
  userBubble: { borderBottomRightRadius: 4 },
  aiBubble: { backgroundColor: theme.colors.surface, borderBottomLeftRadius: 4, borderWidth: 1, borderColor: theme.colors.border },
  text: { fontSize: 15, lineHeight: 22 },
  userText: { color: '#fff' },
  aiText: { color: theme.colors.text },
  time: { fontSize: 10, marginTop: 4 },
  userTime: { color: 'rgba(255,255,255,0.65)', textAlign: 'right' },
  aiTime: { color: theme.colors.textMuted },
});
