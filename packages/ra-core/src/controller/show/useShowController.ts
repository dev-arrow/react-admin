import { useParams } from 'react-router-dom';

import { useAuthenticated } from '../../auth';
import { RaRecord } from '../../types';
import {
    useGetOne,
    useRefresh,
    UseGetOneHookValue,
    UseGetOneOptions,
} from '../../dataProvider';
import { useTranslate } from '../../i18n';
import { useRedirect } from '../../routing';
import { useNotify } from '../../notification';
import {
    useResourceContext,
    useGetResourceLabel,
    useGetRecordRepresentation,
} from '../../core';

/**
 * Prepare data for the Show view.
 *
 * useShowController does a few things:
 * - it grabs the id from the URL and the resource name from the ResourceContext,
 * - it fetches the record via useGetOne,
 * - it prepares the page title.
 *
 * @param {Object} props The props passed to the Show component.
 *
 * @return {Object} controllerProps Fetched data and callbacks for the Show view
 *
 * @example
 *
 * import { useShowController } from 'react-admin';
 * import ShowView from './ShowView';
 *
 * const MyShow = () => {
 *     const controllerProps = useShowController();
 *     return <ShowView {...controllerProps} />;
 * };
 *
 * @example // useShowController can also take its parameters from props
 *
 * import { useShowController } from 'react-admin';
 * import ShowView from './ShowView';
 *
 * const MyShow = () => {
 *     const controllerProps = useShowController({ resource: 'posts', id: 1234 });
 *     return <ShowView {...controllerProps} />;
 * };
 */
export const useShowController = <RecordType extends RaRecord = any>(
    props: ShowControllerProps<RecordType> = {}
): ShowControllerResult<RecordType> => {
    const { disableAuthentication, id: propsId, queryOptions = {} } = props;
    useAuthenticated({ enabled: !disableAuthentication });
    const resource = useResourceContext(props);
    if (!resource) {
        throw new Error(
            `useShowController requires a non-empty resource prop or context`
        );
    }
    const getRecordRepresentation = useGetRecordRepresentation(resource);
    const translate = useTranslate();
    const notify = useNotify();
    const redirect = useRedirect();
    const refresh = useRefresh();
    const { id: routeId } = useParams<'id'>();
    if (!routeId && !propsId) {
        throw new Error(
            'useShowController requires an id prop or a route with an /:id? parameter.'
        );
    }
    const id = propsId != null ? propsId : decodeURIComponent(routeId!);
    const { meta, ...otherQueryOptions } = queryOptions;

    const {
        data: record,
        error,
        isLoading,
        isFetching,
        isPending,
        refetch,
    } = useGetOne<RecordType>(
        resource,
        { id, meta },
        {
            onError: () => {
                notify('ra.notification.item_doesnt_exist', {
                    type: 'error',
                });
                redirect('list', resource);
                refresh();
            },
            retry: false,
            ...otherQueryOptions,
        }
    );

    // eslint-disable-next-line eqeqeq
    if (record && record.id && record.id != id) {
        throw new Error(
            `useShowController: Fetched record's id attribute (${record.id}) must match the requested 'id' (${id})`
        );
    }

    const getResourceLabel = useGetResourceLabel();
    const recordRepresentation = getRecordRepresentation(record);
    const defaultTitle = translate('ra.page.show', {
        name: getResourceLabel(resource, 1),
        id,
        record,
        recordRepresentation:
            typeof recordRepresentation === 'string'
                ? recordRepresentation
                : '',
    });

    // @ts-ignore FIXME cannot find another way to fix this error: "Types of property 'isPending' are incompatible: Type 'boolean' is not assignable to type 'false'."
    return {
        defaultTitle,
        error,
        isLoading,
        isFetching,
        isPending,
        record,
        refetch,
        resource,
    };
};

export interface ShowControllerProps<RecordType extends RaRecord = any> {
    disableAuthentication?: boolean;
    id?: RecordType['id'];
    queryOptions?: UseGetOneOptions<RecordType>;
    resource?: string;
}

export interface ShowControllerBaseResult<RecordType extends RaRecord = any> {
    defaultTitle?: string;
    isFetching: boolean;
    isLoading: boolean;
    resource: string;
    record?: RecordType;
    refetch: UseGetOneHookValue<RecordType>['refetch'];
}

interface ShowControllerLoadingResult<RecordType extends RaRecord = any>
    extends ShowControllerBaseResult<RecordType> {
    record: undefined;
    error: null;
    isPending: true;
}
interface ShowControllerLoadingErrorResult<
    RecordType extends RaRecord = any,
    TError = Error
> extends ShowControllerBaseResult<RecordType> {
    record: undefined;
    error: TError;
    isPending: false;
}
interface ShowControllerRefetchErrorResult<
    RecordType extends RaRecord = any,
    TError = Error
> extends ShowControllerBaseResult<RecordType> {
    record: RecordType;
    error: TError;
    isPending: false;
}
interface ShowControllerSuccessResult<RecordType extends RaRecord = any>
    extends ShowControllerBaseResult<RecordType> {
    record: RecordType;
    error: null;
    isPending: false;
}

export type ShowControllerResult<RecordType extends RaRecord = any> =
    | ShowControllerLoadingResult<RecordType>
    | ShowControllerLoadingErrorResult<RecordType>
    | ShowControllerRefetchErrorResult<RecordType>
    | ShowControllerSuccessResult<RecordType>;
