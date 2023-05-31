import { useCallback, ReactEventHandler } from 'react';
import { UseMutationOptions } from 'react-query';

import { useDelete } from '../../dataProvider';
import {
    useRefresh,
    useNotify,
    useRedirect,
    RedirectionSideEffect,
} from '../../sideEffect';
import { Record, DeleteParams } from '../../types';
import { useResourceContext } from '../../core';

/**
 * Prepare callback for a Delete button with undo support
 *
 * @example
 *
 * import React from 'react';
 * import ActionDelete from '@mui/icons-material/Delete';
 * import { Button, useDeleteWithUndoController } from 'react-admin';
 *
 * const DeleteButton = ({
 *     resource,
 *     record,
 *     basePath,
 *     redirect,
 *     onClick,
 *     ...rest
 * }) => {
 *     const { isLoading, handleDelete } = useDeleteWithUndoController({
 *         resource,
 *         record,
 *         basePath,
 *         redirect,
 *         onClick,
 *     });
 *
 *     return (
 *         <Button
 *             onClick={handleDelete}
 *             disabled={isLoading}
 *             label="ra.action.delete"
 *             {...rest}
 *         >
 *             <ActionDelete />
 *         </Button>
 *     );
 * };
 */
const useDeleteWithUndoController = <RecordType extends Record = Record>(
    props: UseDeleteWithUndoControllerParams<RecordType>
): UseDeleteWithUndoControllerReturn => {
    const {
        record,
        basePath,
        redirect: redirectTo = 'list',
        onClick,
        mutationOptions,
    } = props;
    const resource = useResourceContext(props);
    const notify = useNotify();
    const redirect = useRedirect();
    const refresh = useRefresh();

    const [deleteOne, { isLoading }] = useDelete<RecordType>(
        resource,
        undefined,
        {
            onSuccess: () => {
                notify('ra.notification.deleted', {
                    type: 'info',
                    messageArgs: { smart_count: 1 },
                    undoable: true,
                });
                redirect(redirectTo, basePath || `/${resource}`);
                refresh();
            },
            onError: (error: Error) => {
                notify(
                    typeof error === 'string'
                        ? error
                        : error.message || 'ra.notification.http_error',
                    {
                        type: 'warning',
                        messageArgs: {
                            _:
                                typeof error === 'string'
                                    ? error
                                    : error && error.message
                                    ? error.message
                                    : undefined,
                        },
                    }
                );
                refresh();
            },
            mutationMode: 'undoable',
            ...mutationOptions,
        }
    );
    const handleDelete = useCallback(
        event => {
            event.stopPropagation();
            deleteOne(resource, { id: record.id, previousData: record });
            if (typeof onClick === 'function') {
                onClick(event);
            }
        },
        [deleteOne, onClick, record, resource]
    );

    return { isLoading, handleDelete };
};

export interface UseDeleteWithUndoControllerParams<
    RecordType extends Record = Record
> {
    basePath?: string;
    record?: RecordType;
    redirect?: RedirectionSideEffect;
    // @deprecated. This hook get the resource from the context
    resource?: string;
    onClick?: ReactEventHandler<any>;
    mutationOptions?: UseMutationOptions<
        RecordType,
        unknown,
        DeleteParams<RecordType>
    >;
}

export interface UseDeleteWithUndoControllerReturn {
    isLoading: boolean;
    handleDelete: ReactEventHandler<any>;
}

export default useDeleteWithUndoController;
