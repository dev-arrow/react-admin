import React, { FunctionComponent, ComponentType } from 'react';
import { History } from 'history';

import CoreAdminContext from './CoreAdminContext';
import CoreAdminUI from './CoreAdminUI';
import {
    AuthProvider,
    LegacyAuthProvider,
    I18nProvider,
    DataProvider,
    TitleComponent,
    LoginComponent,
    LayoutComponent,
    AdminChildren,
    CatchAllComponent,
    CustomRoutes,
    DashboardComponent,
    LegacyDataProvider,
    InitialState,
} from '../types';

export type ChildrenFunction = () => ComponentType[];

export interface AdminProps {
    appLayout?: LayoutComponent;
    authProvider?: AuthProvider | LegacyAuthProvider;
    catchAll: CatchAllComponent;
    children?: AdminChildren;
    customReducers?: object;
    customRoutes?: CustomRoutes;
    customSagas?: any[];
    dashboard?: DashboardComponent;
    dataProvider: DataProvider | LegacyDataProvider;
    history: History;
    i18nProvider?: I18nProvider;
    initialState?: InitialState;
    layout: LayoutComponent;
    loading: ComponentType;
    locale?: string;
    loginPage: LoginComponent | boolean;
    logoutButton?: ComponentType;
    menu?: ComponentType;
    theme?: object;
    title?: TitleComponent;
}

/**
 * Main admin component, entry point to the application.
 *
 * Initializes the various contexts (auth, data, i18n, redux, router)
 * and defines the main routes.
 *
 * Expects a list of resources as children, or a function returning a list of
 * resources based on the permissions.
 *
 * @example
 *
 * // static list of resources
 *
 * import {
 *     CoreAdmin,
 *     Resource,
 *     ListGuesser,
 *     useDataProvider,
 * } from 'ra-core';
 *
 * const App = () => (
 *     <Core dataProvider={myDataProvider}>
 *         <Resource name="posts" list={ListGuesser} />
 *     </Core>
 * );
 *
 * // dynamic list of resources based on permissions
 *
 * import {
 *     CoreAdmin,
 *     Resource,
 *     ListGuesser,
 *     useDataProvider,
 * } from 'ra-core';
 *
 * const App = () => (
 *     <CoreAdmin dataProvider={myDataProvider}>
 *         {permissions => [
 *             <Resource name="posts" key="posts" list={ListGuesser} />,
 *         ]}
 *     </CoreAdmin>
 * );
 *
 * // If you have to build a dynamic list of resources using a side effect,
 * // you can't use <CoreAdmin>. But as it delegates to sub components,
 * // it's relatively straightforward to replace it:
 *
 * import React, { useEffect, useState } from 'react';
 * import {
 *     CoreAdminContext,
 *     CoreAdminUI,
 *     Resource,
 *     ListGuesser,
 *     useDataProvider,
 * } from 'ra-core';
 *
 * const App = () => (
 *     <CoreAdminContext dataProvider={myDataProvider}>
 *         <UI />
 *     </CoreAdminContext>
 * );
 *
 * const UI = () => {
 *     const [resources, setResources] = useState([]);
 *     const dataProvider = useDataProvider();
 *     useEffect(() => {
 *         dataProvider.introspect().then(r => setResources(r));
 *     }, []);
 *
 *     return (
 *         <CoreAdminUI>
 *             {resources.map(resource => (
 *                 <Resource name={resource.name} key={resource.key} list={ListGuesser} />
 *             ))}
 *         </CoreAdminUI>
 *     );
 * };
 */
const CoreAdmin: FunctionComponent<AdminProps> = ({
    appLayout,
    authProvider,
    catchAll,
    children,
    customReducers,
    customRoutes = [],
    customSagas,
    dashboard,
    dataProvider,
    history,
    i18nProvider,
    initialState,
    layout,
    loading,
    locale,
    loginPage,
    logoutButton,
    menu, // deprecated, use a custom layout instead
    theme,
    title = 'React Admin',
}) => {
    if (appLayout) {
        console.warn(
            'You are using deprecated prop "appLayout", it was replaced by "layout", see https://github.com/marmelab/react-admin/issues/2918'
        );
    }
    if (loginPage === true && process.env.NODE_ENV !== 'production') {
        console.warn(
            'You passed true to the loginPage prop. You must either pass false to disable it or a component class to customize it'
        );
    }
    if (locale) {
        console.warn(
            'You are using deprecated prop "locale". You must now pass the initial locale to your i18nProvider'
        );
    }

    return (
        <CoreAdminContext
            authProvider={authProvider}
            dataProvider={dataProvider}
            i18nProvider={i18nProvider}
            history={history}
            customReducers={customReducers}
            customSagas={customSagas}
            initialState={initialState}
        >
            <CoreAdminUI
                layout={appLayout || layout}
                customRoutes={customRoutes}
                dashboard={dashboard}
                menu={menu}
                catchAll={catchAll}
                theme={theme}
                title={title}
                loading={loading}
                loginPage={loginPage}
                logout={authProvider ? logoutButton : undefined}
            >
                {children}
            </CoreAdminUI>
        </CoreAdminContext>
    );
};

export default CoreAdmin;
