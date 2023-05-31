import { useCallback } from 'react';
// @ts-ignore
import inflection from 'inflection';
import { parse } from 'query-string';

import { useCreate } from '../dataProvider';
import { useCheckMinimumRequiredProps } from './checkMinimumRequiredProps';
import { Location } from 'history';
import { match as Match } from 'react-router';
import { Record } from '../types';
import { useNotify, useRedirect, RedirectionSideEffect } from '../sideEffect';

import { useTranslate } from '../i18n';
import { useVersion } from '.';

export interface CreateControllerProps {
    isLoading: boolean;
    isSaving: boolean;
    defaultTitle: string;
    save: (record: Partial<Record>, redirect: RedirectionSideEffect) => void;
    resource: string;
    basePath: string;
    record?: Partial<Record>;
    redirect: RedirectionSideEffect;
    version: number;
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
    successMessage?: string;
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
        successMessage,
    } = props;

    const translate = useTranslate();
    const notify = useNotify();
    const redirect = useRedirect();
    const recordToUse = getRecord(location, record);
    const version = useVersion();

    const [create, { loading: isSaving }] = useCreate(resource);

    const save = useCallback(
        (
            data: Partial<Record>,
            redirectTo = 'list',
            { onSuccess, onFailure } = {}
        ) =>
            create(
                null,
                { data },
                {
                    onSuccess: onSuccess
                        ? onSuccess
                        : ({ data: newRecord }) => {
                              notify(
                                  successMessage || 'ra.notification.created',
                                  'info',
                                  {
                                      smart_count: 1,
                                  }
                              );
                              redirect(
                                  redirectTo,
                                  basePath,
                                  newRecord.id,
                                  newRecord
                              );
                          },
                    onFailure: onFailure
                        ? onFailure
                        : error => {
                              notify(
                                  typeof error === 'string'
                                      ? error
                                      : error.message ||
                                            'ra.notification.http_error',
                                  'warning'
                              );
                          },
                }
            ),
        [create, notify, successMessage, redirect, basePath]
    );

    const resourceName = translate(`resources.${resource}.name`, {
        smart_count: 1,
        _: inflection.humanize(inflection.singularize(resource)),
    });
    const defaultTitle = translate('ra.page.create', {
        name: `${resourceName}`,
    });

    return {
        isLoading: false,
        isSaving,
        defaultTitle,
        save,
        resource,
        basePath,
        record: recordToUse,
        redirect: getDefaultRedirectRoute(hasShow, hasEdit),
        version,
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
