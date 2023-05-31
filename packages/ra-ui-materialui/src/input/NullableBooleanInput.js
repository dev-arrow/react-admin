import React from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import { makeStyles } from '@material-ui/core/styles';
import classnames from 'classnames';
import { useInput, useTranslate, FieldTitle } from 'ra-core';

import sanitizeRestProps from './sanitizeRestProps';
import InputHelperText from './InputHelperText';

const useStyles = makeStyles(theme => ({
    input: { width: theme.spacing(16) },
}));

const getBooleanFromString = value => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return null;
};

const getStringFromBoolean = value => {
    if (value === true) return 'true';
    if (value === false) return 'false';
    return '';
};

const NullableBooleanInput = ({
    className,
    helperText,
    label,
    onBlur,
    onChange,
    onFocus,
    options,
    resource,
    source,
    validate,
    ...rest
}) => {
    const classes = useStyles();
    const translate = useTranslate();

    const {
        id,
        input,
        isRequired,
        meta: { error, touched },
    } = useInput({
        format: getStringFromBoolean,
        onBlur,
        onChange,
        onFocus,
        parse: getBooleanFromString,
        resource,
        source,
        type: 'checkbox',
        validate,
    });
    return (
        <TextField
            id={id}
            {...input}
            select
            margin="normal"
            label={
                <FieldTitle
                    label={label}
                    source={source}
                    resource={resource}
                    isRequired={isRequired}
                />
            }
            error={!!(touched && error)}
            helperText={
                <InputHelperText
                    touched={touched}
                    error={error}
                    helperText={helperText}
                />
            }
            className={classnames(classes.input, className)}
            {...options}
            {...sanitizeRestProps(rest)}
        >
            <MenuItem value="">{translate('ra.boolean.null')}</MenuItem>
            <MenuItem value="false">{translate('ra.boolean.false')}</MenuItem>
            <MenuItem value="true">{translate('ra.boolean.true')}</MenuItem>
        </TextField>
    );
};

NullableBooleanInput.propTypes = {
    label: PropTypes.string,
    options: PropTypes.object,
    resource: PropTypes.string,
    source: PropTypes.string,
};

export default NullableBooleanInput;
