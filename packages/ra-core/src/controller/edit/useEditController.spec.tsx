import * as React from 'react';
import expect from 'expect';
import { screen, act, waitFor } from '@testing-library/react';
import { renderWithRedux } from 'ra-test';
import { MemoryRouter, Route } from 'react-router';
import { QueryClientProvider, QueryClient } from 'react-query';

import { EditController } from './EditController';
import { DataProviderContext } from '../../dataProvider';
import { DataProvider } from '../../types';
import { SaveContextProvider } from '..';
import undoableEventEmitter from '../../dataProvider//undoableEventEmitter';

describe('useEditController', () => {
    const defaultProps = {
        id: 12,
        resource: 'posts',
        debounce: 200,
    };

    const saveContextValue = {
        save: jest.fn(),
        setOnFailure: jest.fn(),
    };

    it('should call the dataProvider.getOne() function on mount', async () => {
        const getOne = jest
            .fn()
            .mockImplementationOnce(() =>
                Promise.resolve({ data: { id: 12, title: 'hello' } })
            );
        const dataProvider = ({ getOne } as unknown) as DataProvider;
        const { queryAllByText, unmount } = renderWithRedux(
            <QueryClientProvider client={new QueryClient()}>
                <DataProviderContext.Provider value={dataProvider}>
                    <SaveContextProvider value={saveContextValue}>
                        <EditController {...defaultProps}>
                            {({ record }) => (
                                <div>{record && record.title}</div>
                            )}
                        </EditController>
                    </SaveContextProvider>
                </DataProviderContext.Provider>
            </QueryClientProvider>
        );
        await waitFor(() => {
            expect(getOne).toHaveBeenCalled();
            expect(queryAllByText('hello')).toHaveLength(1);
        });

        unmount();
    });

    it('should decode the id from the route params', async () => {
        const getOne = jest
            .fn()
            .mockImplementationOnce(() =>
                Promise.resolve({ data: { id: 'test?', title: 'hello' } })
            );
        const dataProvider = ({ getOne } as unknown) as DataProvider;
        const { unmount } = renderWithRedux(
            <MemoryRouter initialEntries={['/posts/test%3F']}>
                <Route path="/posts/:id">
                    <QueryClientProvider client={new QueryClient()}>
                        <DataProviderContext.Provider value={dataProvider}>
                            <SaveContextProvider value={saveContextValue}>
                                <EditController resource="posts">
                                    {({ record }) => (
                                        <div>{record && record.title}</div>
                                    )}
                                </EditController>
                            </SaveContextProvider>
                        </DataProviderContext.Provider>
                    </QueryClientProvider>
                </Route>
            </MemoryRouter>
        );
        await waitFor(() => {
            expect(getOne).toHaveBeenCalledWith('posts', { id: 'test?' });
        });

        unmount();
    });

    it('should accept custom client query options', async () => {
        const mock = jest.spyOn(console, 'error').mockImplementation(() => {});
        const getOne = jest
            .fn()
            .mockImplementationOnce(() => Promise.reject(new Error()));
        const onError = jest.fn();
        const dataProvider = ({ getOne } as unknown) as DataProvider;
        renderWithRedux(
            <QueryClientProvider client={new QueryClient()}>
                <DataProviderContext.Provider value={dataProvider}>
                    <EditController
                        {...defaultProps}
                        resource="posts"
                        queryOptions={{ onError }}
                    >
                        {() => <div />}
                    </EditController>
                </DataProviderContext.Provider>
            </QueryClientProvider>
        );
        await waitFor(() => {
            expect(getOne).toHaveBeenCalled();
            expect(onError).toHaveBeenCalled();
        });
        mock.mockRestore();
    });

    it('should call the dataProvider.update() function on save', async () => {
        const update = jest
            .fn()
            .mockImplementationOnce((_, { id, data, previousData }) =>
                Promise.resolve({ data: { id, ...previousData, ...data } })
            );
        const dataProvider = ({
            getOne: () => Promise.resolve({ data: { id: 12 } }),
            update,
        } as unknown) as DataProvider;
        let saveCallback;
        renderWithRedux(
            <QueryClientProvider client={new QueryClient()}>
                <DataProviderContext.Provider value={dataProvider}>
                    <SaveContextProvider value={saveContextValue}>
                        <EditController
                            {...defaultProps}
                            mutationMode="pessimistic"
                        >
                            {({ save }) => {
                                saveCallback = save;
                                return null;
                            }}
                        </EditController>
                    </SaveContextProvider>
                </DataProviderContext.Provider>
            </QueryClientProvider>
        );
        await act(async () => saveCallback({ foo: 'bar' }));
        expect(update).toHaveBeenCalledWith('posts', {
            id: 12,
            data: { foo: 'bar' },
            previousData: undefined,
        });
    });

    it('should return an undoable save callback by default', async () => {
        let post = { id: 12 };
        const update = jest
            .fn()
            .mockImplementationOnce((_, { id, data, previousData }) => {
                post = { ...previousData, ...data };
                return Promise.resolve({ data: post });
            });
        const dataProvider = ({
            getOne: () => Promise.resolve({ data: post }),
            update,
        } as unknown) as DataProvider;
        let saveCallback;
        renderWithRedux(
            <QueryClientProvider client={new QueryClient()}>
                <DataProviderContext.Provider value={dataProvider}>
                    <SaveContextProvider value={saveContextValue}>
                        <EditController {...defaultProps}>
                            {({ save, record }) => {
                                saveCallback = save;
                                return <>{JSON.stringify(record)}</>;
                            }}
                        </EditController>
                    </SaveContextProvider>
                </DataProviderContext.Provider>
            </QueryClientProvider>
        );
        await new Promise(resolve => setTimeout(resolve, 10));
        screen.getByText('{"id":12}');
        await act(async () => saveCallback({ foo: 'bar' }));
        await new Promise(resolve => setTimeout(resolve, 10));
        screen.getByText('{"id":12,"foo":"bar"}');
        expect(update).not.toHaveBeenCalledWith('posts', {
            id: 12,
            data: { foo: 'bar' },
            previousData: { id: 12 },
        });
        undoableEventEmitter.emit('end', { isUndo: false });
        await new Promise(resolve => setTimeout(resolve, 10));
        screen.getByText('{"id":12,"foo":"bar"}');
        expect(update).toHaveBeenCalledWith('posts', {
            id: 12,
            data: { foo: 'bar' },
            previousData: { id: 12 },
        });
    });

    it('should return an immediate save callback when mutationMode is pessimistic', async () => {
        let post = { id: 12 };
        const update = jest
            .fn()
            .mockImplementationOnce((_, { id, data, previousData }) => {
                post = { ...previousData, ...data };
                return Promise.resolve({ data: post });
            });
        const dataProvider = ({
            getOne: () => Promise.resolve({ data: post }),
            update,
        } as unknown) as DataProvider;
        let saveCallback;
        renderWithRedux(
            <QueryClientProvider client={new QueryClient()}>
                <DataProviderContext.Provider value={dataProvider}>
                    <SaveContextProvider value={saveContextValue}>
                        <EditController
                            {...defaultProps}
                            mutationMode="pessimistic"
                        >
                            {({ save, record }) => {
                                saveCallback = save;
                                return <>{JSON.stringify(record)}</>;
                            }}
                        </EditController>
                    </SaveContextProvider>
                </DataProviderContext.Provider>
            </QueryClientProvider>
        );
        await new Promise(resolve => setTimeout(resolve, 10));
        screen.getByText('{"id":12}');
        await act(async () => saveCallback({ foo: 'bar' }));
        await new Promise(resolve => setTimeout(resolve, 10));
        screen.getByText('{"id":12,"foo":"bar"}');
        expect(update).toHaveBeenCalledWith('posts', {
            id: 12,
            data: { foo: 'bar' },
            previousData: { id: 12 },
        });
    });

    it('should execute success side effects on success in pessimistic mode', async () => {
        let saveCallback;
        const dataProvider = ({
            getOne: () => Promise.resolve({ data: { id: 12 } }),
            update: (_, { id, data, previousData }) =>
                Promise.resolve({ data: { id, ...previousData, ...data } }),
        } as unknown) as DataProvider;
        const { dispatch } = renderWithRedux(
            <QueryClientProvider client={new QueryClient()}>
                <DataProviderContext.Provider value={dataProvider}>
                    <SaveContextProvider value={saveContextValue}>
                        <EditController
                            {...defaultProps}
                            mutationMode="pessimistic"
                        >
                            {({ save }) => {
                                saveCallback = save;
                                return null;
                            }}
                        </EditController>
                    </SaveContextProvider>
                </DataProviderContext.Provider>
            </QueryClientProvider>
        );
        await act(async () => saveCallback({ foo: 'bar' }));
        await new Promise(resolve => setTimeout(resolve, 10));
        expect(dispatch).toHaveBeenCalledWith(
            expect.objectContaining({
                type: 'RA/SHOW_NOTIFICATION',
            })
        );
    });

    it('should allow mutationOptions to override the default success side effects in pessimistic mode', async () => {
        let saveCallback;
        const dataProvider = ({
            getOne: () => Promise.resolve({ data: { id: 12 } }),
            update: (_, { id, data, previousData }) =>
                Promise.resolve({ data: { id, ...previousData, ...data } }),
        } as unknown) as DataProvider;
        const onSuccess = jest.fn();
        const { dispatch } = renderWithRedux(
            <QueryClientProvider client={new QueryClient()}>
                <DataProviderContext.Provider value={dataProvider}>
                    <SaveContextProvider value={saveContextValue}>
                        <EditController
                            {...defaultProps}
                            mutationMode="pessimistic"
                            mutationOptions={{ onSuccess }}
                        >
                            {({ save }) => {
                                saveCallback = save;
                                return null;
                            }}
                        </EditController>
                    </SaveContextProvider>
                </DataProviderContext.Provider>
            </QueryClientProvider>
        );
        await act(async () => saveCallback({ foo: 'bar' }));
        await new Promise(resolve => setTimeout(resolve, 10));
        expect(onSuccess).toHaveBeenCalled();
        expect(dispatch).not.toHaveBeenCalledWith(
            expect.objectContaining({
                type: 'RA/SHOW_NOTIFICATION',
            })
        );
    });

    it('should allow mutationOptions to override the default success side effects in optimistic mode', async () => {
        let saveCallback;
        const dataProvider = ({
            getOne: () => Promise.resolve({ data: { id: 12 } }),
            update: (_, { id, data, previousData }) =>
                Promise.resolve({ data: { id, ...previousData, ...data } }),
        } as unknown) as DataProvider;
        const onSuccess = jest.fn();
        const { dispatch } = renderWithRedux(
            <QueryClientProvider client={new QueryClient()}>
                <DataProviderContext.Provider value={dataProvider}>
                    <SaveContextProvider value={saveContextValue}>
                        <EditController
                            {...defaultProps}
                            mutationMode="optimistic"
                            mutationOptions={{ onSuccess }}
                        >
                            {({ save }) => {
                                saveCallback = save;
                                return null;
                            }}
                        </EditController>
                    </SaveContextProvider>
                </DataProviderContext.Provider>
            </QueryClientProvider>
        );
        await act(async () => saveCallback({ foo: 'bar' }));
        await new Promise(resolve => setTimeout(resolve, 10));
        expect(onSuccess).toHaveBeenCalled();
        expect(dispatch).not.toHaveBeenCalledWith(
            expect.objectContaining({
                type: 'RA/SHOW_NOTIFICATION',
            })
        );
    });

    it('should allow mutationOptions to override the default success side effects in undoable mode', async () => {
        let saveCallback;
        const dataProvider = ({
            getOne: () => Promise.resolve({ data: { id: 12 } }),
            update: (_, { id, data, previousData }) =>
                Promise.resolve({ data: { id, ...previousData, ...data } }),
        } as unknown) as DataProvider;
        const onSuccess = jest.fn();
        const { dispatch } = renderWithRedux(
            <QueryClientProvider client={new QueryClient()}>
                <DataProviderContext.Provider value={dataProvider}>
                    <SaveContextProvider value={saveContextValue}>
                        <EditController
                            {...defaultProps}
                            mutationOptions={{ onSuccess }}
                        >
                            {({ save }) => {
                                saveCallback = save;
                                return null;
                            }}
                        </EditController>
                    </SaveContextProvider>
                </DataProviderContext.Provider>
            </QueryClientProvider>
        );
        await act(async () => saveCallback({ foo: 'bar' }));
        await new Promise(resolve => setTimeout(resolve, 10));
        expect(onSuccess).toHaveBeenCalled();
        expect(dispatch).not.toHaveBeenCalledWith(
            expect.objectContaining({
                type: 'RA/SHOW_NOTIFICATION',
            })
        );
    });

    it('should allow the save onSuccess option to override the success side effects override', async () => {
        let saveCallback;
        const dataProvider = ({
            getOne: () => Promise.resolve({ data: { id: 12 } }),
            update: (_, { id, data, previousData }) =>
                Promise.resolve({ data: { id, ...previousData, ...data } }),
        } as unknown) as DataProvider;
        const onSuccess = jest.fn();
        const onSuccessSave = jest.fn();
        const { dispatch } = renderWithRedux(
            <QueryClientProvider client={new QueryClient()}>
                <DataProviderContext.Provider value={dataProvider}>
                    <SaveContextProvider value={saveContextValue}>
                        <EditController
                            {...defaultProps}
                            mutationMode="pessimistic"
                            mutationOptions={{ onSuccess }}
                        >
                            {({ save }) => {
                                saveCallback = save;
                                return null;
                            }}
                        </EditController>
                    </SaveContextProvider>
                </DataProviderContext.Provider>
            </QueryClientProvider>
        );
        await act(async () =>
            saveCallback({ foo: 'bar' }, undefined, {
                onSuccess: onSuccessSave,
            })
        );
        expect(onSuccess).not.toHaveBeenCalled();
        expect(onSuccessSave).toHaveBeenCalled();
        expect(dispatch).not.toHaveBeenCalledWith(
            expect.objectContaining({
                type: 'RA/SHOW_NOTIFICATION',
            })
        );
    });

    it('should execute error side effects on error in pessimistic mode', async () => {
        jest.spyOn(console, 'error').mockImplementationOnce(() => {});
        let saveCallback;
        const dataProvider = ({
            getOne: () => Promise.resolve({ data: { id: 12 } }),
            update: () => Promise.reject({ message: 'not good' }),
        } as unknown) as DataProvider;
        const { dispatch } = renderWithRedux(
            <QueryClientProvider client={new QueryClient()}>
                <DataProviderContext.Provider value={dataProvider}>
                    <SaveContextProvider value={saveContextValue}>
                        <EditController
                            {...defaultProps}
                            mutationMode="pessimistic"
                        >
                            {({ save }) => {
                                saveCallback = save;
                                return null;
                            }}
                        </EditController>
                    </SaveContextProvider>
                </DataProviderContext.Provider>
            </QueryClientProvider>
        );
        await act(async () => saveCallback({ foo: 'bar' }));
        await new Promise(resolve => setTimeout(resolve, 10));
        expect(dispatch).toHaveBeenCalledWith({
            type: 'RA/SHOW_NOTIFICATION',
            payload: {
                type: 'warning',
                message: 'not good',
                messageArgs: { _: 'not good' },
            },
        });
    });

    it('should allow mutationOptions to override the default failure side effects in pessimistic mode', async () => {
        jest.spyOn(console, 'error').mockImplementationOnce(() => {});
        let saveCallback;
        const dataProvider = ({
            getOne: () => Promise.resolve({ data: { id: 12 } }),
            update: () => Promise.reject({ message: 'not good' }),
        } as unknown) as DataProvider;
        const onError = jest.fn();
        const { dispatch } = renderWithRedux(
            <QueryClientProvider client={new QueryClient()}>
                <DataProviderContext.Provider value={dataProvider}>
                    <SaveContextProvider value={saveContextValue}>
                        <EditController
                            {...defaultProps}
                            mutationMode="pessimistic"
                            mutationOptions={{ onError }}
                        >
                            {({ save }) => {
                                saveCallback = save;
                                return null;
                            }}
                        </EditController>
                    </SaveContextProvider>
                </DataProviderContext.Provider>
            </QueryClientProvider>
        );
        await act(async () => saveCallback({ foo: 'bar' }));
        await new Promise(resolve => setTimeout(resolve, 10));
        expect(onError).toHaveBeenCalled();
        expect(dispatch).not.toHaveBeenCalledWith({
            type: 'RA/SHOW_NOTIFICATION',
            payload: {
                type: 'warning',
                message: 'not good',
                messageArgs: { _: 'not good' },
            },
        });
    });

    it('should allow mutationOptions to override the default failure side effects in optimistic mode', async () => {
        jest.spyOn(console, 'error').mockImplementationOnce(() => {});
        let saveCallback;
        const dataProvider = ({
            getOne: () => Promise.resolve({ data: { id: 12 } }),
            update: () => Promise.reject({ message: 'not good' }),
        } as unknown) as DataProvider;
        const onError = jest.fn();
        const { dispatch } = renderWithRedux(
            <QueryClientProvider client={new QueryClient()}>
                <DataProviderContext.Provider value={dataProvider}>
                    <SaveContextProvider value={saveContextValue}>
                        <EditController
                            {...defaultProps}
                            mutationMode="optimistic"
                            mutationOptions={{ onError }}
                        >
                            {({ save }) => {
                                saveCallback = save;
                                return null;
                            }}
                        </EditController>
                    </SaveContextProvider>
                </DataProviderContext.Provider>
            </QueryClientProvider>
        );
        await act(async () => saveCallback({ foo: 'bar' }));
        await new Promise(resolve => setTimeout(resolve, 10));
        expect(onError).toHaveBeenCalled();
        expect(dispatch).not.toHaveBeenCalledWith({
            type: 'RA/SHOW_NOTIFICATION',
            payload: {
                type: 'warning',
                message: 'not good',
                messageArgs: { _: 'not good' },
            },
        });
    });

    it('should allow the save onFailure option to override the failure side effects override', async () => {
        jest.spyOn(console, 'error').mockImplementationOnce(() => {});
        let saveCallback;
        const dataProvider = ({
            getOne: () => Promise.resolve({ data: { id: 12 } }),
            update: () => Promise.reject({ message: 'not good' }),
        } as unknown) as DataProvider;
        const onError = jest.fn();
        const onFailureSave = jest.fn();
        const { dispatch } = renderWithRedux(
            <QueryClientProvider client={new QueryClient()}>
                <DataProviderContext.Provider value={dataProvider}>
                    <SaveContextProvider value={saveContextValue}>
                        <EditController
                            {...defaultProps}
                            mutationMode="pessimistic"
                            mutationOptions={{ onError }}
                        >
                            {({ save }) => {
                                saveCallback = save;
                                return null;
                            }}
                        </EditController>
                    </SaveContextProvider>
                </DataProviderContext.Provider>
            </QueryClientProvider>
        );
        await act(async () =>
            saveCallback({ foo: 'bar' }, undefined, {
                onFailure: onFailureSave,
            })
        );
        expect(onError).not.toHaveBeenCalled();
        expect(onFailureSave).toHaveBeenCalled();
        const notify = dispatch.mock.calls.find(
            params => params[0].type === 'RA/SHOW_NOTIFICATION'
        );
        expect(notify).toBeUndefined();
    });

    it('should allow transform to transform the data before save', async () => {
        let saveCallback;
        const update = jest
            .fn()
            .mockImplementationOnce((_, { id, data }) =>
                Promise.resolve({ data: { id, ...data } })
            );
        const dataProvider = ({
            getOne: () => Promise.resolve({ data: { id: 12 } }),
            update,
        } as unknown) as DataProvider;
        const transform = jest.fn().mockImplementationOnce(data => ({
            ...data,
            transformed: true,
        }));
        renderWithRedux(
            <QueryClientProvider client={new QueryClient()}>
                <DataProviderContext.Provider value={dataProvider}>
                    <SaveContextProvider value={saveContextValue}>
                        <EditController
                            {...defaultProps}
                            mutationMode="pessimistic"
                            transform={transform}
                        >
                            {({ save }) => {
                                saveCallback = save;
                                return null;
                            }}
                        </EditController>
                    </SaveContextProvider>
                </DataProviderContext.Provider>
            </QueryClientProvider>
        );
        await act(async () => saveCallback({ foo: 'bar' }));
        expect(transform).toHaveBeenCalledWith({
            foo: 'bar',
        });
        expect(update).toHaveBeenCalledWith('posts', {
            id: 12,
            data: { foo: 'bar', transformed: true },
            previousData: undefined,
        });
    });

    it('should the save transform option to override the transform side effect', async () => {
        let saveCallback;
        const update = jest
            .fn()
            .mockImplementationOnce((_, { id, data }) =>
                Promise.resolve({ data: { id, ...data } })
            );
        const dataProvider = ({
            getOne: () => Promise.resolve({ data: { id: 12 } }),
            update,
        } as unknown) as DataProvider;
        const transform = jest.fn();
        const transformSave = jest.fn().mockImplementationOnce(data => ({
            ...data,
            transformed: true,
        }));
        renderWithRedux(
            <QueryClientProvider client={new QueryClient()}>
                <DataProviderContext.Provider value={dataProvider}>
                    <SaveContextProvider value={saveContextValue}>
                        <EditController
                            {...defaultProps}
                            mutationMode="pessimistic"
                            transform={transform}
                        >
                            {({ save }) => {
                                saveCallback = save;
                                return null;
                            }}
                        </EditController>
                    </SaveContextProvider>
                </DataProviderContext.Provider>
            </QueryClientProvider>
        );
        await act(async () =>
            saveCallback({ foo: 'bar' }, undefined, {
                transform: transformSave,
            })
        );
        expect(transform).not.toHaveBeenCalled();
        expect(transformSave).toHaveBeenCalledWith({
            foo: 'bar',
        });
        expect(update).toHaveBeenCalledWith('posts', {
            id: 12,
            data: { foo: 'bar', transformed: true },
            previousData: undefined,
        });
    });
});
