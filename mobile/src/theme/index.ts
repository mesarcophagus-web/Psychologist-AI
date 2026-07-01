export const theme = {
  colors: {
    background: '#0d0d1a',
    surface: '#1a1a2e',
    surfaceElevated: '#16213e',
    primary: '#7c3aed',
    primaryLight: '#a855f7',
    accent: '#06b6d4',
    text: '#f8fafc',
    textSecondary: '#94a3b8',
    textMuted: '#475569',
    border: '#1e293b',
    error: '#ef4444',
    success: '#10b981',
  },
  character: {
    stoic: { accent: '#818cf8', bg: '#1e1b4b22' },
    mom:   { accent: '#f472b6', bg: '#4a044e22' },
    coach: { accent: '#fbbf24', bg: '#78350f22' },
  },
  spacing: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48 },
  radius:  { sm: 8, md: 12, lg: 16, xl: 24, full: 9999 },
  fontSize: { xs: 11, sm: 13, md: 15, lg: 17, xl: 20, xxl: 26, xxxl: 32 },
};

export type Theme = typeof theme;
