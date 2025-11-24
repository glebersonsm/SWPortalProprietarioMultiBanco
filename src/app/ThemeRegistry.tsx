"use client";

import React from "react";
import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import {
  extendTheme,
  CssVarsProvider as JoyCssVarsProvider,
} from "@mui/joy/styles";
import CssBaseline from "@mui/joy/CssBaseline";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import {
  experimental_extendTheme as materialExtendTheme,
  Experimental_CssVarsProvider as MaterialCssVarsProvider,
  THEME_ID as MATERIAL_THEME_ID,
} from "@mui/material/styles";
import { persistQueryClient } from "@tanstack/react-query-persist-client";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 0 } },
});
persistQueryClient({
  queryClient,
  persister: createSyncStoragePersister({
    storage: typeof window !== "undefined" ? window.localStorage : undefined,
  }),
});

export default function ThemeRegistry({
  children,
  options,
}: {
  options: Parameters<typeof createCache>[0];
  children: React.ReactNode;
}) {
  const cache = React.useMemo(() => {
    const c = createCache(options);
    c.compat = true;
    return c;
  }, [options]);

  const baseTheme = {
    light: {
      primary: {
        main: "#0e2a47",
        contrastText: "#ffffff",
      },
      secondary: {
        main: "#1f5a85",
        contrastText: "#ffffff",
      },
      background: {
        default: "#f5f5f5",
        paper: "#ffffff",
      },
      text: {
        primary: "#1a1a1a",
        secondary: "#424242",
      },
    },
    dark: {
      primary: {
        main: "#dba827",
        contrastText: "#000000",
      },
      secondary: {
        main: "#b8941f",
        contrastText: "#ffffff",
      },
      background: {
        default: "#1a1a1a",
        paper: "#2a2a2a",
      },
      text: {
        primary: "#ffffff",
        secondary: "#b8b8b8",
      },
    },
  };

  const materialTheme = materialExtendTheme({
    colorSchemes: {
      light: { palette: baseTheme.light },
    },
    typography: {
      fontFamily: "var(--font-montserrat), sans-serif",
      allVariants: {
        color: "var(--mui-palette-text-primary)",
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: "none",
            fontWeight: 700,
          },
        },
      },
    },
  });

  const joyTheme = extendTheme({
    colorSchemes: {
      light: {
        palette: {
          ...baseTheme.light,
          primary: {
            ...baseTheme.light.primary,
            solidBg: baseTheme.light.primary.main,
            solidHoverBg: baseTheme.light.secondary.main,
            plainColor: baseTheme.light.primary.main,
          },
          background: {
            body: baseTheme.light.background.default,
            surface: baseTheme.light.background.paper,
          },
        },
      },
      dark: {
        palette: {
          ...baseTheme.dark,
          primary: {
            ...baseTheme.dark.primary,
            solidBg: baseTheme.dark.primary.main,
            solidHoverBg: baseTheme.dark.secondary.main,
            plainColor: baseTheme.dark.primary.main,
          },
          background: {
            body: baseTheme.dark.background.default,
            surface: baseTheme.dark.background.paper,
          },
        },
      },
    },
    fontFamily: {
      display: "var(--font-montserrat)",
      body: "var(--font-montserrat)",
    },
    focus: {
      default: {
        outlineWidth: "2px",
        outlineOffset: "2px",
        outlineColor: baseTheme.light.primary.main,
      },
    },
    components: {
      JoyInput: {
        styleOverrides: {
          root: ({ theme, ownerState }) => ({
            fontFamily: "Montserrat, sans-serif",
            fontWeight: 400,
            fontSize: '0.9rem',
            borderRadius: 12,
            border: '1px solid',
            borderColor: theme.vars.palette.neutral[200],
            backgroundColor: theme.vars.palette.background.surface,
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            minHeight: '48px',
            boxShadow: theme.palette.mode === 'dark' 
              ? '0 2px 8px rgba(0, 0, 0, 0.2)' 
              : '0 2px 8px rgba(0, 0, 0, 0.04)',
            '&::placeholder': {
              color: theme.vars.palette.text.tertiary,
              opacity: 0.6,
            },
            '&:hover': {
              borderColor: theme.vars.palette.primary[300],
              backgroundColor: theme.palette.mode === 'dark'
                ? 'rgba(219, 168, 39, 0.05)'
                : 'rgba(44, 162, 204, 0.02)',
              transform: 'translateY(-2px)',
              boxShadow: theme.palette.mode === 'dark'
                ? '0 8px 24px rgba(219, 168, 39, 0.15)'
                : '0 8px 24px rgba(44, 162, 204, 0.12)',
            },
            '&.Joy-focused': {
              borderColor: theme.vars.palette.primary[400],
              backgroundColor: theme.vars.palette.background.surface,
              boxShadow: theme.palette.mode === 'dark'
                ? '0 0 0 4px rgba(219, 168, 39, 0.12), 0 8px 24px rgba(219, 168, 39, 0.2)'
                : '0 0 0 4px rgba(44, 162, 204, 0.08), 0 8px 24px rgba(44, 162, 204, 0.15)',
              transform: 'translateY(-2px)',
            },
            '&.Joy-error': {
              borderColor: theme.vars.palette.danger[300],
              boxShadow: '0 0 0 4px rgba(220, 53, 69, 0.08)',
            },
          }),
        },
      },
      JoyFormLabel: {
        styleOverrides: {
          root: ({ theme }) => ({
            color: theme.palette.mode === 'dark' 
              ? theme.vars.palette.primary[400]
              : theme.vars.palette.primary[700],
            fontFamily: "Montserrat, sans-serif",
            fontWeight: 600,
            fontSize: '0.9rem',
            marginBottom: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }),
        },
      },
      JoySelect: {
        styleOverrides: {
          root: ({ theme }) => ({
            fontFamily: "Montserrat, sans-serif",
            fontWeight: 400,
            fontSize: '0.9rem',
            borderRadius: 12,
            border: '1px solid',
            borderColor: theme.vars.palette.neutral[200],
            backgroundColor: theme.vars.palette.background.surface,
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            minHeight: '48px',
            boxShadow: theme.palette.mode === 'dark' 
              ? '0 2px 8px rgba(0, 0, 0, 0.2)' 
              : '0 2px 8px rgba(0, 0, 0, 0.04)',
            '&:hover': {
              borderColor: theme.vars.palette.primary[300],
              backgroundColor: theme.palette.mode === 'dark'
                ? 'rgba(219, 168, 39, 0.05)'
                : 'rgba(44, 162, 204, 0.02)',
              transform: 'translateY(-2px)',
              boxShadow: theme.palette.mode === 'dark'
                ? '0 8px 24px rgba(219, 168, 39, 0.15)'
                : '0 8px 24px rgba(44, 162, 204, 0.12)',
            },
            '&.Joy-focused': {
              borderColor: theme.vars.palette.primary[400],
              backgroundColor: theme.vars.palette.background.surface,
              boxShadow: theme.palette.mode === 'dark'
                ? '0 0 0 4px rgba(219, 168, 39, 0.12), 0 8px 24px rgba(219, 168, 39, 0.2)'
                : '0 0 0 4px rgba(44, 162, 204, 0.08), 0 8px 24px rgba(44, 162, 204, 0.15)',
              transform: 'translateY(-2px)',
            },
            '&.Joy-error': {
              borderColor: theme.vars.palette.danger[300],
              boxShadow: '0 0 0 4px rgba(220, 53, 69, 0.08)',
            },
          }),
        },
      },
      JoyTextarea: {
        styleOverrides: {
          root: ({ theme }) => ({
            fontFamily: "Montserrat, sans-serif",
            fontWeight: 400,
            fontSize: '0.9rem',
            borderRadius: 12,
            border: '1px solid',
            borderColor: theme.vars.palette.neutral[200],
            backgroundColor: theme.vars.palette.background.surface,
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            minHeight: '48px',
            boxShadow: theme.palette.mode === 'dark' 
              ? '0 2px 8px rgba(0, 0, 0, 0.2)' 
              : '0 2px 8px rgba(0, 0, 0, 0.04)',
            '&::placeholder': {
              color: theme.vars.palette.text.tertiary,
              opacity: 0.6,
            },
            '&:hover': {
              borderColor: theme.vars.palette.primary[300],
              backgroundColor: theme.palette.mode === 'dark'
                ? 'rgba(219, 168, 39, 0.05)'
                : 'rgba(44, 162, 204, 0.02)',
              transform: 'translateY(-2px)',
              boxShadow: theme.palette.mode === 'dark'
                ? '0 8px 24px rgba(219, 168, 39, 0.15)'
                : '0 8px 24px rgba(44, 162, 204, 0.12)',
            },
            '&.Joy-focused': {
              borderColor: theme.vars.palette.primary[400],
              backgroundColor: theme.vars.palette.background.surface,
              boxShadow: theme.palette.mode === 'dark'
                ? '0 0 0 4px rgba(219, 168, 39, 0.12), 0 8px 24px rgba(219, 168, 39, 0.2)'
                : '0 0 0 4px rgba(44, 162, 204, 0.08), 0 8px 24px rgba(44, 162, 204, 0.15)',
              transform: 'translateY(-2px)',
            },
            '&.Joy-error': {
              borderColor: theme.vars.palette.danger[300],
              boxShadow: '0 0 0 4px rgba(220, 53, 69, 0.08)',
            },
          }),
        },
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      <CacheProvider value={cache}>
        <MaterialCssVarsProvider
          theme={{ [MATERIAL_THEME_ID]: materialTheme }}
          defaultMode="light"
          modeStorageKey="mui-mode"
        >
          <JoyCssVarsProvider
            theme={joyTheme}
            defaultMode="light"
            modeStorageKey="joy-mode"
            colorSchemeStorageKey="joy-color-scheme"
          >
            <CssBaseline enableColorScheme />
            {children}
          </JoyCssVarsProvider>
        </MaterialCssVarsProvider>
      </CacheProvider>
    </QueryClientProvider>
  );
}
