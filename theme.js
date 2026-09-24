// theme.js — Global design tokens used across the app
// Keeps all colors, fonts, and spacing in one place for consistency

export const COLORS = {
  primary: '#FF6B35',      // Warm orange — energy & appetite
  primaryDark: '#E85520',
  primaryLight: '#FF8C5A',
  secondary: '#2D3748',    // Dark slate for text
  background: '#F7F8FA',   // Off-white app background
  surface: '#FFFFFF',      // Card / panel surface
  surfaceAlt: '#FFF4EF',   // Light orange tint for highlights
  border: '#E2E8F0',
  textPrimary: '#1A202C',
  textSecondary: '#718096',
  textLight: '#A0AEC0',
  success: '#48BB78',
  warning: '#ECC94B',
  error: '#FC8181',
  white: '#FFFFFF',
  black: '#000000',
  overlay: 'rgba(0,0,0,0.5)',
};

export const FONTS = {
  regular: 'System',
  medium: 'System',
  bold: 'System',
  size: {
    xs: 11,
    sm: 13,
    md: 15,
    lg: 17,
    xl: 20,
    xxl: 24,
    xxxl: 30,
  },
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 999,
};

export const SHADOWS = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.16,
    shadowRadius: 16,
    elevation: 8,
  },
};
