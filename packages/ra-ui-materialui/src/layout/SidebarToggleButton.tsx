import * as React from 'react';
import { styled } from '@mui/material/styles';
import { IconButton, Tooltip } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useTranslate } from 'ra-core';
import { useToggleSidebar } from './useToggleSidebar';

const PREFIX = 'RaSidebarToggleButton';

const classes = {
    menuButtonIconClosed: `${PREFIX}-menuButtonIconClosed`,
    menuButtonIconOpen: `${PREFIX}-menuButtonIconOpen`,
};

const StyledIconButton = styled(IconButton)(({ theme }) => ({
    [`& .${classes.menuButtonIconClosed}`]: {
        transition: theme.transitions.create(['transform'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        transform: 'rotate(0deg)',
    },

    [`& .${classes.menuButtonIconOpen}`]: {
        transition: theme.transitions.create(['transform'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        transform: 'rotate(180deg)',
    },
}));

/**
 * A button that toggles the sidebar. Used by default in the <AppBar>.
 * @param props The component props
 * @param {String} props.className An optional class name to apply to the button

 */
export const SidebarToggleButton = (props: SidebarToggleButtonProps) => {
    const translate = useTranslate();

    const { className } = props;
    const [open, toggleSidebar] = useToggleSidebar();

    return (
        <Tooltip
            title={translate(
                open ? 'ra.action.close_menu' : 'ra.action.open_menu',
                {
                    _: 'Open/Close menu',
                }
            )}
            enterDelay={500}
        >
            <StyledIconButton
                color="inherit"
                onClick={() => toggleSidebar()}
                className={className}
                size="large"
            >
                <MenuIcon
                    classes={{
                        root: open
                            ? classes.menuButtonIconOpen
                            : classes.menuButtonIconClosed,
                    }}
                />
            </StyledIconButton>
        </Tooltip>
    );
};

export type SidebarToggleButtonProps = {
    className?: string;
};
