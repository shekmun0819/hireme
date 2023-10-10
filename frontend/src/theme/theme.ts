import { Theme, PaletteMode, responsiveFontSizes } from '@mui/material';
import { createTheme, ComponentsOverrides } from '@mui/material/styles';

const getTheme = (): Theme =>
  responsiveFontSizes(
    createTheme({
      palette: {
        mode: 'light' as PaletteMode,
        background: {
          default: '#FFFFFF',
          paper: '#FFFFFF',
        },
        text: {
          primary: '#212121',
          secondary: '#979797',
        },
        primary: {
          main: '#303F9F',
          contrastText: 'rgb(100, 101, 98)',
          light:'#C5CAE9',
        },
        divider: 'rgba(145, 158, 171, 0.24)',
      },
      typography: {
        fontFamily: '"Poppins", sans-serif',
      },
      components: {
        MuiButton: {
          styleOverrides: {
            root: {
              fontWeight: 600,
              borderRadius: 5,
              paddingTop: 10,
              paddingBottom: 10,
            },
          } as ComponentsOverrides['MuiButton'],
        },
        MuiInputBase: {
          styleOverrides: {
            root: {
              borderRadius: 0,
            },
          } as ComponentsOverrides['MuiInputBase'],
        },
        MuiOutlinedInput: {
          styleOverrides: {
            root: {
              borderRadius: 5,
            },
            input: {
              borderRadius: 5,
            },
          } as ComponentsOverrides['MuiOutlinedInput'],
        },
        MuiCard: {
          styleOverrides: {
            root: {
              borderRadius: 0,
            },
          } as ComponentsOverrides['MuiCard'],
        },
      },
    }),
  );

export default getTheme;