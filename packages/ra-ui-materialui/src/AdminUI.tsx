import * as React from 'react';
import { createElement, ComponentType, useState, ErrorInfo } from 'react';
import { CoreAdminUI, CoreAdminUIProps } from 'ra-core';
import { ScopedCssBaseline } from '@mui/material';

import {
    Layout as DefaultLayout,
    LoadingPage,
    NotFound,
    Notification,
    Error,
} from './layout';
import { Login, AuthCallback } from './auth';

export const AdminUI = ({
    layout = DefaultLayout,
    catchAll = NotFound,
    loading = LoadingPage,
    loginPage = Login,
    authCallbackPage = AuthCallback,
    notification = Notification,
    error: errorComponent,
    ...props
}: AdminUIProps) => {
    const [errorInfo, setErrorInfo] = useState<ErrorInfo | undefined>(
        undefined
    );

    const handleError = (error: Error, info: ErrorInfo) => {
        setErrorInfo(info);
    };

    return (
        <ScopedCssBaseline enableColorScheme>
            <CoreAdminUI
                layout={layout}
                catchAll={catchAll}
                loading={loading}
                loginPage={loginPage}
                authCallbackPage={authCallbackPage}
                error={({ error, resetErrorBoundary }) => (
                    <Error
                        error={error}
                        errorComponent={errorComponent}
                        errorInfo={errorInfo}
                        resetErrorBoundary={resetErrorBoundary}
                    />
                )}
                onError={handleError}
                {...props}
            />
            {createElement(notification)}
        </ScopedCssBaseline>
    );
};

export interface AdminUIProps extends CoreAdminUIProps {
    /**
     * The component used to display notifications
     *
     * @see https://marmelab.com/react-admin/Admin.html#notification
     * @example
     * import { Admin, Notification } from 'react-admin';
     * import { dataProvider } from './dataProvider';
     *
     * const MyNotification = () => <Notification autoHideDuration={5000} />;
     *
     * const App = () => (
     *     <Admin notification={MyNotification} dataProvider={dataProvider}>
     *         ...
     *     </Admin>
     * );
     */
    notification?: ComponentType;
}
