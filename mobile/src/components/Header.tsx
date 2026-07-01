import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme } from '../theme';

interface Props { title: string; subtitle?: string; accentColor?: string; onBack?: () => void; rightIcon?: string; onRightPress?: () => void; }

export function Header({ title, subtitle, accentColor, onBack, rightIcon, onRightPress }: Props) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.container, { paddingTop: insets.top + 8 }]}>
      <StatusBar barStyle="light-content" />
      {onBack ? <TouchableOpacity style={styles.iconBtn} onPress={onBack}><Ionicons name="chevron-back" size={24} color={theme.colors.text} /></TouchableOpacity> : <View style={styles.iconBtn} />}
      <View style={styles.center}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={[styles.subtitle, accentColor ? { color: accentColor } : {}]}>{subtitle}</Text> : null}
      </View>
      {rightIcon && onRightPress ? <TouchableOpacity style={styles.iconBtn} onPress={onRightPress}><Ionicons name={rightIcon as any} size={22} color={theme.colors.textSecondary} /></TouchableOpacity> : <View style={styles.iconBtn} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingBottom: 12, backgroundColor: theme.colors.background, borderBottomWidth: 1, borderBottomColor: theme.colors.border },
  iconBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  center: { flex: 1, alignItems: 'center' },
  title: { fontSize: theme.fontSize.lg, fontWeight: '700', color: theme.colors.text },
  subtitle: { fontSize: theme.fontSize.sm, color: theme.colors.textSecondary, marginTop: 1 },
});
