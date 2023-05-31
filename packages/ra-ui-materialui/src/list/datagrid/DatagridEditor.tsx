import * as React from 'react';
import { usePreference, useSetInspectorTitle, useTranslate } from 'ra-core';
import { Box, Button } from '@mui/material';

import { FieldEditor } from './FieldEditor';

export const DatagridEditor = (props: {
    children: React.ReactNode;
    omit?: string[];
}) => {
    const translate = useTranslate();
    useSetInspectorTitle('ra.inspector.datagrid', { _: 'Datagrid' });

    const availableColumns = React.Children.map(props.children, child =>
        React.isValidElement(child) ? child.props.source : null
    ).filter(name => name != null);

    const [columns, setColumns] = usePreference(
        'colums',
        availableColumns.filter(name => !props.omit?.includes(name))
    );

    const handleToggle = event => {
        if (event.target.checked) {
            // add the column at the right position
            setColumns(
                availableColumns.filter(
                    column =>
                        column === event.target.name || columns.includes(column)
                )
            );
        } else {
            setColumns(columns.filter(name => name !== event.target.name));
        }
    };

    const handleHideAll = () => {
        setColumns([]);
    };
    const handleShowAll = () => {
        setColumns(availableColumns);
    };
    return (
        <div>
            {React.Children.map(props.children, child =>
                React.isValidElement(child) && child.props.source ? (
                    <FieldEditor
                        source={child.props.source}
                        label={child.props.label}
                        selected={columns.includes(child.props.source)}
                        onToggle={handleToggle}
                    />
                ) : null
            )}
            <Box display="flex" justifyContent="space-between" mx={-0.5} mt={1}>
                <Button size="small" onClick={handleHideAll}>
                    {translate('ra.inspector.datagrid.hideAll', {
                        _: 'Hide All',
                    })}
                </Button>
                <Button size="small" onClick={handleShowAll}>
                    {translate('ra.inspector.datagrid.showAll', {
                        _: 'Show All',
                    })}
                </Button>
            </Box>
        </div>
    );
};
