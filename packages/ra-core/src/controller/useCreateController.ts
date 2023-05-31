import { useCallback } from 'react';
// @ts-ignore
import { useDispatch, useSelector } from 'react-redux';
import inflection from 'inflection';
import { parse } from 'query-string';

import { crudCreate } from '../actions';
import { useCheckMinimumRequiredProps } from './checkMinimumRequiredProps';
import { Location } from 'history';
import { match as Match } from 'react-router';
import { Record, ReduxState } from '../types';
import { RedirectionSideEffect } from '../sideEffect';
import { useTranslate } from '../i18n';

export interface CreateControllerProps {
    isLoading: boolean;
    defaultTitle: string;
    save: (record: Partial<Record>, redirect: RedirectionSideEffect) => void;
    resource: string;
    basePath: string;
    record?: Partial<Record>;
    redirect: RedirectionSideEffect;
}

export interface CreateProps {
    basePath: string;
    hasCreate?: boolean;
    hasEdit?: boolean;
    hasList?: boolean;
    hasShow?: boolean;
    location: Location;
    match: Match;
    record?: Partial<Record>;
    resource: string;
}

/**
 * Prepare data for the Create view
 *
 * @param {Object} props The props passed to the Create component.
 *
 * @return {Object} controllerProps Fetched data and callbacks for the Create view
 *
 * @example
 *
 * import { useCreateController } from 'react-admin';
 * import CreateView from './CreateView';
 *
 * const MyCreate = props => {
 *     const controllerProps = useCreateController(props);
 *     return <CreateView {...controllerProps} {...props} />;
 * }
 */
const useCreateController = (props: CreateProps): CreateControllerProps => {
    useCheckMinimumRequiredProps(
        'Create',
        ['basePath', 'location', 'resource'],
        props
    );
    const {
        basePath,
        resource,
        location,
        record = {},
        hasShow,
        hasEdit,
    } = props;

    const translate = useTranslate();
    const dispatch = useDispatch();
    const recordToUse = getRecord(location, record);
    const isLoading = useSelector(
        (state: ReduxState) => state.admin.loading > 0
    );

    const save = useCallback(
        (data: Partial<Record>, redirect: RedirectionSideEffect) => {
            dispatch(crudCreate(resource, data, basePath, redirect));
        },
        [resource, basePath] // eslint-disable-line react-hooks/exhaustive-deps
    );

    const resourceName = translate(`resources.${resource}.name`, {
        smart_count: 1,
        _: inflection.humanize(inflection.singularize(resource)),
    });
    const defaultTitle = translate('ra.page.create', {
        name: `${resourceName}`,
    });

    return {
        isLoading,
        defaultTitle,
        save,
        resource,
        basePath,
        record: recordToUse,
        redirect: getDefaultRedirectRoute(hasShow, hasEdit),
    };
};

export default useCreateController;

export const getRecord = ({ state, search }, record: any = {}) =>
    state && state.record
        ? state.record
        : search
        ? parse(search, { arrayFormat: 'bracket' })
        : record;

const getDefaultRedirectRoute = (hasShow, hasEdit) => {
    if (hasEdit) {
        return 'edit';
    }
    if (hasShow) {
        return 'show';
    }
    return 'list';
};
