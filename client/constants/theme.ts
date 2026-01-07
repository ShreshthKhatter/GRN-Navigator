import { Platform } from "react-native";

const primaryBlue = "#0070F3";
const primaryBlueDark = "#0051B8";

export const Colors = {
  light: {
    text: "#1A1A1A",
    textSecondary: "#6B7280",
    buttonText: "#FFFFFF",
    tabIconDefault: "#6B7280",
    tabIconSelected: primaryBlue,
    link: primaryBlue,
    backgroundRoot: "#F5F7FA",
    backgroundDefault: "#FFFFFF",
    backgroundSecondary: "#F5F7FA",
    backgroundTertiary: "#E5E7EB",
    primary: primaryBlue,
    primaryDark: primaryBlueDark,
    success: "#10B981",
    warning: "#F59E0B",
    error: "#EF4444",
    border: "#E5E7EB",
    inputBackground: "#FFFFFF",
    cardBackground: "#FFFFFF",
  },
  dark: {
    text: "#ECEDEE",
    textSecondary: "#9BA1A6",
    buttonText: "#FFFFFF",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: "#0A84FF",
    link: "#0A84FF",
    backgroundRoot: "#1A1A1A",
    backgroundDefault: "#2A2C2E",
    backgroundSecondary: "#353739",
    backgroundTertiary: "#404244",
    primary: "#0A84FF",
    primaryDark: "#0051B8",
    success: "#10B981",
    warning: "#F59E0B",
    error: "#EF4444",
    border: "#404244",
    inputBackground: "#2A2C2E",
    cardBackground: "#2A2C2E",
  },
};

export const StatusColors = {
  pending: "#F59E0B",
  completed: "#10B981",
  error: "#EF4444",
  inProgress: "#0070F3",
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  "2xl": 24,
  "3xl": 32,
  "4xl": 40,
  "5xl": 48,
  inputHeight: 48,
  buttonHeight: 52,
};

export const BorderRadius = {
  xs: 8,
  sm: 12,
  md: 18,
  lg: 24,
  xl: 30,
  "2xl": 40,
  "3xl": 50,
  full: 9999,
};

export const Typography = {
  h1: {
    fontSize: 24,
    fontWeight: "700" as const,
  },
  h2: {
    fontSize: 20,
    fontWeight: "600" as const,
  },
  h3: {
    fontSize: 16,
    fontWeight: "600" as const,
  },
  h4: {
    fontSize: 14,
    fontWeight: "600" as const,
  },
  body: {
    fontSize: 16,
    fontWeight: "400" as const,
  },
  bodySmall: {
    fontSize: 14,
    fontWeight: "400" as const,
  },
  caption: {
    fontSize: 12,
    fontWeight: "400" as const,
  },
  button: {
    fontSize: 16,
    fontWeight: "600" as const,
  },
  input: {
    fontSize: 16,
    fontWeight: "400" as const,
  },
  link: {
    fontSize: 16,
    fontWeight: "400" as const,
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: "system-ui",
    serif: "ui-serif",
    rounded: "ui-rounded",
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded:
      "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});

export const Shadows = {
  card: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  fab: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 4,
  },
};
