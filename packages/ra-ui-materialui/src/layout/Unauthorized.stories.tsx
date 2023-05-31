import * as React from 'react';
import polyglotI18nProvider from 'ra-i18n-polyglot';
import englishMessages from 'ra-language-english';
import frenchMessages from 'ra-language-french';
import {
    I18nContextProvider,
    Resource,
    testDataProvider,
    TestMemoryRouter,
} from 'ra-core';

import { AdminContext } from '../AdminContext';
import { AdminUI } from '../AdminUI';
import { Unauthorized } from './Unauthorized';
import { Link } from 'react-router-dom';

export default {
    title: 'ra-ui-materialui/layout/Unauthorized',
};

const i18nProvider = polyglotI18nProvider(
    locale => (locale === 'fr' ? frenchMessages : englishMessages),
    'en',
    [
        { locale: 'en', name: 'English' },
        { locale: 'fr', name: 'Français' },
    ]
);

export const Basic = () => <Unauthorized />;

export const I18N = () => {
    return (
        <TestMemoryRouter>
            <I18nContextProvider value={i18nProvider}>
                <Unauthorized />
            </I18nContextProvider>
        </TestMemoryRouter>
    );
};

const authProvider = {
    login: () => Promise.resolve(),
    logout: () => Promise.resolve(),
    checkAuth: () => Promise.resolve(),
    checkError: () => Promise.resolve(),
    getPermissions: () => Promise.resolve(),
    canAccess: ({ resource }) => Promise.resolve(resource === 'posts'),
};

export const FullApp = () => (
    <TestMemoryRouter>
        <AdminContext
            dataProvider={testDataProvider()}
            authProvider={authProvider}
            i18nProvider={i18nProvider}
        >
            <AdminUI>
                <Resource name="users" list={UserList} />
                <Resource name="posts" list={PostList} />
            </AdminUI>
        </AdminContext>
    </TestMemoryRouter>
);

const UserList = () => <div style={{ marginTop: 10 }}>User list</div>;
const PostList = () => (
    <div style={{ marginTop: 10 }}>
        <div>Post list</div>
        <div>
            <Link to="/users">User list</Link>
        </div>
    </div>
);
