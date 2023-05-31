import React from 'react';
import PropTypes from 'prop-types';
import Avatar from 'material-ui/Avatar';
import List, {
    ListItem,
    ListItemAvatar,
    ListItemIcon,
    ListItemSecondaryAction,
    ListItemText,
} from 'material-ui/List';
import { withStyles } from 'material-ui/styles';
import { Link } from 'react-router-dom';
import linkToRecord from '../../util/linkToRecord';

const styles = {
    link: {
        textDecoration: 'none',
        color: 'inherit',
    },
    tertiary: { float: 'right', opacity: 0.541176 },
};

const LinkOrNot = withStyles(styles)(
    ({ classes, linkType, basePath, id, children }) =>
        linkType === 'edit' || linkType === true ? (
            <Link to={linkToRecord(basePath, id)} className={classes.link}>
                {children}
            </Link>
        ) : linkType === 'show' ? (
            <Link
                to={`${linkToRecord(basePath, id)}/show`}
                className={classes.link}
            >
                {children}
            </Link>
        ) : (
            <span>{children}</span>
        )
);

const SimpleList = ({
    classes,
    className,
    ids,
    data,
    basePath,
    primaryText,
    secondaryText,
    tertiaryText,
    leftAvatar,
    leftIcon,
    rightAvatar,
    rightIcon,
    linkType,
}) => (
    <List className={className}>
        {ids.map(id => (
            <LinkOrNot linkType={linkType} basePath={basePath} id={id} key={id}>
                <ListItem button>
                    {leftIcon && (
                        <ListItemIcon>{leftIcon(data[id], id)}</ListItemIcon>
                    )}
                    {leftAvatar && (
                        <ListItemAvatar>
                            <Avatar>{leftAvatar(data[id], id)}</Avatar>
                        </ListItemAvatar>
                    )}
                    <ListItemText
                        primary={
                            <div>
                                {primaryText(data[id], id)}
                                {tertiaryText && (
                                    <span className={classes.tertiary}>
                                        {tertiaryText(data[id], id)}
                                    </span>
                                )}
                            </div>
                        }
                        secondary={secondaryText && secondaryText(data[id], id)}
                    />
                    {(rightAvatar || rightIcon) && (
                        <ListItemSecondaryAction>
                            {rightAvatar && (
                                <Avatar>{rightAvatar(data[id], id)}</Avatar>
                            )}
                            {rightIcon && (
                                <ListItemIcon>
                                    {rightIcon(data[id], id)}
                                </ListItemIcon>
                            )}
                        </ListItemSecondaryAction>
                    )}
                </ListItem>
            </LinkOrNot>
        ))}
    </List>
);

SimpleList.propTypes = {
    classes: PropTypes.object,
    className: PropTypes.string,
    ids: PropTypes.array,
    data: PropTypes.object,
    basePath: PropTypes.string,
    primaryText: PropTypes.func,
    secondaryText: PropTypes.func,
    tertiaryText: PropTypes.func,
    leftAvatar: PropTypes.func,
    leftIcon: PropTypes.func,
    rightAvatar: PropTypes.func,
    rightIcon: PropTypes.func,
    linkType: PropTypes.oneOfType([PropTypes.string, PropTypes.bool])
        .isRequired,
};

SimpleList.defaultProps = {
    linkType: 'edit',
};

export default SimpleList;
