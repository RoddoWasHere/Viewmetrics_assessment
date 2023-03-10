import { createTheme, ThemeProvider } from "@mui/material";
import React, { ReactNode, useEffect, useState } from 'react';
import { ThemeName, useLocalStore } from "../utils/localStore";

export const defaultTheme = createTheme({
  palette:{
    primary:{
      main: "#f00",
      contrastText: "#fff",
    },
    background: {
      default: "#ddd",
      paper: "#fff"
    },
    text:{
      primary: "#000",
    }
  },
  components: {
    MuiButton:  {
      styleOverrides: {
        root: ({ ownerState }) => ({
          ...(ownerState.variant === 'text' &&
            ownerState.color === 'primary' && {
              // backgroundColor: '#202020',
              color: '#fff',
            }),
        }),
      },
    },
  },
});

export const rickNMortyTheme = createTheme({
  typography:{
    fontFamily:[
      'Oxanium', 
      'courier',
      'monospace',
    ].join(',')
  },
  palette: {
    mode: 'dark',
    primary: {
      main: "#1e7f00",
      // dark: "#3cff00",
      contrastText: "#3cff00",
    },
    background: {
      default: "#000000",
      paper: "#082000"
    },
    text:{
      primary: "#3cff00",
      // icon: "#3cff00",
    },
    common:{
      white: "#3cff00"
    }
  },
  components: {
    // Name of the component
    MuiPaper: {
      defaultProps: {
        style: {
          border: "1px solid",
        }
      },
    },
    MuiCardHeader:  {
      defaultProps: {
        style: {
          border: "1px solid",
        }
      },
    },
    MuiButton:  {
      defaultProps: {
        style: {
          color: "#3cff00",
        }
      },
    },
    MuiSvgIcon:  {
      defaultProps: {
        style: {
          color: "#3cff00",
        }
      },
    },
  },
});

interface IThemeProviderCustomProps {
  children: ReactNode
}

const themes = {
  "default": defaultTheme,
  "rickNMorty": rickNMortyTheme,
};

export default function ThemeProviderCustom({ children }: IThemeProviderCustomProps){
  const localStore = useLocalStore();
  const [themeName, setThemeName] = useState<ThemeName | null>(null);

  useEffect(() => {
    const appSettingsTp = localStore.appSettings.get();
    const currentThemeName = appSettingsTp && appSettingsTp.themeName;

    const subscription = localStore.appSettings.addEventListener((appSettings) => {
      setThemeName(appSettings.themeName);
    });
    if(themeName != currentThemeName && currentThemeName) setThemeName(currentThemeName);

    return () => subscription.unsubscribe();
  }, [])
  if(themeName === null) return "Loading";

  const theme = themes[themeName] || defaultTheme;

  return <ThemeProvider theme={theme}>
      { children }
    </ThemeProvider>;
}