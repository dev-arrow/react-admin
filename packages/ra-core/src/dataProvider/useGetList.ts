import { useEffect, useMemo } from 'react';
import {
    useQuery,
    UseQueryOptions,
    UseQueryResult,
    useQueryClient,
} from '@tanstack/react-query';

import { RaRecord, GetListParams, GetListResult } from '../types';
import { useDataProvider } from './useDataProvider';

const MAX_DATA_LENGTH_TO_CACHE = 100;

/**
 * Call the dataProvider.getList() method and return the resolved result
 * as well as the loading state.
 *
 * The return value updates according to the request state:
 *
 * - start: { isLoading: true, refetch }
 * - success: { data: [data from store], total: [total from response], isLoading: false, refetch }
 * - error: { error: [error from response], isLoading: false, refetch }
 *
 * This hook will return the cached result when called a second time
 * with the same parameters, until the response arrives.
 *
 * @param {string} resource The resource name, e.g. 'posts'
 * @param {Params} params The getList parameters { pagination, sort, filter, meta }
 * @param {Object} options Options object to pass to the queryClient.
 * May include side effects to be executed upon success or failure, e.g. { onSuccess: () => { refresh(); } }
 *
 * @typedef Params
 * @prop params.pagination The request pagination { page, perPage }, e.g. { page: 1, perPage: 10 }
 * @prop params.sort The request sort { field, order }, e.g. { field: 'id', order: 'DESC' }
 * @prop params.filter The request filters, e.g. { title: 'hello, world' }
 * @prop params.meta Optional meta parameters
 *
 * @returns The current request state. Destructure as { data, total, error, isLoading, refetch }.
 *
 * @example
 *
 * import { useGetList } from 'react-admin';
 *
 * const LatestNews = () => {
 *     const { data, total, isLoading, error } = useGetList(
 *         'posts',
 *         { pagination: { page: 1, perPage: 10 }, sort: { field: 'published_at', order: 'DESC' } }
 *     );
 *     if (isLoading) { return <Loading />; }
 *     if (error) { return <p>ERROR</p>; }
 *     return <ul>{data.map(item =>
 *         <li key={item.id}>{item.title}</li>
 *     )}</ul>;
 * };
 */
export const useGetList = <RecordType extends RaRecord = any>(
    resource: string,
    params: Partial<GetListParams> = {},
    options: UseGetListOptions<RecordType> = {}
): UseGetListHookValue<RecordType> => {
    const {
        pagination = { page: 1, perPage: 25 },
        sort = { field: 'id', order: 'DESC' },
        filter = {},
        meta,
    } = params;
    const dataProvider = useDataProvider();
    const queryClient = useQueryClient();
    const { onError, onSuccess, ...queryOptions } = options;
    const result = useQuery<
        GetListResult<RecordType>,
        Error,
        GetListResult<RecordType>
    >({
        queryKey: [resource, 'getList', { pagination, sort, filter, meta }],
        queryFn: () =>
            dataProvider
                .getList<RecordType>(resource, {
                    pagination,
                    sort,
                    filter,
                    meta,
                })
                .then(({ data, total, pageInfo }) => ({
                    data,
                    total,
                    pageInfo,
                })),
        ...queryOptions,
    });

    useEffect(() => {
        // optimistically populate the getOne cache
        if (
            result.data &&
            result.data?.data &&
            result.data.data.length <= MAX_DATA_LENGTH_TO_CACHE
        ) {
            result.data.data.forEach(record => {
                queryClient.setQueryData(
                    [resource, 'getOne', { id: String(record.id), meta }],
                    oldRecord => oldRecord ?? record
                );
            });
        }
        // execute call-time onSuccess if provided
        if (result.data && onSuccess) {
            onSuccess(result.data);
        }
    }, [meta, onSuccess, queryClient, resource, result.data]);

    useEffect(() => {
        if (result.error && onError) {
            onError(result.error);
        }
    }, [onError, result.error]);

    return useMemo(
        () =>
            result.data
                ? {
                      ...result,
                      data: result.data?.data,
                      total: result.data?.total,
                      pageInfo: result.data?.pageInfo,
                  }
                : result,
        [result]
    ) as UseQueryResult<RecordType[], Error> & {
        total?: number;
        pageInfo?: {
            hasNextPage?: boolean;
            hasPreviousPage?: boolean;
        };
    };
};

export type UseGetListOptions<RecordType extends RaRecord = any> = Omit<
    UseQueryOptions<GetListResult<RecordType>, Error>,
    'queryKey' | 'queryFn'
> & {
    onSuccess?: (value: GetListResult<RecordType>) => void;
    onError?: (error: Error) => void;
};

export type UseGetListHookValue<
    RecordType extends RaRecord = any
> = UseQueryResult<RecordType[], Error> & {
    total?: number;
    pageInfo?: {
        hasNextPage?: boolean;
        hasPreviousPage?: boolean;
    };
};
