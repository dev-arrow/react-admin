import * as React from 'react';
import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Switch } from 'react-router-dom';

import WithPermissions from '../auth/WithPermissions';
import { registerResource, unregisterResource } from '../actions';
import { ResourceProps, ReduxState } from '../types';
import { ResourceContextProvider } from './ResourceContextProvider';

const defaultOptions = {};

const ResourceRegister = (props: ResourceProps) => {
    const {
        name,
        list,
        create,
        edit,
        show,
        icon,
        options = defaultOptions,
    } = props;
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(
            registerResource({
                name,
                options,
                hasList: !!list,
                hasEdit: !!edit,
                hasShow: !!show,
                hasCreate: !!create,
                icon,
            })
        );
        return () => {
            dispatch(unregisterResource(name));
        };
    }, [dispatch, name, create, edit, icon, list, show, options]);
    return null;
};

const ResourceRoutes = (props: ResourceProps) => {
    const {
        name,
        match,
        list,
        create,
        edit,
        show,
        options = defaultOptions,
    } = props;
    const isRegistered = useSelector(
        (state: ReduxState) => !!state.admin.resources[name]
    );

    const basePath = match ? match.path : '';

    // match tends to change even on the same route ; using memo to avoid an extra render
    return useMemo(() => {
        // if the registration hasn't finished, no need to render
        if (!isRegistered) {
            return null;
        }

        return (
            <ResourceContextProvider value={name}>
                <Switch>
                    {create && (
                        <Route path={`${basePath}/create`}>
                            <WithPermissions component={create} />
                        </Route>
                    )}
                    {show && (
                        <Route path={`${basePath}/:id/show`}>
                            <WithPermissions component={show} />
                        </Route>
                    )}
                    {edit && (
                        <Route path={`${basePath}/:id`}>
                            <WithPermissions component={edit} />
                        </Route>
                    )}
                    {list && (
                        <Route path={`${basePath}`}>
                            <WithPermissions component={list} />
                        </Route>
                    )}
                </Switch>
            </ResourceContextProvider>
        );
    }, [basePath, name, create, edit, list, show, options, isRegistered]); // eslint-disable-line react-hooks/exhaustive-deps
};

const Resource = (props: ResourceProps) => {
    const { intent = 'route', ...rest } = props;
    return intent === 'registration' ? (
        <ResourceRegister {...rest} />
    ) : (
        <ResourceRoutes {...rest} />
    );
};

export default Resource;
