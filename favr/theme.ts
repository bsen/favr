export const theme = {
  dark: {
    background: {
      primary: "#000000",
      secondary: "#101010",
      tertiary: "#262626",
      border: "#1d1d1d",
      glass: {
        background: "rgba(16, 16, 16, 0.5)",
        border: "rgba(255, 255, 255, 0.08)",
        blur: 15,
      },
    },

    text: {
      primary: "#ffffff",
      secondary: "#9ca3af",
      tertiary: "#6b7280",
    },

    brand: {
      primary: "#22c55e",
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
        background: "rgba(29, 29, 29, 0.8)",
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
  glass: {
    shadowColor: "rgba(0, 0, 0, 0.1)",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
};

export const getThemeColor = (isDark: boolean = true) => {
  return isDark ? theme.dark : "";
};
