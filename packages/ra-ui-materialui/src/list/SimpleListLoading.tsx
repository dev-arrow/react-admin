import * as React from 'react';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';
import Avatar from '@mui/material/Avatar';
import List, { ListProps } from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import ListItemText from '@mui/material/ListItemText';

import Placeholder from './Placeholder';
import { useTimeout } from 'ra-core';

const PREFIX = 'RaSimpleListLoading';

const classes = {
    primary: `${PREFIX}-primary`,
    tertiary: `${PREFIX}-tertiary`,
};

const StyledList = styled(List)(({ theme }) => ({
    [`& .${classes.primary}`]: {
        width: '30vw',
        display: 'inline-block',
        marginBottom: theme.spacing(),
    },

    [`& .${classes.tertiary}`]: {
        float: 'right',
        opacity: 0.541176,
        minWidth: '10vw',
    },
}));

const times = (nbChildren, fn) =>
    Array.from({ length: nbChildren }, (_, key) => fn(key));

interface Props {
    classes?: Record<'tertiary', string>;
    className?: string;
    hasLeftAvatarOrIcon?: boolean;
    hasRightAvatarOrIcon?: boolean;
    hasSecondaryText?: boolean;
    hasTertiaryText?: boolean;
    nbFakeLines?: number;
}

const SimpleListLoading = (props: Props & ListProps) => {
    const {
        classes: classesOverride,
        className,
        hasLeftAvatarOrIcon,
        hasRightAvatarOrIcon,
        hasSecondaryText,
        hasTertiaryText,
        nbFakeLines = 5,
        ...rest
    } = props;

    const oneSecondHasPassed = useTimeout(1000);

    return oneSecondHasPassed ? (
        <StyledList className={className} {...rest}>
            {times(nbFakeLines, key => (
                <ListItem key={key}>
                    {hasLeftAvatarOrIcon && (
                        <ListItemAvatar>
                            <Avatar>&nbsp;</Avatar>
                        </ListItemAvatar>
                    )}
                    <ListItemText
                        primary={
                            <div>
                                <Placeholder className={classes.primary} />
                                {hasTertiaryText && (
                                    <span className={classes.tertiary}>
                                        <Placeholder />
                                    </span>
                                )}
                            </div>
                        }
                        secondary={
                            hasSecondaryText ? <Placeholder /> : undefined
                        }
                    />
                    {hasRightAvatarOrIcon && (
                        <ListItemSecondaryAction>
                            <Avatar>&nbsp;</Avatar>
                        </ListItemSecondaryAction>
                    )}
                </ListItem>
            ))}
        </StyledList>
    ) : null;
};

SimpleListLoading.propTypes = {
    className: PropTypes.string,
    hasLeftAvatarOrIcon: PropTypes.bool,
    hasRightAvatarOrIcon: PropTypes.bool,
    hasSecondaryText: PropTypes.bool,
    hasTertiaryText: PropTypes.bool,
    nbFakeLines: PropTypes.number,
};

export default SimpleListLoading;
