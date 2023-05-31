import * as React from 'react';
import { Children, cloneElement, isValidElement, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslate, useGetIdentity } from 'ra-core';
import {
    Tooltip,
    IconButton,
    Menu,
    Button,
    Avatar,
    PopoverOrigin,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import AccountCircle from '@material-ui/icons/AccountCircle';

const useStyles = makeStyles(
    theme => ({
        user: {},
        userButton: {
            textTransform: 'none',
        },
        avatar: {
            width: theme.spacing(4),
            height: theme.spacing(4),
        },
    }),
    { name: 'RaUserMenu' }
);

const AnchorOrigin: PopoverOrigin = {
    vertical: 'bottom',
    horizontal: 'right',
};

const TransformOrigin: PopoverOrigin = {
    vertical: 'top',
    horizontal: 'right',
};

const UserMenu = props => {
    const [anchorEl, setAnchorEl] = useState(null);
    const translate = useTranslate();
    const { loaded, identity } = useGetIdentity();
    const classes = useStyles(props);

    const { children, label, icon, logout } = props;
    if (!logout && !children) return null;
    const open = Boolean(anchorEl);

    const handleMenu = event => setAnchorEl(event.currentTarget);
    const handleClose = () => setAnchorEl(null);

    return (
        <div className={classes.user}>
            {loaded && identity?.fullName ? (
                <Button
                    aria-label={label && translate(label, { _: label })}
                    className={classes.userButton}
                    color="inherit"
                    startIcon={
                        identity.avatar ? (
                            <Avatar
                                className={classes.avatar}
                                src={identity.avatar}
                                alt={identity.fullName}
                            />
                        ) : (
                            icon
                        )
                    }
                    onClick={handleMenu}
                >
                    {identity.fullName}
                </Button>
            ) : (
                <Tooltip title={label && translate(label, { _: label })}>
                    <IconButton
                        aria-label={label && translate(label, { _: label })}
                        aria-owns={open ? 'menu-appbar' : null}
                        aria-haspopup={true}
                        color="inherit"
                        onClick={handleMenu}
                    >
                        {icon}
                    </IconButton>
                </Tooltip>
            )}
            <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={AnchorOrigin}
                transformOrigin={TransformOrigin}
                // Make sure the menu is display under the button and not over the appbar
                // See https://material-ui.com/components/menus/#customized-menus
                getContentAnchorEl={null}
                open={open}
                onClose={handleClose}
            >
                {Children.map(children, menuItem =>
                    isValidElement(menuItem)
                        ? cloneElement<any>(menuItem, {
                              onClick: handleClose,
                          })
                        : null
                )}
                {logout}
            </Menu>
        </div>
    );
};

UserMenu.propTypes = {
    children: PropTypes.node,
    label: PropTypes.string.isRequired,
    logout: PropTypes.element,
    icon: PropTypes.node,
};

UserMenu.defaultProps = {
    label: 'ra.auth.user_menu',
    icon: <AccountCircle />,
};

export default UserMenu;
