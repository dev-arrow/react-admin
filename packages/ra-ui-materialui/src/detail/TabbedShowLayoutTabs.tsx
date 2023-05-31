import * as React from 'react';
import { Children, cloneElement, ReactElement, isValidElement } from 'react';
import PropTypes from 'prop-types';
import Tabs from '@material-ui/core/Tabs';
import { useLocation, useRouteMatch } from 'react-router-dom';
import { TabProps } from './Tab';

export const getTabFullPath = (tab, index, baseUrl) =>
    `${baseUrl}${
        tab.props.path ? `/${tab.props.path}` : index > 0 ? `/${index}` : ''
    }`.replace('//', '/');

export const TabbedShowLayoutTabs = ({
    children,
    syncWithLocation,
    ...rest
}: TabbedShowLayoutTabsProps) => {
    const location = useLocation();
    const match = useRouteMatch();

    // The location pathname will contain the page path including the current tab path
    // so we can use it as a way to determine the current tab
    const value = location.pathname;

    return (
        <Tabs indicatorColor="primary" value={value} {...rest}>
            {Children.map(children, (tab, index) => {
                if (!tab || !isValidElement(tab)) return null;
                // Builds the full tab which is the concatenation of the last matched route in the
                // TabbedShowLayout hierarchy (ex: '/posts/create', '/posts/12', , '/posts/12/show')
                // and the tab path.
                // This will be used as the Tab's value
                const tabPath = getTabFullPath(tab, index, match.url);

                return cloneElement(tab, {
                    context: 'header',
                    value: tabPath,
                    syncWithLocation,
                });
            })}
        </Tabs>
    );
};

export interface TabbedShowLayoutTabsProps {
    children?: ReactElement<TabProps>;
    syncWithLocation?: boolean;
}

TabbedShowLayoutTabs.propTypes = {
    children: PropTypes.node,
};
