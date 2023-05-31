import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

import CrudRoute from './CrudRoute';
import Restricted from './auth/Restricted';

const AdminRoutes = ({ customRoutes, resources, authClient, dashboard }) => (
    <Switch>
        {customRoutes
            ? customRoutes.map((route, index) =>
                <Route
                    key={index}
                    exact={route.props.exact}
                    path={route.props.path}
                    component={route.props.component}
                    render={route.props.render}
                    children={route.props.children}
                />)
            : <Route path="dummy" />}
        {resources.map(resource =>
            <Route
                path={`/${resource.name}`}
                key={resource.name}
                render={() => <CrudRoute
                    resource={resource.name}
                    list={resource.list}
                    create={resource.create}
                    edit={resource.edit}
                    show={resource.show}
                    remove={resource.remove}
                    options={resource.options}
                    authClient={authClient}
                />}
            />
        )}
        {dashboard
            ? <Route
                exact
                path="/"
                render={routeProps =>
                    <Restricted authClient={authClient} authParams={{ route: 'dashboard' }} {...routeProps}>
                        {React.createElement(dashboard)}
                    </Restricted>}
                />
            : <Route exact path="/" render={() => <Redirect to={`/${resources[0].name}`} />} />
        }
    </Switch>
);

export default AdminRoutes;
