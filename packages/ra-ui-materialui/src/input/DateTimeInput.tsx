import React, { FunctionComponent } from 'react';
import PropTypes from 'prop-types';
import TextField, { TextFieldProps } from '@material-ui/core/TextField';
import { useInput, FieldTitle, InputProps } from 'ra-core';

import sanitizeRestProps from './sanitizeRestProps';
import InputHelperText from './InputHelperText';

const leftPad = (nb = 2) => value => ('0'.repeat(nb) + value).slice(-nb);
const leftPad4 = leftPad(4);
const leftPad2 = leftPad(2);

/**
 * @param {Date} value value to convert
 * @returns {String} A standardized datetime (yyyy-MM-ddThh:mm), to be passed to an <input type="datetime-local" />
 */
const convertDateToString = (value: Date) => {
    if (!(value instanceof Date) || isNaN(value.getDate())) return '';
    const yyyy = leftPad4(value.getFullYear());
    const MM = leftPad2(value.getMonth() + 1);
    const dd = leftPad2(value.getDate());
    const hh = leftPad2(value.getHours());
    const mm = leftPad2(value.getMinutes());
    return `${yyyy}-${MM}-${dd}T${hh}:${mm}`;
};

// yyyy-MM-ddThh:mm
const dateTimeRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;

/**
 * Converts a date from the Redux store, with timezone, to a date string
 * without timezone for use in an <input type="datetime-local" />.
 *
 * @param {Date | String} value date string or object
 */
const format = (value: string | Date) => {
    // null, undefined and empty string values should not go through convertDateToString
    // otherwise, it returns undefined and will make the input an uncontrolled one.
    if (value == null || value === '') {
        return '';
    }

    if (value instanceof Date) {
        return convertDateToString(value);
    }
    // valid dates should not be converted
    if (dateTimeRegex.test(value)) {
        return value;
    }

    return convertDateToString(new Date(value));
};

/**
 * Converts a datetime string without timezone to a date object
 * with timezone, using the browser timezone.
 *
 * @param {String} value Date string, formatted as yyyy-MM-ddThh:mm
 * @return {Date}
 */
const parse = (value: string) => new Date(value);

/**
 * Input component for entering a date and a time with timezone, using the browser locale
 */
export const DateTimeInput: FunctionComponent<
    InputProps<TextFieldProps> & Omit<TextFieldProps, 'helperText' | 'label'>
> = ({
    label,
    helperText,
    onBlur,
    onChange,
    onFocus,
    options,
    source,
    resource,
    validate,
    ...rest
}) => {
    const {
        id,
        input,
        isRequired,
        meta: { error, touched },
    } = useInput({
        format,
        onBlur,
        onChange,
        onFocus,
        parse,
        resource,
        source,
        type: 'datetime-local',
        validate,
        ...rest,
    });

    return (
        <TextField
            id={id}
            {...input}
            margin="normal"
            error={!!(touched && error)}
            helperText={
                (touched && error) || helperText ? (
                    <InputHelperText
                        touched={touched}
                        error={error}
                        helperText={helperText}
                    />
                ) : null
            }
            label={
                <FieldTitle
                    label={label}
                    source={source}
                    resource={resource}
                    isRequired={isRequired}
                />
            }
            InputLabelProps={{
                shrink: true,
            }}
            {...options}
            {...sanitizeRestProps(rest)}
        />
    );
};

DateTimeInput.propTypes = {
    label: PropTypes.string,
    options: PropTypes.object,
    resource: PropTypes.string,
    source: PropTypes.string,
};

DateTimeInput.defaultProps = {
    options: {},
};

export default DateTimeInput;
