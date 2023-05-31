import * as React from 'react';
import {
    ListParams,
    SORT_ASC,
    useCreatePath,
    useGetList,
    useRecordContext,
    useResourceContext,
    useStore,
    useTranslate,
} from 'ra-core';
import { NavigateBefore, NavigateNext } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { IconButton, SxProps, styled } from '@mui/material';

export const PrevNextButton = (props: PrevNextButtonProps) => {
    const {
        linkType = 'edit',
        sx,
        storeKey,
        limit = 1000,
        listParams = defaultParams,
    } = props;

    const translate = useTranslate();
    const record = useRecordContext();
    const resource = useResourceContext();
    const createPath = useCreatePath();
    const [storedParams] = useStore<Params>(
        storeKey || `${resource}.listParams`,
        defaultParams
    );

    const { isLoading, data, isError, error } = useGetList(resource, {
        sort: {
            ...{ field: storedParams.sort, order: storedParams.order },
            ...{ field: listParams.sort, order: listParams.order },
        },
        filter: { ...storedParams.filter, ...listParams.filter },
        ...(limit ? { pagination: { page: 1, perPage: limit } } : {}),
    });

    if (isError) {
        console.error(error);
        return <>{error.message}</>;
    }

    if (isLoading) {
        return null;
    }

    if (!record) return null;
    const ids = data ? data.map(record => record.id) : [];

    const index = ids.indexOf(record.id);
    const previousId =
        typeof ids[index - 1] !== undefined ? ids[index - 1] : null; // could be 0
    const nextId =
        index !== -1 && index < ids.length - 1 ? ids[index + 1] : null;

    const previousLink = createPath({
        type: linkType,
        resource,
        id: previousId,
    });

    const nextLink = createPath({
        type: linkType,
        resource,
        id: nextId,
    });

    return (
        <PrevNextButtonRoot sx={sx}>
            <PrevNextButtonUl>
                <li>
                    <IconButton
                        disabled={typeof previousId !== 'number'}
                        aria-label={translate('ra.navigation.previous')}
                        component={Link}
                        to={previousLink}
                    >
                        <NavigateBefore />
                    </IconButton>
                </li>
                <li>
                    {index + 1} / {data.length}
                </li>
                <li>
                    <IconButton
                        disabled={!nextId}
                        aria-label={translate('ra.navigation.next')}
                        component={Link}
                        to={nextLink}
                    >
                        <NavigateNext />
                    </IconButton>
                </li>
            </PrevNextButtonUl>
        </PrevNextButtonRoot>
    );
};

export interface PrevNextButtonProps {
    linkType?: 'edit' | 'show';
    sx?: SxProps;
    storeKey?: string | false;
    limit?: number;
    listParams?: Params;
}

const PREFIX = 'RaPrevNextButton';

const PrevNextButtonRoot = styled('nav', {
    name: PREFIX,
    slot: 'Root',
    overridesResolver: (_props, styles) => styles.root,
})({});

const PrevNextButtonUl = styled('ul', {
    name: PREFIX,
    slot: 'Ul',
    overridesResolver: (_props, styles) => styles.ul,
})({
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    padding: 0,
    margin: 0,
    listStyle: 'none',
});

type Params = Pick<ListParams, 'filter' | 'order' | 'sort'>;

const defaultParams: Params = {
    sort: 'id',
    order: SORT_ASC,
    filter: {},
};
