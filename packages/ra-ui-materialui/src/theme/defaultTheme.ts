import { RaThemeOptions } from './types';
import { createTheme } from '@mui/material';
import { deepmerge } from '@mui/utils';

const defaultThemeInvariants = {
    typography: {
        h6: {
            fontWeight: 400,
        },
    },
    sidebar: {
        width: 240,
        closedWidth: 50,
    },
    components: {
        MuiAutocomplete: {
            variants: [
                {
                    props: {},
                    style: ({ theme }) => ({
                        [theme.breakpoints.down('sm')]: { width: '100%' },
                    }),
                },
            ],
        },
        MuiTextField: {
            defaultProps: {
                variant: 'filled' as const,
                margin: 'dense' as const,
                size: 'small' as const,
            },
            variants: [
                {
                    props: {},
                    style: ({ theme }) => ({
                        [theme.breakpoints.down('sm')]: { width: '100%' },
                    }),
                },
            ],
        },
        MuiFormControl: {
            defaultProps: {
                variant: 'filled' as const,
                margin: 'dense' as const,
                size: 'small' as const,
            },
        },
    },
};

export const defaultLightTheme: RaThemeOptions = createTheme(
    deepmerge(defaultThemeInvariants, {
        palette: {
            background: {
                default: '#fafafb',
            },
            secondary: {
                light: '#6ec6ff',
                main: '#2196f3',
                dark: '#0069c0',
                contrastText: '#fff',
            },
        },
        components: {
            MuiFilledInput: {
                styleOverrides: {
                    root: {
                        backgroundColor: 'rgba(0, 0, 0, 0.04)',
                        '&$disabled': {
                            backgroundColor: 'rgba(0, 0, 0, 0.04)',
                        },
                    },
                },
            },
        },
    })
);

export const defaultDarkTheme: RaThemeOptions = createTheme(
    deepmerge(defaultThemeInvariants, {
        palette: {
            mode: 'dark',
            primary: {
                main: '#90caf9',
            },
            background: {
                default: '#313131',
            },
        },
    })
);

export const defaultTheme = defaultLightTheme;
