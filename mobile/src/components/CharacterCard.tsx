import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { theme } from '../theme';
import { CharacterData, characterColors, characterIcons } from '../data/characters';

interface Props {
  character: CharacterData;
  hasHistory: boolean;
  onPress: () => void;
}

export function CharacterCard({ character, hasHistory, onPress }: Props) {
  const { t } = useTranslation();
  const accent = characterColors[character.id];
  const icon = characterIcons[character.id] as any;
  return (
    <TouchableOpacity style={[styles.card, { borderColor: accent + '40' }]} onPress={onPress} activeOpacity={0.85}>
      <View style={[styles.iconWrap, { backgroundColor: accent + '22' }]}>
        <Ionicons name={icon} size={30} color={accent} />
      </View>
      <View style={styles.info}>
        <View style={styles.nameRow}>
          <Text style={styles.name}>{t(`characters.${character.id}.name`)}</Text>
          {hasHistory && <View style={[styles.badge, { backgroundColor: accent + '22' }]}><Text style={[styles.badgeText, { color: accent }]}>{t('home.recentSession')}</Text></View>}
        </View>
        <Text style={[styles.tagline, { color: accent }]}>{t(`characters.${character.id}.tagline`)}</Text>
        <Text style={styles.desc} numberOfLines={2}>{t(`characters.${character.id}.description`)}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={theme.colors.textMuted} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: theme.colors.surface, borderRadius: theme.radius.lg, padding: theme.spacing.md, marginBottom: theme.spacing.md, borderWidth: 1, ...Platform.select({ ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8 }, android: { elevation: 4 } }) },
  iconWrap: { width: 60, height: 60, borderRadius: 18, alignItems: 'center', justifyContent: 'center', marginRight: theme.spacing.md },
  info: { flex: 1 },
  nameRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 2 },
  name: { fontSize: theme.fontSize.lg, fontWeight: '700', color: theme.colors.text, marginRight: 8 },
  badge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: theme.radius.full },
  badgeText: { fontSize: theme.fontSize.xs, fontWeight: '600' },
  tagline: { fontSize: theme.fontSize.sm, fontWeight: '600', marginBottom: 4 },
  desc: { fontSize: theme.fontSize.sm, color: theme.colors.textSecondary, lineHeight: 18 },
});
