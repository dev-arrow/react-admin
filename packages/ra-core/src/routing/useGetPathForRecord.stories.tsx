import * as React from 'react';
import { useGetPathForRecord } from './useGetPathForRecord';
import { Link } from 'react-router-dom';
import {
    CoreAdminContext,
    RecordContextProvider,
    ResourceContextProvider,
    ResourceDefinitionContextProvider,
} from '..';
import { QueryClient } from '@tanstack/react-query';

export default {
    title: 'ra-core/routing/useGetPathForRecord',
};

const EditLink = () => {
    const path = useGetPathForRecord({ link: 'edit' });
    return path ? <Link to={path}>Edit</Link> : <span>Edit no link</span>;
};

const ShowLink = () => {
    const path = useGetPathForRecord({ link: 'show' });
    return path ? <Link to={path}>Show</Link> : <span>Show no link</span>;
};

const InferredLink = () => {
    const path = useGetPathForRecord();
    return path ? <Link to={path}>Link</Link> : <span>No link</span>;
};

export const NoAuthProvider = () => (
    <CoreAdminContext>
        <ResourceContextProvider value="posts">
            <RecordContextProvider value={{ id: 123 }}>
                <div style={{ display: 'flex', gap: 2 }}>
                    <EditLink />
                    <ShowLink />
                </div>
            </RecordContextProvider>
        </ResourceContextProvider>
    </CoreAdminContext>
);

export const InferredEditLink = () => (
    <CoreAdminContext>
        <ResourceContextProvider value="posts">
            <ResourceDefinitionContextProvider
                definitions={{
                    posts: { name: 'posts', hasEdit: true, hasShow: false },
                }}
            >
                <RecordContextProvider value={{ id: 123 }}>
                    <div style={{ display: 'flex', gap: 2 }}>
                        <InferredLink />
                    </div>
                </RecordContextProvider>
            </ResourceDefinitionContextProvider>
        </ResourceContextProvider>
    </CoreAdminContext>
);

export const InferredShowLink = () => (
    <CoreAdminContext>
        <ResourceContextProvider value="posts">
            <ResourceDefinitionContextProvider
                definitions={{
                    posts: { name: 'posts', hasEdit: false, hasShow: true },
                }}
            >
                <RecordContextProvider value={{ id: 123 }}>
                    <div style={{ display: 'flex', gap: 2 }}>
                        <InferredLink />
                    </div>
                </RecordContextProvider>
            </ResourceDefinitionContextProvider>
        </ResourceContextProvider>
    </CoreAdminContext>
);

export const AccessControl = () => (
    <CoreAdminContext
        queryClient={new QueryClient()}
        authProvider={{
            login: () => Promise.resolve(),
            logout: () => Promise.resolve(),
            checkAuth: () => Promise.resolve(),
            checkError: () => Promise.resolve(),
            getPermissions: () => Promise.resolve(),
            canAccess: ({ action }) =>
                new Promise(resolve =>
                    setTimeout(resolve, 300, action === 'edit')
                ),
        }}
    >
        <ResourceContextProvider value="posts">
            <RecordContextProvider value={{ id: 123 }}>
                <div style={{ display: 'flex', gap: 2 }}>
                    <EditLink />
                    <ShowLink />
                </div>
            </RecordContextProvider>
        </ResourceContextProvider>
    </CoreAdminContext>
);

export const InferredEditLinkWithAccessControl = () => (
    <CoreAdminContext
        queryClient={new QueryClient()}
        authProvider={{
            login: () => Promise.resolve(),
            logout: () => Promise.resolve(),
            checkAuth: () => Promise.resolve(),
            checkError: () => Promise.resolve(),
            getPermissions: () => Promise.resolve(),
            canAccess: ({ action }) =>
                new Promise(resolve =>
                    setTimeout(resolve, 300, action === 'edit')
                ),
        }}
    >
        <ResourceContextProvider value="posts">
            <ResourceDefinitionContextProvider
                definitions={{
                    posts: { name: 'posts', hasEdit: true, hasShow: false },
                }}
            >
                <RecordContextProvider value={{ id: 123 }}>
                    <div style={{ display: 'flex', gap: 2 }}>
                        <InferredLink />
                    </div>
                </RecordContextProvider>
            </ResourceDefinitionContextProvider>
        </ResourceContextProvider>
    </CoreAdminContext>
);

export const InferredShowLinkWithAccessControl = () => (
    <CoreAdminContext
        queryClient={new QueryClient()}
        authProvider={{
            login: () => Promise.resolve(),
            logout: () => Promise.resolve(),
            checkAuth: () => Promise.resolve(),
            checkError: () => Promise.resolve(),
            getPermissions: () => Promise.resolve(),
            canAccess: ({ action }) =>
                new Promise(resolve =>
                    setTimeout(resolve, 300, action === 'show')
                ),
        }}
    >
        <ResourceContextProvider value="posts">
            <ResourceDefinitionContextProvider
                definitions={{
                    posts: { name: 'posts', hasEdit: false, hasShow: true },
                }}
            >
                <RecordContextProvider value={{ id: 123 }}>
                    <div style={{ display: 'flex', gap: 2 }}>
                        <InferredLink />
                    </div>
                </RecordContextProvider>
            </ResourceDefinitionContextProvider>
        </ResourceContextProvider>
    </CoreAdminContext>
);
