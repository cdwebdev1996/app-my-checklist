import { createTheme } from "@mui/material/styles";
import React from "react";

declare module '@mui/material/styles' {
  interface TypographyVariants {
    poster: React.CSSProperties;
  }

  // allow configuration using `createTheme`
  interface TypographyVariantsOptions {
    poster?: React.CSSProperties;
  }
}

// Update the Typography's variant prop options
declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    poster: true;
    h3: false;
  }
}

export const theme = createTheme({
  typography: {
    poster: {
      fontSize: '4rem',
      color: '#D37D7D',
    },
    // Disable h3 variant
    h3: undefined,
  },
  components: {
    MuiTypography: {
      defaultProps: {
        variantMapping: {
          // Map the new variant to render a <h1> by default
          poster: 'h1',
        },
      },
    },
    MuiButton: {
      /*  */
    }
  },
  palette: {
    background: {
      paper: '#fff',
    },
    text: {
      primary: '#173A5E',
      secondary: '#46505A',
    },
    action: {
      active: '#001E3C',
    },
  },
});