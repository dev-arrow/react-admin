import { useStore } from 'ra-core';
import { RaThemeOptions, ThemeType } from './types';
import { useMediaQuery } from '@mui/material';

export type ThemeSetter = (theme: ThemeType | RaThemeOptions) => void;

/**
 * Read and update the theme mode (light or dark)
 *
 * @example
 * const [theme, setTheme] = useTheme('light');
 * const toggleTheme = () => {
 *    setTheme(theme === 'light' ? 'dark' : 'light');
 * };
 *
 * @example // legacy mode, stores the full theme object
 * // to be removed in v5
 * const [theme, setTheme] = useTheme({
 *    palette: {
 *       type: 'light',
 *   },
 * });
 */
export const useTheme = (
    type?: ThemeType | RaThemeOptions
): [ThemeType | RaThemeOptions, ThemeSetter] => {
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)', {
        noSsr: true,
    });
    // FIXME: remove legacy mode in v5, and remove the RaThemeOptions type
    const [theme, setter] = useStore<ThemeType | RaThemeOptions>(
        'theme',
        type ?? prefersDarkMode ? 'dark' : 'light'
    );
    return [theme, setter];
};
