import * as React from 'react';
import expect from 'expect';
import { render, screen, waitFor } from '@testing-library/react';
import { Route, Routes } from 'react-router';
import { ShowController } from './ShowController';

import { CoreAdminContext } from '../../core';
import { AuthProvider, DataProvider } from '../../types';
import { TestMemoryRouter } from '../../routing';
import { testDataProvider } from '../../dataProvider';
import { Authenticated } from './useShowController.security.stories';

describe('useShowController', () => {
    const defaultProps = {
        id: 12,
        resource: 'posts',
        debounce: 200,
    };

    it('should call the dataProvider.getOne() function on mount', async () => {
        const getOne = jest
            .fn()
            .mockImplementationOnce(() =>
                Promise.resolve({ data: { id: 12, title: 'hello' } })
            );
        const dataProvider = { getOne } as unknown as DataProvider;
        render(
            <CoreAdminContext dataProvider={dataProvider}>
                <ShowController {...defaultProps}>
                    {({ record }) => <div>{record && record.title}</div>}
                </ShowController>
            </CoreAdminContext>
        );
        await waitFor(() => {
            expect(getOne).toHaveBeenCalled();
            expect(screen.queryAllByText('hello')).toHaveLength(1);
        });
    });

    it('should decode the id from the route params', async () => {
        const getOne = jest
            .fn()
            .mockImplementationOnce(() =>
                Promise.resolve({ data: { id: 'test?', title: 'hello' } })
            );
        const dataProvider = { getOne } as unknown as DataProvider;
        render(
            <TestMemoryRouter initialEntries={['/posts/test%3F']}>
                <CoreAdminContext dataProvider={dataProvider}>
                    <Routes>
                        <Route
                            path="posts/:id"
                            element={
                                <ShowController resource="posts">
                                    {({ record }) => (
                                        <div>{record && record.title}</div>
                                    )}
                                </ShowController>
                            }
                        />
                    </Routes>
                </CoreAdminContext>
            </TestMemoryRouter>
        );
        await waitFor(() => {
            expect(getOne).toHaveBeenCalledWith('posts', {
                id: 'test?',
                signal: undefined,
            });
        });
        await waitFor(() => {
            expect(screen.queryAllByText('hello')).toHaveLength(1);
        });
    });

    it('should use the id provided through props if any', async () => {
        const getOne = jest
            .fn()
            .mockImplementationOnce(() =>
                Promise.resolve({ data: { id: 0, title: 'hello' } })
            );
        const dataProvider = { getOne } as unknown as DataProvider;
        render(
            <TestMemoryRouter initialEntries={['/posts/test%3F']}>
                <CoreAdminContext dataProvider={dataProvider}>
                    <Routes>
                        <Route
                            path="posts/:id"
                            element={
                                <ShowController id={0} resource="posts">
                                    {({ record }) => (
                                        <div>{record && record.title}</div>
                                    )}
                                </ShowController>
                            }
                        />
                    </Routes>
                </CoreAdminContext>
            </TestMemoryRouter>
        );
        await waitFor(() => {
            expect(getOne).toHaveBeenCalledWith('posts', {
                id: 0,
                signal: undefined,
            });
        });
        await waitFor(() => {
            expect(screen.queryAllByText('hello')).toHaveLength(1);
        });
    });

    it('should accept custom client query options', async () => {
        const mock = jest.spyOn(console, 'error').mockImplementation(() => {});
        const getOne = jest
            .fn()
            .mockImplementationOnce(() => Promise.reject(new Error()));
        const onError = jest.fn();
        const dataProvider = { getOne } as unknown as DataProvider;
        render(
            <TestMemoryRouter initialEntries={['/posts/1']}>
                <CoreAdminContext dataProvider={dataProvider}>
                    <Routes>
                        <Route
                            path="posts/:id"
                            element={
                                <ShowController
                                    resource="posts"
                                    queryOptions={{ onError }}
                                >
                                    {() => <div />}
                                </ShowController>
                            }
                        />
                    </Routes>
                </CoreAdminContext>
            </TestMemoryRouter>
        );
        await waitFor(() => {
            expect(getOne).toHaveBeenCalled();
            expect(onError).toHaveBeenCalled();
        });
        mock.mockRestore();
    });

    it('should accept meta in queryOptions', async () => {
        const getOne = jest
            .fn()
            .mockImplementationOnce(() =>
                Promise.resolve({ data: { id: 0, title: 'hello' } })
            );

        const dataProvider = { getOne } as unknown as DataProvider;
        render(
            <TestMemoryRouter initialEntries={['/posts/1']}>
                <CoreAdminContext dataProvider={dataProvider}>
                    <Routes>
                        <Route
                            path="posts/:id"
                            element={
                                <ShowController
                                    resource="posts"
                                    queryOptions={{ meta: { foo: 'bar' } }}
                                >
                                    {() => <div />}
                                </ShowController>
                            }
                        />
                    </Routes>
                </CoreAdminContext>
            </TestMemoryRouter>
        );
        await waitFor(() => {
            expect(getOne).toHaveBeenCalledWith('posts', {
                id: '1',
                meta: { foo: 'bar' },
                signal: undefined,
            });
        });
    });

    describe('security', () => {
        it('should not call the dataProvider until the authentication check pass', async () => {
            const authProvider: AuthProvider = {
                checkAuth: jest.fn(
                    () => new Promise(resolve => setTimeout(resolve, 500))
                ),
                login: () => Promise.resolve(),
                logout: () => Promise.resolve(),
                checkError: () => Promise.resolve(),
                getPermissions: () => Promise.resolve(),
            };
            const dataProvider = testDataProvider({
                // @ts-ignore
                getOne: jest.fn(() =>
                    Promise.resolve({
                        data: { id: 1, title: 'A post', votes: 0 },
                    })
                ),
            });

            render(
                <Authenticated
                    authProvider={authProvider}
                    dataProvider={dataProvider}
                />
            );
            await waitFor(() => {
                expect(authProvider.checkAuth).toHaveBeenCalled();
            });
            expect(dataProvider.getOne).not.toHaveBeenCalled();
            await screen.findByText('A post - 0 votes');
        });
    });
});
