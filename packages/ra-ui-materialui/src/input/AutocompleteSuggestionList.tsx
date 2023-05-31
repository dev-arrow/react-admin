import * as React from 'react';
import { ReactNode } from 'react';
import classnames from 'classnames';
import { Paper, Popper } from '@mui/material';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles(
    {
        suggestionsContainer: {
            zIndex: 2,
        },
        suggestionsPaper: {
            maxHeight: '50vh',
            overflowY: 'auto',
        },
    },
    { name: 'RaAutocompleteSuggestionList' }
);

interface Props {
    children: ReactNode;
    className?: string;
    isOpen: boolean;
    menuProps: any;
    inputEl: HTMLElement;
    classes?: any;
    suggestionsContainerProps?: any;
}

const PopperModifiers = [];
const AutocompleteSuggestionList = (props: Props) => {
    const {
        children,
        className,
        isOpen,
        menuProps,
        inputEl,
        suggestionsContainerProps,
    } = props;
    const classes = useStyles(props);

    return (
        <Popper
            open={isOpen}
            anchorEl={inputEl}
            className={classnames(classes.suggestionsContainer, className)}
            modifiers={PopperModifiers}
            {...suggestionsContainerProps}
        >
            <div {...(isOpen ? menuProps : {})}>
                <Paper
                    square
                    style={{
                        marginTop: 8,
                        minWidth: inputEl ? inputEl.clientWidth : null,
                    }}
                    className={classes.suggestionsPaper}
                >
                    {children}
                </Paper>
            </div>
        </Popper>
    );
};

export default AutocompleteSuggestionList;
