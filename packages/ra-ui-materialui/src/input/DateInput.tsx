import * as React from 'react';
import clsx from 'clsx';
import TextField, { TextFieldProps } from '@mui/material/TextField';
import { useInput, FieldTitle, mergeRefs, useEvent } from 'ra-core';

import { CommonInputProps } from './CommonInputProps';
import { sanitizeInputRestProps } from './sanitizeInputRestProps';
import { InputHelperText } from './InputHelperText';

/**
 * Form input to edit a Date string value in the "YYYY-MM-DD" format (e.g. '2021-06-23').
 *
 * Renders a date picker (the exact UI depends on the browser).
 *
 * @example
 * import { Edit, SimpleForm, DateInput } from 'react-admin';
 *
 * const PostEdit = () => (
 *     <Edit>
 *         <SimpleForm>
 *             <DateInput source="published_at" />
 *         </SimpleForm>
 *     </Edit>
 * );
 *
 * @example
 * // If the initial value string contains more than a date (e.g. an hour, a timezone),
 * // these details are ignored.
 * <DateInput source="published_at" defaultValue="2021-09-11T20:46:20.000-04:00" />
 * // The input will display '2021-09-11' whatever the browser timezone.
 *
 * @example
 * // If the initial value is a Date object, DateInput converts it to a string
 * // and ignores the timezone.
 * <DateInput source="published_at" defaultValue={new Date("2021-09-11T20:46:20.000-04:00")} />
 * // The input will display '2021-09-11' whatever the browser timezone.
 *
 * @example
 * // If you want the returned value to be a Date, you must pass a custom parse method
 * to convert the form value (which is always a date string) back to a Date object.
 * <DateInput source="published_at" parse={val => new Date(val)} />
 */
export const DateInput = ({
    className,
    defaultValue,
    format = defaultFormat,
    label,
    source,
    resource,
    helperText,
    margin,
    onChange,
    onFocus,
    validate,
    variant,
    disabled,
    readOnly,
    ...rest
}: DateInputProps) => {
    const { field, fieldState, id, isRequired } = useInput({
        defaultValue,
        resource,
        source,
        validate,
        disabled,
        readOnly,
        format,
        ...rest,
    });
    const [renderCount, setRenderCount] = React.useState(1);
    const valueChangedFromInput = React.useRef(false);
    const localInputRef = React.useRef<HTMLInputElement>();
    const initialDefaultValueRef = React.useRef(field.value);

    // update the react-hook-form value if the field value changes
    React.useEffect(() => {
        const initialDateValue =
            new Date(initialDefaultValueRef.current).getTime() || null;

        const fieldDateValue = new Date(field.value).getTime() || null;

        if (
            initialDateValue !== fieldDateValue &&
            !valueChangedFromInput.current
        ) {
            setRenderCount(r => r + 1);
            field.onChange(field.value);
            initialDefaultValueRef.current = field.value;
            valueChangedFromInput.current = false;
        }
    }, [setRenderCount, field]);

    const { onBlur: onBlurFromField } = field;
    const hasFocus = React.useRef(false);

    // Update the input text when the user types in the input.
    // Also, update the react-hook-form value if the input value is a valid date string.
    const handleChange = useEvent(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            if (onChange) {
                onChange(event);
            }
            if (
                typeof event.target === 'undefined' ||
                typeof event.target.value === 'undefined'
            ) {
                return;
            }
            const target = event.target;
            const newValue = target.value;
            const isNewValueValid =
                newValue === '' ||
                (target.valueAsDate != null &&
                    !isNaN(new Date(target.valueAsDate).getTime()));

            // Some browsers will return null for an invalid date
            // so we only change react-hook-form value if it's not null.
            // The input reset is handled in the onBlur event handler
            if (newValue !== '' && newValue != null && isNewValueValid) {
                field.onChange(newValue);
                valueChangedFromInput.current = true;
            }
        }
    );

    const handleFocus = useEvent(
        (event: React.FocusEvent<HTMLInputElement>) => {
            if (onFocus) {
                onFocus(event);
            }
            hasFocus.current = true;
        }
    );

    const handleBlur = () => {
        hasFocus.current = false;

        if (!localInputRef.current) {
            return;
        }

        const newValue = localInputRef.current.value;
        // To ensure users can clear the input, we check its value on blur
        // and submit it to react-hook-form
        const isNewValueValid =
            newValue === '' ||
            (localInputRef.current.valueAsDate != null &&
                !isNaN(new Date(localInputRef.current.valueAsDate).getTime()));

        if (isNewValueValid && field.value !== newValue) {
            field.onChange(newValue ?? '');
        }

        if (onBlurFromField) {
            onBlurFromField();
        }
    };
    const { error, invalid } = fieldState;
    const renderHelperText = helperText !== false || invalid;

    const { ref, name } = field;
    const inputRef = mergeRefs([ref, localInputRef]);

    return (
        <TextField
            id={id}
            name={name}
            inputRef={inputRef}
            defaultValue={format(initialDefaultValueRef.current)}
            key={renderCount}
            type="date"
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            className={clsx('ra-input', `ra-input-${source}`, className)}
            size="small"
            variant={variant}
            margin={margin}
            error={invalid}
            disabled={disabled || readOnly}
            readOnly={readOnly}
            helperText={
                renderHelperText ? (
                    <InputHelperText
                        error={error?.message}
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
            InputLabelProps={defaultInputLabelProps}
            {...sanitizeInputRestProps(rest)}
        />
    );
};

export type DateInputProps = CommonInputProps &
    Omit<TextFieldProps, 'helperText' | 'label'>;

/**
 * Convert Date object to String, ignoring the timezone.
 *
 * @param {Date} value value to convert
 * @returns {String} A standardized date (yyyy-MM-dd), to be passed to an <input type="date" />
 */
const convertDateToString = (value: Date) => {
    if (!(value instanceof Date) || isNaN(value.getDate())) return '';
    let UTCDate = new Date(value.getTime() + value.getTimezoneOffset() * 60000);
    const pad = '00';
    const yyyy = UTCDate.getFullYear().toString();
    const MM = (UTCDate.getMonth() + 1).toString();
    const dd = UTCDate.getDate().toString();
    return `${yyyy}-${(pad + MM).slice(-2)}-${(pad + dd).slice(-2)}`;
};

const dateRegex = /^(\d{4}-\d{2}-\d{2}).*$/;
const defaultInputLabelProps = { shrink: true };

/**
 * Convert a form state value to a date string for the `<input type="date">` value.
 *
 * Form state values can be anything from:
 * - a string in the "YYYY-MM-DD" format
 * - A valid date string
 * - an ISO date string
 * - a Date object
 * - a Linux timestamp
 * - an empty string
 *
 * The output is always a string in the "YYYY-MM-DD" format.
 *
 * @example
 * defaultFormat('2021-09-11'); // '2021-09-11'
 * defaultFormat('09/11/2021'); // '2021-09-11'
 * defaultFormat('2021-09-11T20:46:20.000Z'); // '2021-09-11'
 * defaultFormat(new Date('2021-09-11T20:46:20.000Z')); // '2021-09-11'
 * defaultFormat(1631385980000); // '2021-09-11'
 * defaultFormat(''); // null
 */
const defaultFormat = (value: string | Date | number) => {
    // null, undefined and empty string values should not go through dateFormatter
    // otherwise, it returns undefined and will make the input an uncontrolled one.
    if (value == null || value === '') {
        return null;
    }

    // Date objects should be converted to strings
    if (value instanceof Date) {
        return convertDateToString(value);
    }

    // Valid date strings should be stripped of their time and timezone parts.
    if (typeof value === 'string') {
        const matches = dateRegex.exec(value);
        if (matches) {
            return matches[1];
        }
    }

    // other values (e.g., localized date strings, timestamps) need to be converted to Dates first
    return convertDateToString(new Date(value));
};
