import React from 'react';
import {
    render,
    cleanup,
    fireEvent,
    waitForDomChange,
    act,
} from '@testing-library/react';
import expect from 'expect';
import Mutation from './Mutation';
import CoreAdmin from '../CoreAdmin';
import Resource from '../Resource';
import renderWithRedux from '../util/renderWithRedux';
import DataProviderContext from './DataProviderContext';
import TestContext from '../util/TestContext';
import { showNotification, setListSelectedIds, refreshView } from '../actions';
import { useNotify } from '../sideEffect';
import { push } from 'connected-react-router';

describe('useMutation', () => {
    afterEach(cleanup);

    it('should pass a callback to trigger the mutation', () => {
        let callback = null;
        renderWithRedux(
            <Mutation type="foo" resource="bar">
                {mutate => {
                    callback = mutate;
                    return <div data-testid="test">Hello</div>;
                }}
            </Mutation>
        );
        expect(callback).toBeInstanceOf(Function);
    });

    it('should dispatch a fetch action when the mutation callback is triggered', () => {
        const myPayload = {};
        const { getByText, dispatch } = renderWithRedux(
            <Mutation type="mytype" resource="myresource" payload={myPayload}>
                {mutate => <button onClick={mutate}>Hello</button>}
            </Mutation>
        );
        fireEvent.click(getByText('Hello'));
        const action = dispatch.mock.calls[0][0];
        expect(action.type).toEqual('CUSTOM_FETCH');
        expect(action.payload).toEqual(myPayload);
        expect(action.meta.resource).toEqual('myresource');
    });

    it('should use callTimePayload and callTimeOptions', () => {
        const myPayload = { foo: 1 };
        const { getByText, dispatch } = renderWithRedux(
            <Mutation type="mytype" resource="myresource" payload={myPayload}>
                {mutate => (
                    <button onClick={e => mutate(e, { bar: 2 }, { baz: 1 })}>
                        Hello
                    </button>
                )}
            </Mutation>
        );
        fireEvent.click(getByText('Hello'));
        const action = dispatch.mock.calls[0][0];
        expect(action.payload).toEqual({ foo: 1, bar: 2 });
        expect(action.meta.baz).toEqual(1);
    });

    it('should update the loading state when the mutation callback is triggered', () => {
        const myPayload = {};
        const { getByText } = renderWithRedux(
            <Mutation type="mytype" resource="myresource" payload={myPayload}>
                {(mutate, { loading }) => (
                    <button
                        className={loading ? 'loading' : 'idle'}
                        onClick={mutate}
                    >
                        Hello
                    </button>
                )}
            </Mutation>
        );
        expect(getByText('Hello').className).toEqual('idle');
        fireEvent.click(getByText('Hello'));
        expect(getByText('Hello').className).toEqual('loading');
    });

    it('should update the data state after a success response', async () => {
        const dataProvider = jest.fn();
        dataProvider.mockImplementationOnce(() =>
            Promise.resolve({ data: { foo: 'bar' } })
        );
        const Foo = () => (
            <Mutation type="mytype" resource="foo">
                {(mutate, { data }) => (
                    <button data-testid="test" onClick={mutate}>
                        {data ? data.foo : 'no data'}
                    </button>
                )}
            </Mutation>
        );
        const { getByTestId } = render(
            <CoreAdmin dataProvider={dataProvider}>
                <Resource name="foo" list={Foo} />
            </CoreAdmin>
        );
        const testElement = getByTestId('test');
        expect(testElement.textContent).toBe('no data');
        fireEvent.click(testElement);
        await waitForDomChange({ container: testElement });
        expect(testElement.textContent).toEqual('bar');
    });

    it('should update the error state after an error response', async () => {
        const dataProvider = jest.fn();
        dataProvider.mockImplementationOnce(() =>
            Promise.reject({ message: 'provider error' })
        );
        const Foo = () => (
            <Mutation type="mytype" resource="foo">
                {(mutate, { error }) => (
                    <button data-testid="test" onClick={mutate}>
                        {error ? error.message : 'no data'}
                    </button>
                )}
            </Mutation>
        );
        const { getByTestId } = render(
            <CoreAdmin dataProvider={dataProvider}>
                <Resource name="foo" list={Foo} />
            </CoreAdmin>
        );
        const testElement = getByTestId('test');
        expect(testElement.textContent).toBe('no data');
        fireEvent.click(testElement);
        await waitForDomChange({ container: testElement });
        expect(testElement.textContent).toEqual('provider error');
    });

    it('supports declarative onSuccess side effects', async () => {
        let dispatchSpy;
        const dataProvider = jest.fn();
        dataProvider.mockImplementationOnce(() =>
            Promise.resolve({ data: { foo: 'bar' } })
        );

        let getByTestId;
        act(() => {
            const res = render(
                <DataProviderContext.Provider value={dataProvider}>
                    <TestContext>
                        {({ store }) => {
                            dispatchSpy = jest.spyOn(store, 'dispatch');
                            return (
                                <Mutation
                                    type="mytype"
                                    resource="foo"
                                    options={{
                                        onSuccess: {
                                            notification: {
                                                body: 'Youhou!',
                                                level: 'info',
                                            },
                                            redirectTo: '/a_path',
                                            refresh: true,
                                            unselectAll: true,
                                        },
                                    }}
                                >
                                    {(mutate, { data }) => (
                                        <button
                                            data-testid="test"
                                            onClick={mutate}
                                        >
                                            {data ? data.foo : 'no data'}
                                        </button>
                                    )}
                                </Mutation>
                            );
                        }}
                    </TestContext>
                </DataProviderContext.Provider>
            );
            getByTestId = res.getByTestId;
        });

        const testElement = getByTestId('test');
        fireEvent.click(testElement);
        await waitForDomChange({ container: testElement });

        expect(dispatchSpy).toHaveBeenCalledWith(
            showNotification('Youhou!', 'info', {
                messageArgs: {},
                undoable: false,
            })
        );
        expect(dispatchSpy).toHaveBeenCalledWith(push('/a_path'));
        expect(dispatchSpy).toHaveBeenCalledWith(refreshView());
        expect(dispatchSpy).toHaveBeenCalledWith(setListSelectedIds('foo', []));
    });

    it('supports onSuccess side effects using hooks', async () => {
        let dispatchSpy;
        const dataProvider = jest.fn();
        dataProvider.mockImplementationOnce(() =>
            Promise.resolve({ data: { foo: 'bar' } })
        );

        const Foo = () => {
            const notify = useNotify();
            return (
                <Mutation
                    type="mytype"
                    resource="foo"
                    options={{
                        onSuccess: () => {
                            notify('Youhou!', 'info');
                        },
                    }}
                >
                    {(mutate, { data }) => (
                        <button data-testid="test" onClick={mutate}>
                            {data ? data.foo : 'no data'}
                        </button>
                    )}
                </Mutation>
            );
        };
        let getByTestId;
        act(() => {
            const res = render(
                <DataProviderContext.Provider value={dataProvider}>
                    <TestContext>
                        {({ store }) => {
                            dispatchSpy = jest.spyOn(store, 'dispatch');
                            return <Foo />;
                        }}
                    </TestContext>
                </DataProviderContext.Provider>
            );
            getByTestId = res.getByTestId;
        });

        const testElement = getByTestId('test');
        fireEvent.click(testElement);
        await waitForDomChange({ container: testElement });

        expect(dispatchSpy).toHaveBeenCalledWith(
            showNotification('Youhou!', 'info', {
                messageArgs: {},
                undoable: false,
            })
        );
    });

    it('supports declarative onFailure side effects', async () => {
        let dispatchSpy;
        const dataProvider = jest.fn();
        dataProvider.mockImplementationOnce(() =>
            Promise.reject({ message: 'provider error' })
        );

        let getByTestId;
        act(() => {
            const res = render(
                <DataProviderContext.Provider value={dataProvider}>
                    <TestContext>
                        {({ store }) => {
                            dispatchSpy = jest.spyOn(store, 'dispatch');
                            return (
                                <Mutation
                                    type="mytype"
                                    resource="foo"
                                    options={{
                                        onFailure: {
                                            notification: {
                                                body: 'Damn!',
                                                level: 'warning',
                                            },
                                            redirectTo: '/a_path',
                                            refresh: true,
                                            unselectAll: true,
                                        },
                                    }}
                                >
                                    {(mutate, { error }) => (
                                        <button
                                            data-testid="test"
                                            onClick={mutate}
                                        >
                                            {error ? error.message : 'no data'}
                                        </button>
                                    )}
                                </Mutation>
                            );
                        }}
                    </TestContext>
                </DataProviderContext.Provider>
            );
            getByTestId = res.getByTestId;
        });

        const testElement = getByTestId('test');
        fireEvent.click(testElement);
        await waitForDomChange({ container: testElement });

        expect(dispatchSpy).toHaveBeenCalledWith(
            showNotification('Damn!', 'warning', {
                messageArgs: {},
                undoable: false,
            })
        );
        expect(dispatchSpy).toHaveBeenCalledWith(push('/a_path'));
        expect(dispatchSpy).toHaveBeenCalledWith(refreshView());
        expect(dispatchSpy).toHaveBeenCalledWith(setListSelectedIds('foo', []));
    });

    it('supports onFailure side effects using hooks', async () => {
        let dispatchSpy;
        const dataProvider = jest.fn();
        dataProvider.mockImplementationOnce(() =>
            Promise.reject({ message: 'provider error' })
        );

        const Foo = () => {
            const notify = useNotify();
            return (
                <Mutation
                    type="mytype"
                    resource="foo"
                    options={{
                        onFailure: () => {
                            notify('Damn!', 'warning');
                        },
                    }}
                >
                    {(mutate, { error }) => (
                        <button data-testid="test" onClick={mutate}>
                            {error ? error.message : 'no data'}
                        </button>
                    )}
                </Mutation>
            );
        };
        let getByTestId;
        act(() => {
            const res = render(
                <DataProviderContext.Provider value={dataProvider}>
                    <TestContext>
                        {({ store }) => {
                            dispatchSpy = jest.spyOn(store, 'dispatch');
                            return <Foo />;
                        }}
                    </TestContext>
                </DataProviderContext.Provider>
            );
            getByTestId = res.getByTestId;
        });

        const testElement = getByTestId('test');
        fireEvent.click(testElement);
        await waitForDomChange({ container: testElement });

        expect(dispatchSpy).toHaveBeenCalledWith(
            showNotification('Damn!', 'warning', {
                messageArgs: {},
                undoable: false,
            })
        );
    });
});
