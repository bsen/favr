export const theme = {
  dark: {
    background: {
      primary: "#121212",
      secondary: "#1e1e1e",
      tertiary: "#2a2a2a",
      border: "#2a2a2a",
    },

    text: {
      primary: "#ffffff",
      secondary: "#9ca3af",
      tertiary: "#6b7280",
    },

    brand: {
      primary: "#22c55e",
      secondary: "#16a34a",
      danger: "#ef4444",
      success: {
        background: "rgba(22, 163, 74, 0.3)",
        border: "#15803d",
        text: "#4ade80",
      },
      error: {
        background: "rgba(127, 29, 29, 0.3)",
        border: "#991b1b",
        text: "#f87171",
      },
    },

    button: {
      primary: {
        background: "#22c55e",
        text: "#ffffff",
      },
    },
  },
};

export const commonStyles = {
  buttonHeight: "h-12",
  roundedLg: "rounded-lg",
  roundedXl: "rounded-xl",
  roundedFull: "rounded-full",
  padding: {
    sm: "p-2",
    md: "p-4",
    lg: "p-6",
  },
};

export const getThemeColor = (isDark: boolean = true) => {
  return isDark ? theme.dark : "";
};
