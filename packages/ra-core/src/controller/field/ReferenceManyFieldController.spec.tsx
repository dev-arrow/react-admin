import * as React from 'react';
import expect from 'expect';

import ReferenceManyFieldController from './ReferenceManyFieldController';
import renderWithRedux from '../../util/renderWithRedux';

// Ignore warnings about act()
// See https://github.com/testing-library/react-testing-library/issues/281,
// https://github.com/facebook/react/issues/14769
const originalError = console.error;
jest.spyOn(console, 'error').mockImplementation((...args) => {
    if (/Warning.*not wrapped in act/.test(args[0])) {
        return;
    }
    originalError.call(console, ...args);
});

describe('<ReferenceManyFieldController />', () => {
    it('should set loaded to false when related records are not yet fetched', () => {
        const children = jest.fn().mockReturnValue('children');
        const { dispatch } = renderWithRedux(
            <ReferenceManyFieldController
                resource="foo"
                source="items"
                reference="bar"
                target="foo_id"
                basePath=""
            >
                {children}
            </ReferenceManyFieldController>,
            {
                admin: {
                    resources: {
                        bar: {
                            data: {
                                1: { id: 1, title: 'hello' },
                                2: { id: 2, title: 'world' },
                            },
                        },
                    },
                    references: {
                        oneToMany: {
                            'foo_bar@fooId_barId': {
                                ids: [1, 2],
                            },
                        },
                    },
                },
            }
        );
        expect(dispatch.mock.calls[0]).toEqual([
            {
                meta: {
                    relatedTo: 'foo_bar@foo_id_undefined',
                    resource: 'bar',
                },
                payload: {
                    filter: {},
                    id: undefined,
                    pagination: { page: 1, perPage: 25 },
                    sort: { field: 'id', order: 'DESC' },
                    target: 'foo_id',
                },
                type: 'RA/CRUD_GET_MANY_REFERENCE',
            },
        ]);
    });

    it('should pass data and ids to children function', () => {
        const children = jest.fn().mockReturnValue('children');
        const data = {
            1: { id: 1, title: 'hello' },
            2: { id: 2, title: 'world' },
        };
        renderWithRedux(
            <ReferenceManyFieldController
                resource="foo"
                reference="bar"
                target="fooId"
                basePath=""
                record={{
                    id: 'fooId',
                    source: 'barId',
                }}
                source="source"
            >
                {children}
            </ReferenceManyFieldController>,
            {
                admin: {
                    resources: {
                        bar: {
                            data: {
                                1: { id: 1, title: 'hello' },
                                2: { id: 2, title: 'world' },
                            },
                        },
                    },
                    references: {
                        oneToMany: {
                            'foo_bar@fooId_barId': {
                                ids: [1, 2],
                            },
                        },
                    },
                },
            }
        );
        expect(children.mock.calls[0][0].data).toEqual(data);
        expect(children.mock.calls[0][0].ids).toEqual([1, 2]);
    });

    it('should support record with string identifier', () => {
        const children = jest.fn().mockReturnValue('children');
        renderWithRedux(
            <ReferenceManyFieldController
                resource="foo"
                reference="bar"
                target="fooId"
                basePath=""
                record={{
                    id: 'fooId',
                    source: 'barId',
                }}
                source="source"
            >
                {children}
            </ReferenceManyFieldController>,
            {
                admin: {
                    resources: {
                        bar: {
                            data: {
                                'abc-1': { id: 'abc-1', title: 'hello' },
                                'abc-2': { id: 'abc-2', title: 'world' },
                            },
                        },
                    },
                    references: {
                        oneToMany: {
                            'foo_bar@fooId_barId': {
                                ids: ['abc-1', 'abc-2'],
                            },
                        },
                    },
                },
            }
        );
        expect(children.mock.calls[0][0].data).toEqual({
            'abc-1': { id: 'abc-1', title: 'hello' },
            'abc-2': { id: 'abc-2', title: 'world' },
        });
        expect(children.mock.calls[0][0].ids).toEqual(['abc-1', 'abc-2']);
    });

    it('should support custom source', () => {
        const children = jest.fn(({ data }) =>
            data && data.length > 0 ? data.length : null
        );

        const { dispatch } = renderWithRedux(
            <ReferenceManyFieldController
                resource="posts"
                reference="comments"
                target="post_id"
                basePath=""
                record={{ id: 'not me', customId: 1 }}
                source="customId"
            >
                {children}
            </ReferenceManyFieldController>,
            {
                admin: {
                    references: {
                        oneToMany: {
                            'posts_comments@post_id_1': {
                                ids: [1],
                                total: 1,
                            },
                        },
                    },
                    resources: {
                        comments: {
                            data: {
                                1: {
                                    post_id: 1,
                                    id: 1,
                                    body: 'Hello!',
                                },
                            },
                        },
                    },
                },
            }
        );

        expect(dispatch.mock.calls[0]).toEqual([
            {
                meta: {
                    relatedTo: 'posts_comments@post_id_1',
                    resource: 'comments',
                },
                payload: {
                    filter: {},
                    id: 1,
                    pagination: { page: 1, perPage: 25 },
                    sort: { field: 'id', order: 'DESC' },
                    target: 'post_id',
                },
                type: 'RA/CRUD_GET_MANY_REFERENCE',
            },
        ]);

        expect(children.mock.calls[0][0].data).toEqual({
            1: {
                post_id: 1,
                id: 1,
                body: 'Hello!',
            },
        });
    });

    it('should call crudGetManyReference when its props changes', () => {
        const ControllerWrapper = props => (
            <ReferenceManyFieldController
                record={{ id: 1 }}
                resource="foo"
                reference="bar"
                target="foo_id"
                basePath=""
                source="id"
                {...props}
            >
                {() => 'null'}
            </ReferenceManyFieldController>
        );

        const { rerender, dispatch } = renderWithRedux(<ControllerWrapper />, {
            admin: {
                resources: {
                    bar: {},
                    foo: {},
                },
            },
        });

        expect(dispatch).toBeCalledTimes(3); // CRUD_GET_MANY_REFERENCE, CRUD_GET_MANY_REFERENCE_LOADING, FETCH_START
        rerender(<ControllerWrapper sort={{ field: 'id', order: 'ASC' }} />);
        expect(dispatch).toBeCalledTimes(6);

        expect(dispatch.mock.calls[0]).toEqual([
            {
                meta: {
                    relatedTo: 'foo_bar@foo_id_1',
                    resource: 'bar',
                },
                payload: {
                    filter: {},
                    id: 1,
                    pagination: { page: 1, perPage: 25 },
                    sort: { field: 'id', order: 'DESC' },
                    target: 'foo_id',
                },
                type: 'RA/CRUD_GET_MANY_REFERENCE',
            },
        ]);

        expect(dispatch.mock.calls[3]).toEqual([
            {
                meta: {
                    relatedTo: 'foo_bar@foo_id_1',
                    resource: 'bar',
                },
                payload: {
                    filter: {},
                    id: 1,
                    pagination: { page: 1, perPage: 25 },
                    sort: { field: 'id', order: 'ASC' },
                    target: 'foo_id',
                },
                type: 'RA/CRUD_GET_MANY_REFERENCE',
            },
        ]);
    });
});
