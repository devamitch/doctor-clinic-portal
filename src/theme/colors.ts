// ONLY solid hex colors - NO alpha values
export const lightColors = {
  // Primary glassmorphic background gradients
  backgroundPrimary: "#E8F4FD",
  backgroundSecondary: "#F0F8FF",
  backgroundTertiary: "#FFFFFF",

  // Glassmorphic overlays - ONLY solid colors
  glassBackground: "#F5F5F5",
  glassBackgroundStrong: "#E8E8E8",
  glassBackgroundLight: "#FAFAFA",

  // Blue gradient colors from the design
  gradientStart: "#87CEEB",
  gradientMiddle: "#B0E0E6",
  gradientEnd: "#E0F6FF",

  // Accent colors
  primary: "#007AFF",
  primaryDark: "#0066CC",
  primaryLight: "#4DA6FF",

  // Text colors
  textPrimary: "#1A1A1A",
  textSecondary: "#666666",
  textTertiary: "#999999",
  textOnGlass: "#2C2C2C",

  // Card and surface colors - ONLY solid colors
  cardBackground: "#F0F0F0",
  cardBackgroundStrong: "#E0E0E0",
  surfaceElevated: "#D8D8D8",

  // Border and shadow - ONLY solid colors
  border: "#E0E0E0",
  borderStrong: "#C0C0C0",
  shadow: "#E6F3FF",
  shadowStrong: "#CCE7FF",

  // Status colors
  success: "#34C759",
  warning: "#FF9500",
  error: "#FF3B30",
  info: "#007AFF",

  // Rating stars
  starFilled: "#FFD700",
  starEmpty: "#E5E5E5",

  // Transparent for special cases
  transparent: "transparent",
};

export const darkColors = {
  // Dark glassmorphic backgrounds
  backgroundPrimary: "#0A1628",
  backgroundSecondary: "#1A2332",
  backgroundTertiary: "#2A3441",

  // Dark glassmorphic overlays - ONLY solid colors
  glassBackground: "#2A3441",
  glassBackgroundStrong: "#3A4451",
  glassBackgroundLight: "#1F2A37",

  // Dark blue gradients
  gradientStart: "#1E3A8A",
  gradientMiddle: "#3B82F6",
  gradientEnd: "#60A5FA",

  // Accent colors (adjusted for dark mode)
  primary: "#0A84FF",
  primaryDark: "#0066CC",
  primaryLight: "#64B5F6",

  // Dark text colors
  textPrimary: "#FFFFFF",
  textSecondary: "#B3B3B3",
  textTertiary: "#808080",
  textOnGlass: "#E5E5E5",

  // Dark card colors - ONLY solid colors
  cardBackground: "#3A4451",
  cardBackgroundStrong: "#4A5461",
  surfaceElevated: "#5A6471",

  // Dark borders and shadows - ONLY solid colors
  border: "#404040",
  borderStrong: "#606060",
  shadow: "#1A1A1A",
  shadowStrong: "#0A0A0A",

  // Status colors (adjusted)
  success: "#30D158",
  warning: "#FF9F0A",
  error: "#FF453A",
  info: "#64D2FF",

  // Rating stars
  starFilled: "#FFD700",
  starEmpty: "#4A4A4A",

  // Transparent for special cases
  transparent: "transparent",
};

export type Colors = typeof lightColors;

// Color utilities for alpha effects - USE THESE for runtime alpha
export const getAlphaColor = (color: string, alpha: number): string => {
  // Convert hex to rgba for alpha effects
  const hex = color.replace("#", "");
  const r = Number.parseInt(hex.substr(0, 2), 16);
  const g = Number.parseInt(hex.substr(2, 2), 16);
  const b = Number.parseInt(hex.substr(4, 2), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

// Safe color getter with fallback
export const getSafeColor = (
  colors: Colors,
  colorKey: keyof Colors,
  fallback = "#FFFFFF"
): string => {
  try {
    return colors[colorKey] || fallback;
  } catch {
    return fallback;
  }
};
