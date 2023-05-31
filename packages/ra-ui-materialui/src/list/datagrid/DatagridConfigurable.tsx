import * as React from 'react';
import { useResourceContext, usePreference, useStore } from 'ra-core';

import { Configurable } from '../../preferences';
import { Datagrid, DatagridProps } from './Datagrid';
import { DatagridEditor } from './DatagridEditor';

/**
 * A Datagrid that users can customize in configuration mode
 *
 * @example
 * import {
 *     List,
 *     DatagridConfigurable,
 *     TextField,
 * } from 'react-admin';
 *
 * export const PostList = () => (
 *     <List>
 *         <DatagridConfigurable>
 *             <TextField source="id" />
 *             <TextField source="title" />
 *             <TextField source="author" />
 *             <TextField source="year" />
 *         </DatagridConfigurable>
 *     </List>
 * );
 */
export const DatagridConfigurable = ({
    preferenceKey,
    omit,
    ...props
}: DatagridConfigurableProps) => {
    if (props.optimized) {
        throw new Error(
            'DatagridConfigurable does not support the optimized prop'
        );
    }
    const resource = useResourceContext(props);
    const finalPreferenceKey = preferenceKey || `${resource}.datagrid`;

    const [availableColumns, setAvailableColumns] = useStore<
        ConfigurableDatagridColumn[]
    >(`preferences.${finalPreferenceKey}.availableColumns`, []);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_, setOmit] = useStore<string[]>(
        `preferences.${finalPreferenceKey}.omit`,
        omit
    );

    React.useEffect(() => {
        // first render, or the preference have been cleared
        const columns = React.Children.map(props.children, (child, index) =>
            React.isValidElement(child) &&
            (child.props.source || child.props.label)
                ? {
                      index: String(index),
                      source: child.props.source,
                      label: child.props.label,
                  }
                : null
        ).filter(column => column != null);
        if (JSON.stringify(columns) !== JSON.stringify(availableColumns)) {
            setAvailableColumns(columns);
            setOmit(omit);
        }
    }, [availableColumns]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <Configurable
            editor={<DatagridEditor />}
            preferenceKey={finalPreferenceKey}
            sx={{
                display: 'block',
                '& .MuiBadge-root': { display: 'flex' },
                '& .RaDatagrid-root': { flex: 1 },
                '& .MuiBadge-badge': { zIndex: 2 },
                minHeight: 2,
            }}
        >
            <DatagridWithPreferences {...props} />
        </Configurable>
    );
};

export interface DatagridConfigurableProps extends DatagridProps {
    /**
     * Key to use to store the user's preferences for this datagrid.
     *
     * Set to '[resource].datagrid' by default. Pass a custom key if you need
     * to display more than one ConfigurableDatagrid per resource.
     */
    preferenceKey?: string;
    /**
     * columns to hide by default
     *
     * @example
     * // by default, hide the id and author columns
     * // users can choose to show show them in configuration mode
     * const PostList = () => (
     *     <List>
     *         <DatagridConfigurable omit={['id', 'author']}>
     *             <TextField source="id" />
     *             <TextField source="title" />
     *             <TextField source="author" />
     *             <TextField source="year" />
     *         </DatagridConfigurable>
     *     </List>
     * );
     */
    omit?: string[];
}

export interface ConfigurableDatagridColumn {
    index: string;
    source: string;
    label?: string;
}

DatagridConfigurable.propTypes = Datagrid.propTypes;

/**
 * This Datagrid filters its children depending on preferences
 */
const DatagridWithPreferences = ({ children, ...props }: DatagridProps) => {
    const [availableColumns] = usePreference('availableColumns', []);
    const [omit] = usePreference('omit', []);
    const [columns] = usePreference(
        'columns',
        availableColumns
            .filter(column => !omit?.includes(column.source))
            .map(column => column.index)
    );
    const childrenArray = React.Children.toArray(children);
    return (
        <Datagrid {...props}>
            {columns === undefined
                ? children
                : columns.map(index => childrenArray[index])}
        </Datagrid>
    );
};
