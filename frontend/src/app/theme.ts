import { createTheme } from '@mui/material/styles'

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#18352d',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#d6533f',
      contrastText: '#ffffff',
    },
    background: {
      default: '#eef1ed',
      paper: '#ffffff',
    },
    text: {
      primary: '#17201d',
      secondary: '#5f6b66',
    },
    divider: '#d7ddd9',
    error: {
      main: '#b42318',
    },
    info: {
      main: '#216869',
    },
  },
  shape: {
    borderRadius: 6,
  },
  typography: {
    fontFamily: '"Manrope Variable", sans-serif',
    h1: {
      fontFamily: '"Newsreader Variable", serif',
      fontWeight: 560,
      letterSpacing: 0,
    },
    h2: {
      fontFamily: '"Newsreader Variable", serif',
      fontWeight: 560,
      letterSpacing: 0,
    },
    h3: {
      fontFamily: '"Newsreader Variable", serif',
      fontWeight: 560,
      letterSpacing: 0,
    },
    button: {
      fontWeight: 750,
      letterSpacing: 0,
      textTransform: 'none',
    },
    overline: {
      fontWeight: 800,
      letterSpacing: 0,
    },
  },
  components: {
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          minHeight: 44,
          borderRadius: 6,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          fontWeight: 700,
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
          borderRadius: 6,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        rounded: {
          borderRadius: 8,
        },
      },
    },
  },
})