import * as React from 'react';
import fakeDataProvider from 'ra-data-fakerest';
import { QueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { CoreAdmin, CoreAdminContext, CoreAdminUI, Resource } from '../../core';
import { AuthProvider, DataProvider } from '../../types';
import {
    InfiniteListControllerProps,
    useInfiniteListController,
} from './useInfiniteListController';
import { Browser } from '../../storybook/FakeBrowser';
import { TestMemoryRouter } from '../../routing';

export default {
    title: 'ra-core/controller/list/useInfiniteListController',
};

const styles = {
    mainContainer: {
        margin: '20px 10px',
    },

    ul: {
        marginTop: '20px',
        padding: '10px',
    },
};

const defaultDataProvider = fakeDataProvider(
    {
        posts: [
            { id: 1, title: 'Post #1', votes: 90 },
            { id: 2, title: 'Post #2', votes: 20 },
            { id: 3, title: 'Post #3', votes: 30 },
            { id: 4, title: 'Post #4', votes: 40 },
            { id: 5, title: 'Post #5', votes: 50 },
            { id: 6, title: 'Post #6', votes: 60 },
            { id: 7, title: 'Post #7', votes: 70 },
        ],
    },
    process.env.NODE_ENV === 'development'
);

const Posts = (props: Partial<InfiniteListControllerProps>) => {
    const params = useInfiniteListController({
        resource: 'posts',
        ...props,
    });
    return (
        <div style={styles.mainContainer}>
            {params.isPending ? (
                <p>Loading...</p>
            ) : (
                <div>
                    <ul style={styles.ul}>
                        {params.data?.map(post => (
                            <li key={`post_${post.id}`}>
                                {post.title} - {post.votes} votes
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

const defaultAuthProvider: AuthProvider = {
    checkAuth: () => new Promise(resolve => setTimeout(resolve, 500)),
    login: () => Promise.resolve(),
    logout: () => Promise.resolve(),
    checkError: () => Promise.resolve(),
    getPermissions: () => Promise.resolve(),
};

export const Authenticated = ({
    authProvider = defaultAuthProvider,
    dataProvider = defaultDataProvider,
}: {
    authProvider?: AuthProvider;
    dataProvider?: DataProvider;
}) => {
    return (
        <TestMemoryRouter>
            <CoreAdminContext
                dataProvider={dataProvider}
                authProvider={authProvider}
            >
                <CoreAdminUI>
                    <Resource name="posts" list={Posts} />
                </CoreAdminUI>
            </CoreAdminContext>
        </TestMemoryRouter>
    );
};

export const DisableAuthentication = ({
    authProvider = defaultAuthProvider,
    dataProvider = defaultDataProvider,
}: {
    authProvider?: AuthProvider;
    dataProvider?: DataProvider;
}) => {
    return (
        <TestMemoryRouter>
            <CoreAdminContext
                dataProvider={dataProvider}
                authProvider={authProvider}
            >
                <CoreAdminUI>
                    <Resource
                        name="posts"
                        list={<Posts disableAuthentication />}
                    />
                </CoreAdminUI>
            </CoreAdminContext>
        </TestMemoryRouter>
    );
};

export const CanAccess = ({
    authProviderDelay = 300,
}: {
    authProviderDelay?: number;
}) => {
    return (
        <TestMemoryRouter>
            <AccessControlAdmin
                authProviderDelay={authProviderDelay}
                queryClient={new QueryClient()}
            />
        </TestMemoryRouter>
    );
};

const AccessControlAdmin = ({
    authProviderDelay,
    queryClient,
}: {
    authProviderDelay?: number;
    queryClient: QueryClient;
}) => {
    const [authorizedResources, setAuthorizedResources] = React.useState({
        'posts.list': true,
        'posts.create': false,
        'posts.edit': true,
        'posts.show': false,
    });

    const authProvider: AuthProvider = {
        login: () => Promise.reject(new Error('Not implemented')),
        logout: () => Promise.reject(new Error('Not implemented')),
        checkAuth: () => Promise.resolve(),
        checkError: () => Promise.reject(new Error('Not implemented')),
        getPermissions: () => Promise.resolve(undefined),
        canAccess: ({ action, resource }) =>
            new Promise(resolve => {
                setTimeout(() => {
                    resolve(authorizedResources[`${resource}.${action}`]);
                }, authProviderDelay);
            }),
    };
    return (
        <AccessControlUI
            queryClient={queryClient}
            authorizedResources={authorizedResources}
            setAuthorizedResources={setAuthorizedResources}
        >
            <CoreAdmin
                authProvider={authProvider}
                dataProvider={defaultDataProvider}
                queryClient={queryClient}
                unauthorized={Unauthorized}
                loading={Loading}
                authenticationError={AuthenticationError}
            >
                <Resource name="posts" list={<Posts />} />
            </CoreAdmin>
        </AccessControlUI>
    );
};

const AccessControlUI = ({
    children,
    setAuthorizedResources,
    authorizedResources,
    queryClient,
}: {
    children: React.ReactNode;
    setAuthorizedResources: Function;
    authorizedResources: {
        'posts.list': boolean;
        'posts.create': boolean;
        'posts.edit': boolean;
        'posts.show': boolean;
    };
    queryClient: QueryClient;
}) => {
    return (
        <div>
            <div>
                <label>
                    <input
                        type="checkbox"
                        checked={authorizedResources['posts.list']}
                        onChange={() => {
                            setAuthorizedResources(state => ({
                                ...state,
                                'posts.list':
                                    !authorizedResources['posts.list'],
                            }));

                            queryClient.clear();
                        }}
                    />
                    posts.list access
                </label>
            </div>
            <Browser>{children}</Browser>
        </div>
    );
};

const Unauthorized = () => {
    return (
        <div>
            <div>Unauthorized</div>
            <Link to="/posts">List</Link>
        </div>
    );
};
const AuthenticationError = () => {
    return (
        <div>
            <div>AuthenticationError</div>
        </div>
    );
};

const Loading = () => <div>Loading...</div>;
