import React from 'react';
import PropTypes from 'prop-types';
import { withStyles, createStyles } from '@material-ui/core/styles';
import classnames from 'classnames';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useTranslate } from 'ra-core';

const styles = theme =>
    createStyles({
        container: {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            [theme.breakpoints.up('md')]: {
                height: '100%',
            },
            [theme.breakpoints.down('sm')]: {
                height: '100vh',
                marginTop: '-3em',
            },
        },
        icon: {
            width: '9em',
            height: '9em',
        },
        message: {
            textAlign: 'center',
            fontFamily: 'Roboto, sans-serif',
            opacity: 0.5,
            margin: '0 1em',
        },
    });

const Loading = ({
    classes,
    className,
    loadingPrimary = 'ra.page.loading',
    loadingSecondary = 'ra.message.loading',
}) => {
    const translate = useTranslate();
    return (
        <div className={classnames(classes.container, className)}>
            <div className={classes.message}>
                <CircularProgress className={classes.icon} color="primary" />
                <h1>{translate(loadingPrimary)}</h1>
                <div>{translate(loadingSecondary)}.</div>
            </div>
        </div>
    );
};

Loading.propTypes = {
    classes: PropTypes.object,
    className: PropTypes.string,
    loadingPrimary: PropTypes.string,
    loadingSecondary: PropTypes.string,
};

Loading.defaultProps = {
    loadingPrimary: 'ra.page.loading',
    loadingSecondary: 'ra.message.loading',
};

export default withStyles(styles)(Loading);
