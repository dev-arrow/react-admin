import * as React from 'react';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';
import IconButton from '@mui/material/IconButton';
import ActionHide from '@mui/icons-material/HighlightOff';
import classnames from 'classnames';
import { useResourceContext, useTranslate } from 'ra-core';

const PREFIX = 'RaFilterFormInput';

const classes = {
    body: `${PREFIX}-body`,
    spacer: `${PREFIX}-spacer`,
    hideButton: `${PREFIX}-hideButton`,
};

const Root = styled('div')(({ theme }) => ({
    [`&.${classes.body}`]: {
        display: 'flex',
        alignItems: 'flex-end',
        pointerEvents: 'auto',
    },

    [`& .${classes.spacer}`]: { width: theme.spacing(2) },
    [`& .${classes.hideButton}`]: {},
}));

const emptyRecord = {};

const FilterFormInput = props => {
    const { filterElement, handleHide, variant, margin } = props;
    const resource = useResourceContext(props);
    const translate = useTranslate();

    return (
        <Root
            data-source={filterElement.props.source}
            className={classnames('filter-field', classes.body)}
        >
            {!filterElement.props.alwaysOn && (
                <IconButton
                    className={classnames('hide-filter', classes.hideButton)}
                    onClick={handleHide}
                    data-key={filterElement.props.source}
                    title={translate('ra.action.remove_filter')}
                    size="large"
                >
                    <ActionHide />
                </IconButton>
            )}
            {React.cloneElement(filterElement, {
                allowEmpty:
                    filterElement.props.allowEmpty === undefined
                        ? true
                        : filterElement.props.allowEmpty,
                resource,
                record: emptyRecord,
                variant,
                margin,
                helperText: false,
                // ignore defaultValue in Field because it was already set in Form (via mergedInitialValuesWithDefaultValues)
                defaultValue: undefined,
            })}
            <div className={classes.spacer}>&nbsp;</div>
        </Root>
    );
};

FilterFormInput.propTypes = {
    filterElement: PropTypes.node,
    handleHide: PropTypes.func,
    resource: PropTypes.string,
    margin: PropTypes.string,
    variant: PropTypes.string,
};

export default FilterFormInput;
