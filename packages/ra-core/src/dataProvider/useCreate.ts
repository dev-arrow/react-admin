import { useRef } from 'react';
import {
    useMutation,
    UseMutationOptions,
    UseMutationResult,
    useQueryClient,
    MutateOptions,
} from '@tanstack/react-query';

import { useDataProvider } from './useDataProvider';
import { RaRecord, CreateParams, Identifier } from '../types';
import { useEvent } from '../util';

/**
 * Get a callback to call the dataProvider.create() method, the result and the loading state.
 *
 * @param {string} resource
 * @param {Params} params The create parameters { data }
 * @param {Object} options Options object to pass to the queryClient.
 * May include side effects to be executed upon success or failure, e.g. { onSuccess: () => { refresh(); } }
 *
 * @typedef Params
 * @prop params.data The record to create, e.g. { title: 'hello, world' }
 *
 * @returns The current mutation state. Destructure as [create, { data, error, isLoading }].
 *
 * The return value updates according to the request state:
 *
 * - initial: [create, { isLoading: false, isIdle: true }]
 * - start:   [create, { isLoading: true }]
 * - success: [create, { data: [data from response], isLoading: false, isSuccess: true }]
 * - error:   [create, { error: [error from response], isLoading: false, isError: true }]
 *
 * The create() function must be called with a resource and a parameter object: create(resource, { data, meta }, options)
 *
 * This hook uses react-query useMutation under the hood.
 * This means the state object contains mutate, isIdle, reset and other react-query methods.
 *
 * @see https://react-query-v3.tanstack.com/reference/useMutation
 *
 * @example // set params when calling the create callback
 *
 * import { useCreate, useRecordContext } from 'react-admin';
 *
 * const LikeButton = () => {
 *     const record = useRecordContext();
 *     const like = { postId: record.id };
 *     const [create, { isLoading, error }] = useCreate();
 *     const handleClick = () => {
 *         create('likes', { data: like })
 *     }
 *     if (error) { return <p>ERROR</p>; }
 *     return <button disabled={isLoading} onClick={handleClick}>Like</button>;
 * };
 *
 * @example // set params when calling the hook
 *
 * import { useCreate, useRecordContext } from 'react-admin';
 *
 * const LikeButton = () => {
 *     const record = useRecordContext();
 *     const like = { postId: record.id };
 *     const [create, { isLoading, error }] = useCreate('likes', { data: like });
 *     if (error) { return <p>ERROR</p>; }
 *     return <button disabled={isLoading} onClick={() => create()}>Like</button>;
 * };
 *
 * @example // TypeScript
 * const [create, { data }] = useCreate<Product>('products', { data: product });
 *                    \-- data is Product
 */
export const useCreate = <
    RecordType extends Omit<RaRecord, 'id'> = any,
    MutationError = unknown,
    ResultRecordType extends RaRecord = RecordType & { id: Identifier }
>(
    resource?: string,
    params: Partial<CreateParams<Partial<RecordType>>> = {},
    options: UseCreateOptions<RecordType, MutationError, ResultRecordType> = {}
): UseCreateResult<RecordType, boolean, MutationError, ResultRecordType> => {
    const dataProvider = useDataProvider();
    const queryClient = useQueryClient();
    const paramsRef = useRef<Partial<CreateParams<Partial<RecordType>>>>(
        params
    );
    const { onError, onSettled, onSuccess, ...otherMutationOptions } = options;
    const hasCallTimeOnError = useRef(false);
    const hasCallTimeOnSuccess = useRef(false);
    const hasCallTimeOnSettled = useRef(false);

    const mutation = useMutation<
        ResultRecordType,
        MutationError,
        Partial<UseCreateMutateParams<RecordType>>
    >({
        mutationFn: ({
            resource: callTimeResource = resource,
            data: callTimeData = paramsRef.current.data,
            meta: callTimeMeta = paramsRef.current.meta,
        } = {}) =>
            dataProvider
                .create<RecordType, ResultRecordType>(callTimeResource, {
                    data: callTimeData,
                    meta: callTimeMeta,
                })
                .then(({ data }) => data),
        ...otherMutationOptions,
        onError: (error, variables, context) => {
            if (onError && !hasCallTimeOnError.current) {
                return onError(error, variables, context);
            }
        },
        onSuccess: (
            data: ResultRecordType,
            variables: Partial<UseCreateMutateParams<RecordType>> = {},
            context: unknown
        ) => {
            const { resource: callTimeResource = resource } = variables;
            queryClient.setQueryData(
                [callTimeResource, 'getOne', { id: String(data.id) }],
                data
            );
            queryClient.invalidateQueries({
                queryKey: [callTimeResource, 'getList'],
            });
            queryClient.invalidateQueries({
                queryKey: [callTimeResource, 'getInfiniteList'],
            });
            queryClient.invalidateQueries({
                queryKey: [callTimeResource, 'getMany'],
            });
            queryClient.invalidateQueries({
                queryKey: [callTimeResource, 'getManyReference'],
            });

            if (onSuccess && !hasCallTimeOnSuccess.current) {
                onSuccess(data, variables, context);
            }
            // call-time success callback is executed by react-query
        },
        onSettled: (data, error, variables, context) => {
            if (onSettled && !hasCallTimeOnSettled.current) {
                return onSettled(data, error, variables, context);
            }
        },
    });

    const create = (
        callTimeResource: string = resource,
        callTimeParams: Partial<CreateParams<Partial<RecordType>>> = {},
        callTimeOptions: MutateOptions<
            ResultRecordType,
            MutationError,
            Partial<UseCreateMutateParams<RecordType>>,
            unknown
        > & { returnPromise?: boolean } = {}
    ) => {
        const {
            returnPromise = options.returnPromise,
            onSuccess: callTimeOnSuccess,
            onSettled: callTimeOnSettled,
            onError: callTimeOnError,
            ...reactCreateOptions
        } = callTimeOptions;

        hasCallTimeOnError.current = !!callTimeOnError;
        hasCallTimeOnSuccess.current = !!callTimeOnSuccess;
        hasCallTimeOnSettled.current = !!callTimeOnSettled;

        if (returnPromise) {
            return mutation.mutateAsync(
                { resource: callTimeResource, ...callTimeParams },
                callTimeOptions
            );
        }
        mutation.mutate(
            { resource: callTimeResource, ...callTimeParams },
            {
                onSuccess: callTimeOnSuccess,
                onSettled: callTimeOnSettled,
                onError: callTimeOnError,
                ...reactCreateOptions,
            }
        );
    };

    return [useEvent(create), mutation];
};

export interface UseCreateMutateParams<
    RecordType extends Omit<RaRecord, 'id'> = any
> {
    resource?: string;
    data?: Partial<Omit<RecordType, 'id'>>;
    meta?: any;
}

export type UseCreateOptions<
    RecordType extends Omit<RaRecord, 'id'> = any,
    MutationError = unknown,
    ResultRecordType extends RaRecord = RecordType & { id: Identifier }
> = Omit<
    UseMutationOptions<
        ResultRecordType,
        MutationError,
        Partial<UseCreateMutateParams<RecordType>>
    >,
    'mutationFn'
> & { returnPromise?: boolean };

export type CreateMutationFunction<
    RecordType extends Omit<RaRecord, 'id'> = any,
    TReturnPromise extends boolean = boolean,
    MutationError = unknown,
    ResultRecordType extends RaRecord = RecordType & { id: Identifier }
> = (
    resource?: string,
    params?: Partial<CreateParams<Partial<RecordType>>>,
    options?: MutateOptions<
        ResultRecordType,
        MutationError,
        Partial<UseCreateMutateParams<RecordType>>,
        unknown
    > & { returnPromise?: TReturnPromise }
) => Promise<TReturnPromise extends true ? ResultRecordType : void>;

export type UseCreateResult<
    RecordType extends Omit<RaRecord, 'id'> = any,
    TReturnPromise extends boolean = boolean,
    MutationError = unknown,
    ResultRecordType extends RaRecord = RecordType & { id: Identifier }
> = [
    CreateMutationFunction<
        RecordType,
        TReturnPromise,
        MutationError,
        ResultRecordType
    >,
    UseMutationResult<
        ResultRecordType,
        MutationError,
        Partial<UseCreateMutateParams<RecordType>>,
        unknown
    >
];
