import * as React from 'react';
import { CoreAdminContext, CoreAdminContextProps } from 'ra-core';

import { defaultLightTheme } from './defaultTheme';
import { ThemeProvider, ThemesContext, RaThemeOptions } from './layout/Theme';

export const AdminContext = (props: AdminContextProps) => {
    const {
        theme,
        lightTheme = defaultLightTheme,
        darkTheme,
        children,
        ...rest
    } = props;
    return (
        <CoreAdminContext {...rest}>
            <ThemesContext.Provider
                value={{ lightTheme: theme || lightTheme, darkTheme }}
            >
                <ThemeProvider>{children}</ThemeProvider>
            </ThemesContext.Provider>
        </CoreAdminContext>
    );
};

export interface AdminContextProps extends CoreAdminContextProps {
    lightTheme?: RaThemeOptions;
    darkTheme?: RaThemeOptions;
}

AdminContext.displayName = 'AdminContext';
