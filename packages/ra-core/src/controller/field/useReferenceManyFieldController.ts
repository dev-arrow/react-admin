import get from 'lodash/get';
import { useCallback, useEffect, useRef } from 'react';
import isEqual from 'lodash/isEqual';

import { useSafeSetState, removeEmpty } from '../../util';
import { useGetManyReference } from '../../dataProvider';
import { useNotify } from '../../sideEffect';
import { Record, SortPayload } from '../../types';
import { ListControllerResult } from '../list';
import usePaginationState from '../usePaginationState';
import useSelectionState from '../useSelectionState';
import useSortState from '../useSortState';

export interface UseReferenceManyFieldControllerParams {
    filter?: any;
    page?: number;
    perPage?: number;
    record?: Record;
    reference: string;
    resource: string;
    sort?: SortPayload;
    source?: string;
    target: string;
}

const defaultFilter = {};

/**
 * Fetch reference records, and return them when available
 *
 * The reference prop should be the name of one of the <Resource> components
 * added as <Admin> child.
 *
 * @example
 *
 * const { isLoading, referenceRecord, resourceLinkPath } = useReferenceManyFieldController({
 *     resource
 *     reference: 'users',
 *     record: {
 *         userId: 7
 *     }
 *     target: 'comments',
 *     source: 'userId',
 *     basePath: '/comments',
 *     page: 1,
 *     perPage: 25,
 * });
 *
 * @param {Object} props
 * @param {string} props.resource The current resource name
 * @param {string} props.reference The linked resource name
 * @param {Object} props.record The current resource record
 * @param {string} props.target The target resource key
 * @param {Object} props.filter The filter applied on the recorded records list
 * @param {string} props.source The key of the linked resource identifier
 * @param {number} props.page the page number
 * @param {number} props.perPage the number of item per page
 * @param {Object} props.sort the sort to apply to the referenced records
 *
 * @returns {ListControllerResult} The reference many props
 */
export const useReferenceManyFieldController = (
    props: UseReferenceManyFieldControllerParams
): ListControllerResult => {
    const {
        reference,
        record,
        target,
        filter = defaultFilter,
        source,
        page: initialPage,
        perPage: initialPerPage,
        sort: initialSort = { field: 'id', order: 'DESC' },
    } = props;
    const notify = useNotify();

    // pagination logic
    const { page, setPage, perPage, setPerPage } = usePaginationState({
        page: initialPage,
        perPage: initialPerPage,
    });

    // sort logic
    const { sort, setSort: setSortObject } = useSortState(initialSort);
    const setSort = useCallback(
        (field: string, order: string = 'ASC') => {
            setSortObject({ field, order });
            setPage(1);
        },
        [setPage, setSortObject]
    );

    // selection logic
    const {
        selectedIds,
        onSelect,
        onToggleItem,
        onUnselectItems,
    } = useSelectionState();

    // filter logic
    const filterRef = useRef(filter);
    const [displayedFilters, setDisplayedFilters] = useSafeSetState<{
        [key: string]: boolean;
    }>({});
    const [filterValues, setFilterValues] = useSafeSetState<{
        [key: string]: any;
    }>(filter);
    const hideFilter = useCallback(
        (filterName: string) => {
            setDisplayedFilters(previousState => {
                const { [filterName]: _, ...newState } = previousState;
                return newState;
            });
            setFilterValues(previousState => {
                const { [filterName]: _, ...newState } = previousState;
                return newState;
            });
        },
        [setDisplayedFilters, setFilterValues]
    );
    const showFilter = useCallback(
        (filterName: string, defaultValue: any) => {
            setDisplayedFilters(previousState => ({
                ...previousState,
                [filterName]: true,
            }));
            setFilterValues(previousState => ({
                ...previousState,
                [filterName]: defaultValue,
            }));
        },
        [setDisplayedFilters, setFilterValues]
    );
    const setFilters = useCallback(
        (filters, displayedFilters) => {
            setFilterValues(removeEmpty(filters));
            setDisplayedFilters(displayedFilters);
            setPage(1);
        },
        [setDisplayedFilters, setFilterValues, setPage]
    );
    // handle filter prop change
    useEffect(() => {
        if (!isEqual(filter, filterRef.current)) {
            filterRef.current = filter;
            setFilterValues(filter);
        }
    });

    const {
        data,
        total,
        error,
        isFetching,
        isLoading,
        refetch,
    } = useGetManyReference(
        reference,
        {
            target,
            id: get(record, source),
            pagination: { page, perPage },
            sort,
            filter: filterValues,
        },
        {
            onError: error =>
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
                ),
        }
    );

    return {
        currentSort: sort,
        data,
        defaultTitle: null,
        displayedFilters,
        error,
        filterValues,
        hideFilter,
        isFetching,
        isLoading,
        onSelect,
        onToggleItem,
        onUnselectItems,
        page,
        perPage,
        refetch,
        resource: reference,
        selectedIds,
        setFilters,
        setPage,
        setPerPage,
        setSort,
        showFilter,
        total,
    };
};
