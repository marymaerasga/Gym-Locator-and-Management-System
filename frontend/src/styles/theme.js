import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  colors: {
    brand: {
      100: "#86B817",
      200: "#2C3E50",
    },

    accent: {
      100: "#3D0C11",
      200: "#D80032",
      300: "#004225",
      400: "#45577d",
      500: "#000000",
    },
    neutral: {
      100: "#FFF",
      200: "rgba(0,0,0,0.5)",
      300: "#9BA4B5",
    },
  },
  // fonts: {
  //   body: "Inter, sans-serif",
  // },
  // fontWeights: {
  //   thin: 100,
  //   extraLight: 200,
  //   light: 300,
  //   normal: 400,
  //   medium: 500,
  //   semiBold: 600,
  //   bold: 700,
  //   extraBold: 800,
  //   black: 900,
  // },
});

export default theme;
