import * as React from 'react';
import {
    render,
    screen,
    waitFor,
    within,
    fireEvent,
} from '@testing-library/react';
import { Form } from 'react-final-form';
import { Provider } from 'react-redux';
import {
    CoreAdminContext,
    testDataProvider,
    createAdminStore,
    useListContext,
} from 'ra-core';

import { Datagrid } from '../list';
import { TextField } from '../field';
import {
    ReferenceArrayInput,
    ReferenceArrayInputView,
} from './ReferenceArrayInput';

describe('<ReferenceArrayInput />', () => {
    const defaultProps = {
        input: {},
        meta: {},
        record: {},
        reference: 'tags',
        resource: 'posts',
        source: 'tag_ids',
        basePath: '/posts',
        translate: x => `*${x}*`,
    };

    it('should display an error if error is defined', () => {
        const MyComponent = () => <div>MyComponent</div>;
        const { queryByDisplayValue, queryByText } = render(
            <ReferenceArrayInputView
                {...{
                    ...defaultProps,
                    error: 'error',
                    input: {},
                }}
            >
                <MyComponent />
            </ReferenceArrayInputView>
        );
        expect(queryByDisplayValue('error')).not.toBeNull();
        expect(queryByText('MyComponent')).toBeNull();
    });

    it('should send an error to the children if warning is defined', () => {
        const MyComponent = ({ meta }) => <div>{meta.helperText}</div>;
        const { queryByText, queryByRole } = render(
            <ReferenceArrayInputView
                {...{
                    ...defaultProps,
                    warning: 'fetch error',
                    input: { value: [1, 2] },
                    choices: [{ id: 2 }],
                }}
            >
                <MyComponent />
            </ReferenceArrayInputView>
        );
        expect(queryByRole('textbox')).toBeNull();
        expect(queryByText('fetch error')).not.toBeNull();
    });

    it('should not send an error to the children if warning is not defined', () => {
        const MyComponent = ({ meta }) => <div>{JSON.stringify(meta)}</div>;
        const { queryByText, queryByRole } = render(
            <ReferenceArrayInputView
                {...{
                    ...defaultProps,
                    input: { value: [1, 2] },
                    choices: [{ id: 1 }, { id: 2 }],
                }}
            >
                <MyComponent />
            </ReferenceArrayInputView>
        );
        expect(queryByRole('textbox')).toBeNull();
        expect(
            queryByText(JSON.stringify({ helperText: false }))
        ).not.toBeNull();
    });

    it('should render enclosed component if references present in input are available in state', () => {
        const MyComponent = ({ choices }) => (
            <div>{JSON.stringify(choices)}</div>
        );
        const { queryByRole, queryByText } = render(
            <ReferenceArrayInputView
                {...{
                    ...defaultProps,
                    input: { value: [1] },
                    choices: [1],
                }}
            >
                <MyComponent />
            </ReferenceArrayInputView>
        );
        expect(queryByRole('textbox')).toBeNull();
        expect(queryByText(JSON.stringify([1]))).not.toBeNull();
    });

    it('should render enclosed component even if the choices are empty', () => {
        const MyComponent = ({ choices }) => (
            <div>{JSON.stringify(choices)}</div>
        );
        const { queryByRole, queryByText } = render(
            <ReferenceArrayInputView
                {...{
                    ...defaultProps,
                    choices: [],
                }}
            >
                <MyComponent />
            </ReferenceArrayInputView>
        );
        expect(queryByRole('progressbar')).toBeNull();
        expect(queryByRole('textbox')).toBeNull();
        expect(queryByText(JSON.stringify([]))).not.toBeNull();
    });

    it('should pass the correct resource and basePath down to child component', () => {
        let resourceProp;
        let basePathProp;
        const MyComponent = ({ resource, basePath }) => {
            resourceProp = resource;
            basePathProp = basePath;
            return <div />;
        };
        const onChange = jest.fn();
        render(
            <ReferenceArrayInputView
                {...defaultProps}
                allowEmpty
                onChange={onChange}
            >
                <MyComponent />
            </ReferenceArrayInputView>
        );
        expect(resourceProp).toEqual('tags');
        expect(basePathProp).toEqual('/tags');
    });

    it('should pass onChange down to child component', () => {
        let onChangeCallback;
        const MyComponent = ({ onChange }) => {
            onChangeCallback = onChange;
            return <div />;
        };
        const onChange = jest.fn();
        render(
            <ReferenceArrayInputView
                {...defaultProps}
                allowEmpty
                onChange={onChange}
            >
                <MyComponent />
            </ReferenceArrayInputView>
        );
        onChangeCallback('foo');
        expect(onChange).toBeCalledWith('foo');
    });

    it('should pass meta down to child component', () => {
        const MyComponent = ({ meta }) => <div>{JSON.stringify(meta)}</div>;
        const { queryByText } = render(
            <ReferenceArrayInputView
                {...defaultProps}
                allowEmpty
                meta={{ touched: false }}
            >
                <MyComponent />
            </ReferenceArrayInputView>
        );
        expect(
            queryByText(JSON.stringify({ touched: false, helperText: false }))
        ).not.toBeNull();
    });

    it('should provide a ListContext with all available choices', async () => {
        const Children = () => {
            const { total } = useListContext();
            return <div aria-label="total">{total}</div>;
        };

        const store = createAdminStore({
            initialState: { admin: { resources: { tags: { data: {} } } } },
        });
        const dataProvider = testDataProvider({
            getList: () =>
                Promise.resolve({ data: [{ id: 1 }, { id: 2 }], total: 2 }),
        });
        render(
            <Provider store={store}>
                <CoreAdminContext dataProvider={dataProvider}>
                    <Form
                        onSubmit={jest.fn()}
                        render={() => (
                            <ReferenceArrayInput {...defaultProps}>
                                <Children />
                            </ReferenceArrayInput>
                        )}
                    />
                </CoreAdminContext>
            </Provider>
        );
        await waitFor(() => {
            expect(screen.getByLabelText('total').innerHTML).toEqual('2');
        });
    });

    it('should allow to use a Datagrid', async () => {
        const store = createAdminStore({
            initialState: { admin: { resources: { tags: { data: {} } } } },
        });
        const dataProvider = testDataProvider({
            getList: () =>
                Promise.resolve({
                    data: [
                        { id: 5, name: 'test1' },
                        { id: 6, name: 'test2' },
                    ],
                    total: 2,
                }),
        });
        render(
            <Provider store={store}>
                <CoreAdminContext dataProvider={dataProvider}>
                    <Form
                        onSubmit={jest.fn()}
                        initialValues={{ tag_ids: [5] }}
                        render={() => (
                            <ReferenceArrayInput
                                reference="tags"
                                resource="posts"
                                source="tag_ids"
                                basePath="/posts"
                            >
                                <Datagrid
                                    hasBulkActions={true}
                                    rowClick="toggleSelection"
                                >
                                    <TextField source="name" />
                                </Datagrid>
                            </ReferenceArrayInput>
                        )}
                    />
                </CoreAdminContext>
            </Provider>
        );

        await waitFor(() => {
            expect(screen.queryByText('test1')).not.toBeNull();
            expect(screen.queryByText('test2')).not.toBeNull();
        });

        const checkBoxTest1 = within(screen.queryByText('test1').closest('tr'))
            .getByLabelText('ra.action.select_row')
            .querySelector('input');

        const checkBoxTest2 = within(screen.queryByText('test2').closest('tr'))
            .getByLabelText('ra.action.select_row')
            .querySelector('input');

        const checkBoxAll = screen
            .getByLabelText('ra.action.select_all')
            .querySelector('input');

        expect(checkBoxTest1.checked).toEqual(true);
        expect(checkBoxTest2.checked).toEqual(false);
        fireEvent.click(checkBoxTest2);

        await waitFor(() => {
            expect(checkBoxTest2.checked).toEqual(true);
            expect(checkBoxAll.checked).toEqual(true);
        });

        fireEvent.click(checkBoxAll);
        await waitFor(() => {
            expect(checkBoxTest1.checked).toEqual(false);
            expect(checkBoxTest2.checked).toEqual(false);
            expect(checkBoxAll.checked).toEqual(false);
        });

        fireEvent.click(checkBoxAll);
        await waitFor(() => {
            expect(checkBoxTest1.checked).toEqual(true);
            expect(checkBoxTest2.checked).toEqual(true);
            expect(checkBoxAll.checked).toEqual(true);
        });
    });
});
