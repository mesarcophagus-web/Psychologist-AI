import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme } from '../theme';
import { LanguagePicker } from '../components/LanguagePicker';
import { clearAllConversations } from '../hooks/useStorage';
import { Language } from '../types';

export function SettingsScreen() {
  const { t, i18n } = useTranslation();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [showPicker, setShowPicker] = useState(false);
  const currentLang = (i18n.language ?? 'en') as Language;

  const handleClearAll = () => {
    Alert.alert(t('settings.clearAllData'), t('settings.clearAllConfirm'), [
      { text: t('chat.cancel'), style: 'cancel' },
      { text: t('chat.confirm'), style: 'destructive', onPress: clearAllConversations },
    ]);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}><Ionicons name="close" size={26} color={theme.colors.text} /></TouchableOpacity>
        <Text style={styles.headerTitle}>{t('settings.title')}</Text>
        <View style={{ width: 26 }} />
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionLabel}>{t('settings.language')}</Text>
        <TouchableOpacity style={styles.row} onPress={() => setShowPicker(true)}>
          <View style={[styles.iconBox, { backgroundColor: theme.colors.primary + '22' }]}><Ionicons name="language-outline" size={20} color={theme.colors.primaryLight} /></View>
          <View style={styles.rowText}>
            <Text style={styles.rowTitle}>{t('settings.aiLanguage')}</Text>
            <Text style={styles.rowSub}>{t(`languages.${currentLang}`)}</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={theme.colors.textMuted} />
        </TouchableOpacity>

        <Text style={styles.sectionLabel}>{t('settings.about')}</Text>
        <View style={styles.row}>
          <View style={[styles.iconBox, { backgroundColor: theme.colors.accent + '22' }]}><Ionicons name="sparkles-outline" size={20} color={theme.colors.accent} /></View>
          <View style={styles.rowText}>
            <Text style={styles.rowTitle}>{t('app.title')}</Text>
            <Text style={styles.rowSub}>{t('settings.version')}</Text>
          </View>
        </View>

        <Text style={styles.sectionLabel}>Data</Text>
        <TouchableOpacity style={[styles.row, styles.dangerRow]} onPress={handleClearAll}>
          <View style={[styles.iconBox, { backgroundColor: theme.colors.error + '22' }]}><Ionicons name="trash-outline" size={20} color={theme.colors.error} /></View>
          <Text style={[styles.rowTitle, { color: theme.colors.error }]}>{t('settings.clearAllData')}</Text>
        </TouchableOpacity>
      </ScrollView>
      <LanguagePicker visible={showPicker} current={currentLang} onClose={() => setShowPicker(false)} onSelect={() => {}} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 16 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: theme.colors.text },
  sectionLabel: { fontSize: 12, fontWeight: '600', color: theme.colors.textMuted, textTransform: 'uppercase', letterSpacing: 1, paddingHorizontal: 20, marginTop: 24, marginBottom: 8 },
  row: { flexDirection: 'row', alignItems: 'center', backgroundColor: theme.colors.surface, marginHorizontal: 16, borderRadius: 14, padding: 16, marginBottom: 8 },
  iconBox: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 14 },
  rowText: { flex: 1 },
  rowTitle: { fontSize: 15, fontWeight: '600', color: theme.colors.text },
  rowSub: { fontSize: 13, color: theme.colors.textSecondary, marginTop: 2 },
  dangerRow: { borderWidth: 1, borderColor: theme.colors.error + '33' },
});
