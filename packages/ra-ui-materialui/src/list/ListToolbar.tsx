import * as React from 'react';
import { FC, ReactElement } from 'react';
import PropTypes from 'prop-types';
import { Toolbar, ToolbarProps } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Exporter } from 'ra-core';

import { ClassesOverride } from '../types';

const useStyles = makeStyles(
    theme => ({
        toolbar: {
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            paddingRight: 0,
            [theme.breakpoints.up('xs')]: {
                paddingLeft: 0,
            },
            [theme.breakpoints.down('xs')]: {
                paddingLeft: theme.spacing(2),
                backgroundColor: theme.palette.background.paper,
            },
        },
        actions: {
            paddingTop: theme.spacing(3),
            minHeight: theme.spacing(5),
            [theme.breakpoints.down('xs')]: {
                padding: theme.spacing(1),
                backgroundColor: theme.palette.background.paper,
            },
        },
    }),
    { name: 'RaListToolbar' }
);

const ListToolbar: FC<ListToolbarProps> = props => {
    const { classes: classesOverride, filters, actions, ...rest } = props;
    const classes = useStyles(props);
    return (
        <Toolbar className={classes.toolbar}>
            {filters &&
                React.cloneElement(filters, {
                    ...rest,
                    context: 'form',
                })}
            <span />
            {actions &&
                React.cloneElement(actions, {
                    ...rest,
                    className: classes.actions,
                    filters,
                    ...actions.props,
                })}
        </Toolbar>
    );
};

ListToolbar.propTypes = {
    classes: PropTypes.object,
    filters: PropTypes.element,
    actions: PropTypes.element,
    // @ts-ignore
    exporter: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
};

export interface ListToolbarProps
    extends Omit<ToolbarProps, 'classes' | 'onSelect'> {
    actions?: ReactElement | false;
    classes?: ClassesOverride<typeof useStyles>;
    filters?: ReactElement;
    exporter?: Exporter | false;
}

export default React.memo(ListToolbar);
