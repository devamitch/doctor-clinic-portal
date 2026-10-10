import { createTheme, createBox, createText } from "@shopify/restyle";

import { lightColors, darkColors } from "./colors";

// Define the complete theme shape
export const baseTheme = {
  colors: lightColors,
  spacing: {
    xxs: 2,
    xs: 4,
    s: 8,
    m: 16,
    l: 24,
    xl: 32,
    xxl: 48,
    xxxl: 64,
  },
  borderRadii: {
    xs: 4,
    s: 8,
    m: 12,
    l: 16,
    xl: 20,
    xxl: 24,
    round: 50,
  },
  breakpoints: {
    phone: 0,
    tablet: 768,
    desktop: 1024,
  },
  zIndices: {
    base: 0,
    elevated: 1,
    overlay: 10,
    modal: 100,
    tooltip: 1000,
  },
  // Typography variants
  textVariants: {
    defaults: {
      color: "textPrimary",
      fontWeight: "400",
    },
    display: {
      fontSize: 32,
      fontWeight: "800",
      color: "textPrimary",
      lineHeight: 40,
    },
    header: {
      fontSize: 28,
      fontWeight: "700",
      color: "textPrimary",
      lineHeight: 34,
    },
    subheader: {
      fontSize: 20,
      fontWeight: "600",
      color: "textPrimary",
      lineHeight: 26,
    },
    title: {
      fontSize: 18,
      fontWeight: "600",
      color: "textPrimary",
      lineHeight: 24,
    },
    body: {
      fontSize: 16,
      fontWeight: "400",
      color: "textPrimary",
      lineHeight: 22,
    },
    bodySmall: {
      fontSize: 14,
      fontWeight: "400",
      color: "textSecondary",
      lineHeight: 20,
    },
    caption: {
      fontSize: 12,
      fontWeight: "400",
      color: "textTertiary",
      lineHeight: 16,
    },
    overline: {
      fontSize: 10,
      fontWeight: "600",
      color: "textTertiary",
      lineHeight: 14,
      textTransform: "uppercase",
      letterSpacing: 1,
    },
    button: {
      fontSize: 16,
      fontWeight: "600",
      color: "textPrimary",
      lineHeight: 20,
    },
    buttonSmall: {
      fontSize: 14,
      fontWeight: "600",
      color: "textPrimary",
      lineHeight: 18,
    },
    buttonLarge: {
      fontSize: 18,
      fontWeight: "600",
      color: "textPrimary",
      lineHeight: 24,
    },
  },
  // Glass card variants
  cardVariants: {
    defaults: {
      padding: "m",
      borderRadius: "l",
    },
    glass: {
      backgroundColor: "glassBackground",
      borderRadius: "l",
      padding: "m",
      borderWidth: 1,
      borderColor: "border",
      shadowColor: "shadow",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 1,
      shadowRadius: 12,
      elevation: 8,
    },
    glassStrong: {
      backgroundColor: "glassBackgroundStrong",
      borderRadius: "l",
      padding: "l",
      borderWidth: 1,
      borderColor: "borderStrong",
      shadowColor: "shadowStrong",
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 1,
      shadowRadius: 16,
      elevation: 12,
    },
    elevated: {
      backgroundColor: "surfaceElevated",
      borderRadius: "xl",
      padding: "l",
      shadowColor: "shadow",
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 1,
      shadowRadius: 20,
      elevation: 16,
    },
    modal: {
      backgroundColor: "glassBackgroundStrong",
      borderRadius: "xl",
      padding: "xl",
      borderWidth: 1,
      borderColor: "borderStrong",
      shadowColor: "shadowStrong",
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 1,
      shadowRadius: 24,
      elevation: 20,
    },
  },
  // Glass button variants
  buttonVariants: {
    defaults: {
      borderRadius: "l",
      padding: "m",
      alignItems: "center",
      justifyContent: "center",
    },
    primary: {
      backgroundColor: "primary",
      borderRadius: "l",
      paddingVertical: "m",
      paddingHorizontal: "l",
      shadowColor: "primary",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 8,
    },
    secondary: {
      backgroundColor: "glassBackgroundStrong",
      borderRadius: "l",
      paddingVertical: "m",
      paddingHorizontal: "l",
      borderWidth: 1,
      borderColor: "borderStrong",
      shadowColor: "shadow",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 1,
      shadowRadius: 4,
      elevation: 4,
    },
    glass: {
      backgroundColor: "glassBackground",
      borderRadius: "l",
      paddingVertical: "m",
      paddingHorizontal: "l",
      borderWidth: 1,
      borderColor: "border",
    },
    glassStrong: {
      backgroundColor: "glassBackgroundStrong",
      borderRadius: "l",
      paddingVertical: "m",
      paddingHorizontal: "l",
      borderWidth: 1,
      borderColor: "borderStrong",
      shadowColor: "shadow",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 1,
      shadowRadius: 8,
      elevation: 4,
    },
    gradient: {
      borderRadius: "l",
      paddingVertical: "m",
      paddingHorizontal: "l",
      shadowColor: "shadow",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 1,
      shadowRadius: 8,
      elevation: 4,
    },
    ghost: {
      backgroundColor: "transparent",
      borderRadius: "l",
      paddingVertical: "m",
      paddingHorizontal: "l",
      borderWidth: 1,
      borderColor: "borderStrong",
    },
    icon: {
      borderRadius: "round",
      padding: "s",
      backgroundColor: "glassBackgroundStrong",
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 1,
      borderColor: "border",
    },
    fab: {
      borderRadius: "round",
      padding: "l",
      backgroundColor: "primary",
      alignItems: "center",
      justifyContent: "center",
      shadowColor: "primary",
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.4,
      shadowRadius: 16,
      elevation: 16,
    },
  },
  // Glass input variants
  inputVariants: {
    defaults: {
      borderRadius: "l",
      padding: "m",
    },
    glass: {
      backgroundColor: "glassBackground",
      borderRadius: "l",
      borderWidth: 1,
      borderColor: "border",
      paddingVertical: "m",
      paddingHorizontal: "l",
    },
    glassStrong: {
      backgroundColor: "glassBackgroundStrong",
      borderRadius: "l",
      borderWidth: 1,
      borderColor: "borderStrong",
      paddingVertical: "m",
      paddingHorizontal: "l",
      shadowColor: "shadow",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 1,
      shadowRadius: 4,
      elevation: 2,
    },
    floating: {
      backgroundColor: "glassBackground",
      borderRadius: "l",
      borderWidth: 1,
      borderColor: "border",
      paddingTop: "l",
      paddingBottom: "s",
      paddingHorizontal: "l",
    },
    search: {
      backgroundColor: "glassBackgroundLight",
      borderRadius: "round",
      borderWidth: 1,
      borderColor: "border",
      paddingVertical: "s",
      paddingHorizontal: "l",
    },
  },
  // Navigation variants
  navigationVariants: {
    header: {
      backgroundColor: "glassBackgroundStrong",
      borderBottomWidth: 1,
      borderBottomColor: "border",
      paddingVertical: "m",
      paddingHorizontal: "l",
    },
    tabBar: {
      backgroundColor: "glassBackgroundStrong",
      borderTopWidth: 1,
      borderTopColor: "border",
      paddingVertical: "m",
      paddingHorizontal: "l",
    },
    drawer: {
      backgroundColor: "glassBackgroundStrong",
      borderRightWidth: 1,
      borderRightColor: "border",
      padding: "l",
    },
  },
  // Modal variants
  modalVariants: {
    overlay: {
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: "l",
    },
    content: {
      backgroundColor: "glassBackgroundStrong",
      borderRadius: "xl",
      padding: "xl",
      borderWidth: 1,
      borderColor: "borderStrong",
      shadowColor: "shadowStrong",
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 1,
      shadowRadius: 24,
      elevation: 20,
      maxWidth: 400,
      width: "100%",
    },
    fullscreen: {
      backgroundColor: "backgroundPrimary",
      flex: 1,
    },
  },
};

// Create themes
export const lightTheme = createTheme({
  ...baseTheme,
  colors: lightColors,
});

export const darkTheme = createTheme({
  ...baseTheme,
  colors: darkColors,
});

// Export the theme type
export type Theme = typeof lightTheme;

// Create the restyle components
export const Box = createBox<Theme>();
export const Text = createText<Theme>();
