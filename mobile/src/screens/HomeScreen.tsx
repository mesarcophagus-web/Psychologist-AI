import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme } from '../theme';
import { CharacterCard } from '../components/CharacterCard';
import { characters } from '../data/characters';
import { loadConversation } from '../hooks/useStorage';
import { RootStackParamList } from '../navigation/AppNavigator';
import { CharacterId } from '../types';

type Nav = StackNavigationProp<RootStackParamList, 'Home'>;

export function HomeScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
  const [history, setHistory] = useState<Set<CharacterId>>(new Set());

  useEffect(() => {
    (async () => {
      const results = await Promise.all(characters.map(c => loadConversation(c.id)));
      setHistory(new Set(characters.filter((_, i) => results[i] && results[i]!.messages.length > 0).map(c => c.id)));
    })();
  }, []);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <View style={styles.logo}><Ionicons name="sparkles" size={26} color={theme.colors.primaryLight} /></View>
        <View style={styles.headerText}>
          <Text style={styles.appName}>{t('app.title')}</Text>
          <Text style={styles.appSub}>{t('app.subtitle')}</Text>
        </View>
        <TouchableOpacity style={styles.settingsBtn} onPress={() => navigation.navigate('Settings')}>
          <Ionicons name="settings-outline" size={22} color={theme.colors.textSecondary} />
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        <Text style={styles.greeting}>{t('home.greeting')}</Text>
        <Text style={styles.subtitle}>{t('home.subtitle')}</Text>
        {characters.map(c => (
          <CharacterCard key={c.id} character={c} hasHistory={history.has(c.id)} onPress={() => navigation.navigate('Chat', { character: c })} />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12 },
  logo: { width: 48, height: 48, borderRadius: 14, backgroundColor: theme.colors.primary + '22', borderWidth: 1, borderColor: theme.colors.primary + '44', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  headerText: { flex: 1 },
  appName: { fontSize: 20, fontWeight: '800', color: theme.colors.text, letterSpacing: -0.5 },
  appSub: { fontSize: 12, color: theme.colors.textSecondary, marginTop: 1 },
  settingsBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: theme.colors.surface, alignItems: 'center', justifyContent: 'center' },
  scroll: { flex: 1, paddingHorizontal: 16 },
  greeting: { fontSize: 28, fontWeight: '800', color: theme.colors.text, marginBottom: 6, letterSpacing: -0.5, marginTop: 8 },
  subtitle: { fontSize: 14, color: theme.colors.textSecondary, marginBottom: 20, lineHeight: 20 },
});
