import { useCallback } from 'react';
import deepmerge from 'deepmerge';

import { useSafeSetState } from '../util/hooks';
import useDataProvider from './useDataProvider';

export interface Query {
    type: string;
    resource: string;
    payload: object;
}

export interface QueryOptions {
    meta?: any;
    action?: string;
    undoable?: boolean;
}

/**
 * Get a callback to fetch the data provider through Redux, usually for mutations
 *
 * The request starts when the callback is called.
 *
 * The return value updates according to the request state:
 *
 * - mount: { loading: false, loaded: false }
 * - mutate called: { loading: true, loaded: false }
 * - success: { data: [data from response], total: [total from response], loading: false, loaded: true }
 * - error: { error: [error from response], loading: false, loaded: true }
 *
 * @param {Object} query
 * @param {string} query.type The verb passed to th data provider, e.g. 'UPDATE'
 * @param {string} query.resource A resource name, e.g. 'posts', 'comments'
 * @param {Object} query.payload The payload object, e.g. { id: 123, data: { isApproved: true } }
 * @param {Object} options
 * @param {string} options.action Redux action type
 * @param {Object} options.meta Redux action metas, including side effects to be executed upon success of failure, e.g. { onSuccess: { refresh: true } }
 *
 * @returns A tuple with the mutation callback and the request state. Destructure as [mutate, { data, total, error, loading, loaded }].
 *
 * @example
 *
 * import { useMutation } from 'react-admin';
 *
 * const ApproveButton = ({ record }) => {
 *     const [approve, { loading }] = useMutation({
 *         type: 'UPDATE',
 *         resource: 'comments',
 *         payload: { id: record.id, data: { isApproved: true } }
 *     });
 *     return <FlatButton label="Approve" onClick={approve} disabled={loading} />;
 * };
 */
const useMutation = (
    query: Query,
    options: QueryOptions = {}
): [
    (event?: any, callTimePayload?: any, callTimeOptions?: any) => void,
    {
        data?: any;
        total?: number;
        error?: any;
        loading: boolean;
        loaded: boolean;
    }
] => {
    const { type, resource, payload } = query;
    const [state, setState] = useSafeSetState({
        data: null,
        error: null,
        total: null,
        loading: false,
        loaded: false,
    });
    const dataProvider = useDataProvider();
    const mutate = useCallback(
        (event, callTimePayload = {}, callTimeOptions = {}): void => {
            setState({ loading: true });
            dataProvider(
                type,
                resource,
                deepmerge(payload, callTimePayload),
                deepmerge(options, callTimeOptions)
            )
                .then(({ data, total }) => {
                    setState({
                        data,
                        total,
                        loading: false,
                        loaded: true,
                    });
                })
                .catch(errorFromResponse => {
                    setState({
                        error: errorFromResponse,
                        loading: false,
                        loaded: false,
                    });
                });
        },
        // deep equality, see https://github.com/facebook/react/issues/14476#issuecomment-471199055
        [JSON.stringify({ query, options })] // eslint-disable-line react-hooks/exhaustive-deps
    );

    return [mutate, state];
};

export default useMutation;
