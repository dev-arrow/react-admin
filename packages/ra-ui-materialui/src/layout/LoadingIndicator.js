import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';

import RefreshIconButton from '../button/RefreshIconButton';

const useStyles = makeStyles(
    {
        loader: {
            margin: 14,
        },
    },
    { name: 'LoadingIndicator' }
);

export const LoadingIndicator = ({
    classes: classesOverride,
    className,
    ...rest
}) => {
    const loading = useSelector(state => state.admin.loading > 0);
    const classes = useStyles({ classes: classesOverride });
    return loading ? (
        <CircularProgress
            className={classNames('app-loader', classes.loader, className)}
            color="inherit"
            size={18}
            thickness={5}
            {...rest}
        />
    ) : (
        <RefreshIconButton />
    );
};

LoadingIndicator.propTypes = {
    classes: PropTypes.object,
    className: PropTypes.string,
    isLoading: PropTypes.bool,
    width: PropTypes.string,
};

export default LoadingIndicator;
