import React, { useState, useEffect } from 'react';
import { cleanup, act, fireEvent } from '@testing-library/react';
import expect from 'expect';

import renderWithRedux from '../util/renderWithRedux';
import useDataProvider from './useDataProvider';
import useUpdate from './useUpdate';
import { DataProviderContext } from '../dataProvider';
import { useRefresh } from '../sideEffect';

const UseGetOne = () => {
    const [data, setData] = useState();
    const [error, setError] = useState();
    const dataProvider = useDataProvider();
    useEffect(() => {
        dataProvider
            .getOne('posts', { id: 1 })
            .then(res => setData(res.data))
            .catch(e => setError(e));
    }, [dataProvider]);
    if (error) return <div data-testid="error">{error.message}</div>;
    if (data) return <div data-testid="data">{JSON.stringify(data)}</div>;
    return <div data-testid="loading">loading</div>;
};

describe('useDataProvider', () => {
    afterEach(cleanup);

    it('should return a way to call the dataProvider', async () => {
        const getOne = jest.fn(() =>
            Promise.resolve({ data: { id: 1, title: 'foo' } })
        );
        const dataProvider = { getOne };
        const { queryByTestId } = renderWithRedux(
            <DataProviderContext.Provider value={dataProvider}>
                <UseGetOne />
            </DataProviderContext.Provider>
        );
        expect(queryByTestId('loading')).not.toBeNull();
        await act(async () => {
            await new Promise(resolve => setTimeout(resolve));
        });
        expect(getOne).toBeCalledTimes(1);
        expect(queryByTestId('loading')).toBeNull();
        expect(queryByTestId('data').textContent).toBe(
            '{"id":1,"title":"foo"}'
        );
    });

    it('should handle async errors in the dataProvider', async () => {
        jest.spyOn(console, 'error').mockImplementationOnce(() => {});
        const getOne = jest.fn(() => Promise.reject(new Error('foo')));
        const dataProvider = { getOne };
        const { queryByTestId } = renderWithRedux(
            <DataProviderContext.Provider value={dataProvider}>
                <UseGetOne />
            </DataProviderContext.Provider>
        );
        expect(queryByTestId('loading')).not.toBeNull();
        await act(async () => {
            await new Promise(resolve => setTimeout(resolve));
        });
        expect(getOne).toBeCalledTimes(1);
        expect(queryByTestId('loading')).toBeNull();
        expect(queryByTestId('error').textContent).toBe('foo');
    });

    it('should throw a meaningful error when the dataProvider throws a sync error', async () => {
        const c = jest.spyOn(console, 'error').mockImplementation(() => {});
        const getOne = jest.fn(() => {
            throw new Error('foo');
        });
        const dataProvider = { getOne };
        const r = () =>
            renderWithRedux(
                <DataProviderContext.Provider value={dataProvider}>
                    <UseGetOne />
                </DataProviderContext.Provider>
            );
        expect(r).toThrow(
            new Error(
                'The dataProvider threw an error. It should return a rejected Promise instead.'
            )
        );
        c.mockRestore();
    });

    it('should dispatch CUSTOM_FETCH actions by default', async () => {
        const getOne = jest.fn(() => Promise.resolve({ data: null }));
        const dataProvider = { getOne };
        const { dispatch } = renderWithRedux(
            <DataProviderContext.Provider value={dataProvider}>
                <UseGetOne />
            </DataProviderContext.Provider>
        );
        expect(dispatch.mock.calls).toHaveLength(3);
        // wait for the dataProvider to return
        await act(async () => {
            await new Promise(resolve => setTimeout(resolve));
        });
        expect(dispatch.mock.calls).toHaveLength(5);
        expect(dispatch.mock.calls[0][0].type).toBe('CUSTOM_FETCH');
        expect(dispatch.mock.calls[1][0].type).toBe('CUSTOM_FETCH_LOADING');
        expect(dispatch.mock.calls[2][0].type).toBe('RA/FETCH_START');
        expect(dispatch.mock.calls[3][0].type).toBe('CUSTOM_FETCH_SUCCESS');
        expect(dispatch.mock.calls[4][0].type).toBe('RA/FETCH_END');
    });

    describe('options', () => {
        it('should accept an action option to dispatch a custom action', async () => {
            const UseGetOneWithCustomAction = () => {
                const [data, setData] = useState();
                const dataProvider = useDataProvider();
                useEffect(() => {
                    dataProvider
                        .getOne('dummy', {}, { action: 'MY_ACTION' })
                        .then(res => setData(res.data));
                }, [dataProvider]);
                if (data)
                    return <div data-testid="data">{JSON.stringify(data)}</div>;
                return <div data-testid="loading">loading</div>;
            };
            const getOne = jest.fn(() => Promise.resolve({ data: null }));
            const dataProvider = { getOne };
            const { dispatch } = renderWithRedux(
                <DataProviderContext.Provider value={dataProvider}>
                    <UseGetOneWithCustomAction />
                </DataProviderContext.Provider>
            );
            expect(dispatch.mock.calls).toHaveLength(3);
            // wait for the dataProvider to return
            await act(async () => {
                await new Promise(resolve => setTimeout(resolve));
            });
            expect(dispatch.mock.calls).toHaveLength(5);
            expect(dispatch.mock.calls[0][0].type).toBe('MY_ACTION');
            expect(dispatch.mock.calls[1][0].type).toBe('MY_ACTION_LOADING');
            expect(dispatch.mock.calls[2][0].type).toBe('RA/FETCH_START');
            expect(dispatch.mock.calls[3][0].type).toBe('MY_ACTION_SUCCESS');
            expect(dispatch.mock.calls[4][0].type).toBe('RA/FETCH_END');
        });

        it('should accept an onSuccess option to execute on success', async () => {
            const onSuccess = jest.fn();
            const UseGetOneWithOnSuccess = () => {
                const [data, setData] = useState();
                const dataProvider = useDataProvider();
                useEffect(() => {
                    dataProvider
                        .getOne('dummy', {}, { onSuccess })
                        .then(res => setData(res.data));
                }, [dataProvider]);
                if (data)
                    return <div data-testid="data">{JSON.stringify(data)}</div>;
                return <div data-testid="loading">loading</div>;
            };
            const getOne = jest.fn(() =>
                Promise.resolve({ data: { id: 1, foo: 'bar' } })
            );
            const dataProvider = { getOne };
            renderWithRedux(
                <DataProviderContext.Provider value={dataProvider}>
                    <UseGetOneWithOnSuccess />
                </DataProviderContext.Provider>
            );
            expect(onSuccess.mock.calls).toHaveLength(0);
            // wait for the dataProvider to return
            await act(async () => {
                await new Promise(resolve => setTimeout(resolve));
            });
            expect(onSuccess.mock.calls).toHaveLength(1);
            expect(onSuccess.mock.calls[0][0]).toEqual({
                data: { id: 1, foo: 'bar' },
            });
        });

        it('should accept an onFailure option to execute on failure', async () => {
            jest.spyOn(console, 'error').mockImplementationOnce(() => {});
            const onFailure = jest.fn();
            const UseGetOneWithOnFailure = () => {
                const [error, setError] = useState();
                const dataProvider = useDataProvider();
                useEffect(() => {
                    dataProvider
                        .getOne('dummy', {}, { onFailure })
                        .catch(e => setError(e));
                }, [dataProvider]);
                if (error)
                    return <div data-testid="error">{error.message}</div>;
                return <div data-testid="loading">loading</div>;
            };
            const getOne = jest.fn(() => Promise.reject(new Error('foo')));
            const dataProvider = { getOne };
            renderWithRedux(
                <DataProviderContext.Provider value={dataProvider}>
                    <UseGetOneWithOnFailure />
                </DataProviderContext.Provider>
            );
            expect(onFailure.mock.calls).toHaveLength(0);
            // wait for the dataProvider to return
            await act(async () => {
                await new Promise(resolve => setTimeout(resolve));
            });
            expect(onFailure.mock.calls).toHaveLength(1);
            expect(onFailure.mock.calls[0][0]).toEqual(new Error('foo'));
        });
    });

    describe('cache', () => {
        it('should not skip the dataProvider call if there is no cache', async () => {
            const getOne = jest.fn(() => Promise.resolve({ data: { id: 1 } }));
            const dataProvider = { getOne };
            const { rerender } = renderWithRedux(
                <DataProviderContext.Provider value={dataProvider}>
                    <UseGetOne key="1" />
                </DataProviderContext.Provider>,
                { admin: { resources: { posts: { data: {}, list: {} } } } }
            );
            // wait for the dataProvider to return
            await act(async () => await new Promise(r => setTimeout(r)));
            expect(getOne).toBeCalledTimes(1);
            rerender(
                <DataProviderContext.Provider value={dataProvider}>
                    <UseGetOne key="2" />
                </DataProviderContext.Provider>
            );
            // wait for the dataProvider to return
            await act(async () => await new Promise(r => setTimeout(r)));
            expect(getOne).toBeCalledTimes(2);
        });

        it('should skip the dataProvider call if there is a valid cache', async () => {
            const getOne = jest.fn(() => {
                const validUntil = new Date();
                validUntil.setTime(validUntil.getTime() + 1000);
                return Promise.resolve({ data: { id: 1 }, validUntil });
            });
            const dataProvider = { getOne };
            const { rerender } = renderWithRedux(
                <DataProviderContext.Provider value={dataProvider}>
                    <UseGetOne key="1" />
                </DataProviderContext.Provider>,
                { admin: { resources: { posts: { data: {}, list: {} } } } }
            );
            // wait for the dataProvider to return
            await act(async () => await new Promise(r => setTimeout(r)));
            expect(getOne).toBeCalledTimes(1);
            rerender(
                <DataProviderContext.Provider value={dataProvider}>
                    <UseGetOne key="2" />
                </DataProviderContext.Provider>
            );
            // wait for the dataProvider to return
            await act(async () => await new Promise(r => setTimeout(r)));
            expect(getOne).toBeCalledTimes(1);
        });

        it('should not skip the dataProvider call if there is an invalid cache', async () => {
            const getOne = jest.fn(() => {
                const validUntil = new Date();
                validUntil.setTime(validUntil.getTime() - 1000);
                return Promise.resolve({ data: { id: 1 }, validUntil });
            });
            const dataProvider = { getOne };
            const { rerender } = renderWithRedux(
                <DataProviderContext.Provider value={dataProvider}>
                    <UseGetOne key="1" />
                </DataProviderContext.Provider>,
                { admin: { resources: { posts: { data: {}, list: {} } } } }
            );
            // wait for the dataProvider to return
            await act(async () => await new Promise(r => setTimeout(r)));
            expect(getOne).toBeCalledTimes(1);
            rerender(
                <DataProviderContext.Provider value={dataProvider}>
                    <UseGetOne key="2" />
                </DataProviderContext.Provider>
            );
            // wait for the dataProvider to return
            await act(async () => await new Promise(r => setTimeout(r)));
            expect(getOne).toBeCalledTimes(2);
        });

        it('should not use the cache after a refresh', async () => {
            const getOne = jest.fn(() => {
                const validUntil = new Date();
                validUntil.setTime(validUntil.getTime() + 1000);
                return Promise.resolve({ data: { id: 1 }, validUntil });
            });
            const dataProvider = { getOne };
            const Refresh = () => {
                const refresh = useRefresh();
                return <button onClick={() => refresh()}>refresh</button>;
            };
            const { getByText, rerender } = renderWithRedux(
                <DataProviderContext.Provider value={dataProvider}>
                    <UseGetOne key="1" />
                    <Refresh />
                </DataProviderContext.Provider>,
                { admin: { resources: { posts: { data: {}, list: {} } } } }
            );
            // wait for the dataProvider to return
            await act(async () => await new Promise(r => setTimeout(r)));
            // click on the refresh button
            expect(getOne).toBeCalledTimes(1);
            await act(async () => {
                fireEvent.click(getByText('refresh'));
                await new Promise(r => setTimeout(r));
            });
            rerender(
                <DataProviderContext.Provider value={dataProvider}>
                    <UseGetOne key="2" />
                </DataProviderContext.Provider>
            );
            // wait for the dataProvider to return
            await act(async () => await new Promise(r => setTimeout(r)));
            expect(getOne).toBeCalledTimes(2);
        });
    });

    it('should not use the cache after an update', async () => {
        const getOne = jest.fn(() => {
            const validUntil = new Date();
            validUntil.setTime(validUntil.getTime() + 1000);
            return Promise.resolve({ data: { id: 1 }, validUntil });
        });
        const dataProvider = {
            getOne,
            update: () => Promise.resolve({ data: { id: 1, foo: 'bar' } }),
        };
        const Update = () => {
            const [update] = useUpdate('posts', 1, { foo: 'bar ' });
            return <button onClick={() => update()}>update</button>;
        };
        const { getByText, rerender } = renderWithRedux(
            <DataProviderContext.Provider value={dataProvider}>
                <UseGetOne key="1" />
                <Update />
            </DataProviderContext.Provider>,
            { admin: { resources: { posts: { data: {}, list: {} } } } }
        );
        // wait for the dataProvider to return
        await act(async () => await new Promise(r => setTimeout(r)));
        expect(getOne).toBeCalledTimes(1);
        // click on the update button
        await act(async () => {
            fireEvent.click(getByText('update'));
            await new Promise(r => setTimeout(r));
        });
        rerender(
            <DataProviderContext.Provider value={dataProvider}>
                <UseGetOne key="2" />
            </DataProviderContext.Provider>
        );
        // wait for the dataProvider to return
        await act(async () => await new Promise(r => setTimeout(r)));
        expect(getOne).toBeCalledTimes(2);
    });
});
