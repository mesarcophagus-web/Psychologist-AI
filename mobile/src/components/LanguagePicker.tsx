import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { theme } from '../theme';
import { Language } from '../types';
import { changeLanguage } from '../i18n';

const LANGUAGES: { code: Language; flag: string }[] = [
  { code: 'en', flag: 'EN' },
  { code: 'fr', flag: 'FR' },
  { code: 'es', flag: 'ES' },
  { code: 'ru', flag: 'RU' },
];

interface Props { visible: boolean; current: Language; onClose: () => void; onSelect: (lang: Language) => void; }

export function LanguagePicker({ visible, current, onClose, onSelect }: Props) {
  const { t } = useTranslation();
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose} />
      <View style={styles.sheet}>
        <View style={styles.handle} />
        <Text style={styles.title}>{t('settings.chooseLanguage')}</Text>
        <FlatList data={LANGUAGES} keyExtractor={item => item.code} renderItem={({ item }) => (
          <TouchableOpacity style={[styles.row, item.code === current && styles.rowActive]}
            onPress={async () => { await changeLanguage(item.code); onSelect(item.code); onClose(); }}>
            <View style={[styles.flag, { backgroundColor: theme.colors.primary + '33' }]}><Text style={[styles.flagText, { color: theme.colors.primaryLight }]}>{item.flag}</Text></View>
            <Text style={styles.langName}>{t(`languages.${item.code}`)}</Text>
            {item.code === current && <Ionicons name="checkmark-circle" size={22} color={theme.colors.primary} />}
          </TouchableOpacity>
        )} />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' },
  sheet: { backgroundColor: theme.colors.surface, borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingBottom: 40, paddingTop: 12 },
  handle: { width: 36, height: 4, backgroundColor: theme.colors.border, borderRadius: 2, alignSelf: 'center', marginBottom: 16 },
  title: { fontSize: theme.fontSize.lg, fontWeight: '700', color: theme.colors.text, paddingHorizontal: 20, marginBottom: 12 },
  row: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 14, borderRadius: 12, marginHorizontal: 12, marginBottom: 4 },
  rowActive: { backgroundColor: theme.colors.background },
  flag: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginRight: 14 },
  flagText: { fontSize: 12, fontWeight: '700' },
  langName: { flex: 1, fontSize: theme.fontSize.md, color: theme.colors.text, fontWeight: '500' },
});
