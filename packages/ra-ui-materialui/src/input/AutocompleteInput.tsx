import * as React from 'react';
import { isValidElement, useEffect, useMemo, useRef, useState } from 'react';
import get from 'lodash/get';
import { Autocomplete, AutocompleteProps, TextField } from '@mui/material';
import {
    useInput,
    FieldTitle,
    ChoicesInputProps,
    UseChoicesOptions,
    useSuggestions,
    useTranslate,
    warning,
} from 'ra-core';
import {
    SupportCreateSuggestionOptions,
    useSupportCreateSuggestion,
} from './useSupportCreateSuggestion';
import { InputHelperText } from './InputHelperText';

export const AutocompleteInput = (props: AutocompleteInputProps) => {
    const {
        allowEmpty,
        choices,
        create,
        createLabel,
        createItemLabel,
        createValue,
        emptyText,
        emptyValue,
        format,
        helperText,
        id: idOverride,
        input: inputOverride,
        isRequired: isRequiredOverride,
        label,
        loaded,
        loading,
        limitChoicesToValue,
        matchSuggestion,
        meta: metaOverride,
        onBlur,
        onChange,
        onCreate,
        onFocus,
        options,
        optionText = 'name',
        optionValue = 'id',
        parse,
        resource,
        setFilter,
        shouldRenderSuggestions,
        source,
        suggestionLimit,
        translateChoice,
        validate,
        ...rest
    } = props;

    const translate = useTranslate();
    const {
        id,
        input,
        isRequired,
        meta: { touched, error, submitError },
    } = useInput({
        format,
        id: idOverride,
        input: inputOverride,
        meta: metaOverride,
        onBlur,
        onChange,
        onFocus,
        parse,
        resource,
        source,
        validate,
        ...rest,
    });

    const selectedItem = useMemo(
        () =>
            choices?.find(choice => get(choice, optionValue) === input.value) ||
            null,
        [choices, input.value, optionValue]
    );

    useEffect(() => {
        if (isValidElement(optionText)) {
            throw new Error(`
AutocompleteInput does not accept an element for the optionText prop.
Please provide an optionText that returns a string (used for the text input) and use the renderOption prop to customize how options are rendered.`);
        }
    }, [optionText]);

    useEffect(() => {
        warning(
            /* eslint-disable eqeqeq */
            shouldRenderSuggestions != undefined &&
                options?.noOptionsText == undefined,
            `When providing a shouldRenderSuggestions function, we recommend you also provide the noOptionsText through the options prop and set it to a text explaining users why no options are displayed.`
        );
        /* eslint-enable eqeqeq */
    }, [shouldRenderSuggestions, options]);

    const { getChoiceText, getChoiceValue, getSuggestions } = useSuggestions({
        allowEmpty,
        choices,
        emptyText,
        emptyValue,
        limitChoicesToValue,
        matchSuggestion,
        optionText,
        optionValue,
        selectedItem,
        suggestionLimit,
        translateChoice,
    });

    const handleChange = (choice: any) => {
        input.onChange(getChoiceValue(choice));
    };

    const [filterValue, setFilterValue] = useState('');

    // We must reset the filter every time the value changes to ensure we
    // display at least some choices even if the input has a value.
    // Otherwise, it would only display the currently selected one and the user
    // would have to first clear the input before seeing any other choices
    const currentValue = useRef(input.value);
    useEffect(() => {
        if (currentValue.current !== input.value) {
            currentValue.current = input.value;
            if (setFilter) {
                setFilter('');
            }
        }
    }, [input.value]); // eslint-disable-line

    const {
        getCreateItem,
        handleChange: handleChangeWithCreateSupport,
        createElement,
    } = useSupportCreateSuggestion({
        create,
        createLabel,
        createItemLabel,
        createValue,
        handleChange,
        filter: filterValue,
        onCreate,
        optionText,
    });

    const getOptionLabel = (option: any) => {
        // eslint-disable-next-line eqeqeq
        if (option == undefined) {
            return null;
        }
        // Value selected with enter, right from the input
        if (typeof option === 'string') {
            return option;
        }
        return getChoiceText(option);
    };

    const isOptionEqualToValue = (option, value) => {
        return getChoiceValue(option) === getChoiceValue(value);
    };

    const handleInputChange = (event: any, newInputValue: string) => {
        setFilterValue(newInputValue);

        if (setFilter && newInputValue !== getChoiceText(selectedItem)) {
            setFilter(newInputValue);
        }
    };

    const suggestions = useMemo(() => getSuggestions(filterValue), [
        filterValue,
        getSuggestions,
    ]);

    const doesQueryMatchSuggestion = useMemo(() => {
        if (isValidElement(optionText)) {
            return choices.some(choice => matchSuggestion(filterValue, choice));
        }

        const isFunction = typeof optionText === 'function';

        if (isFunction) {
            const hasOption = choices.some(choice => {
                const text = optionText(choice) as string;

                return get(choice, text) === filterValue;
            });

            const selectedItemText = optionText(selectedItem);

            return hasOption || selectedItemText === filterValue;
        }

        const selectedItemText = get(selectedItem, optionText);
        const hasOption = !!choices
            ? choices.some(choice => {
                  return get(choice, optionText) === filterValue;
              })
            : false;

        return selectedItemText === filterValue || hasOption;
    }, [choices, optionText, filterValue, matchSuggestion, selectedItem]);

    const filterOptions = (options, params) => {
        const { inputValue } = params;
        if (
            (onCreate || create) &&
            inputValue !== '' &&
            !doesQueryMatchSuggestion
        ) {
            return options.concat(getCreateItem());
        }

        return options;
    };

    const handleAutocompleteChange = (event: any, newValue) => {
        handleChangeWithCreateSupport(newValue);
    };

    return (
        <>
            <Autocomplete
                blurOnSelect
                clearText={translate('ra.action.clear_input_value')}
                closeText={translate('ra.action.close')}
                freeSolo={!!create || !!onCreate}
                selectOnFocus={!!create || !!onCreate}
                clearOnBlur={!!create || !!onCreate}
                handleHomeEndKeys={!!create || !!onCreate}
                openOnFocus
                openText={translate('ra.action.open')}
                options={
                    shouldRenderSuggestions == undefined || // eslint-disable-line eqeqeq
                    shouldRenderSuggestions(filterValue)
                        ? suggestions
                        : []
                }
                getOptionLabel={getOptionLabel}
                isOptionEqualToValue={isOptionEqualToValue}
                renderInput={params => (
                    <TextField
                        {...params}
                        id={id}
                        name={input.name}
                        label={
                            <FieldTitle
                                label={label}
                                source={source}
                                resource={resource}
                                isRequired={
                                    typeof isRequiredOverride !== 'undefined'
                                        ? isRequiredOverride
                                        : isRequired
                                }
                            />
                        }
                        error={!!(touched && (error || submitError))}
                        helperText={
                            <InputHelperText
                                touched={touched}
                                error={error || submitError}
                                helperText={helperText}
                            />
                        }
                    />
                )}
                {...options}
                filterOptions={filterOptions}
                inputValue={filterValue}
                loading={loading && suggestions.length === 0}
                value={selectedItem}
                onChange={handleAutocompleteChange}
                onBlur={input.onBlur}
                onFocus={input.onFocus}
                onInputChange={handleInputChange}
            />
            {createElement}
        </>
    );
};

export interface AutocompleteInputProps
    extends ChoicesInputProps<AutocompleteProps<any, false, false, false>>,
        UseChoicesOptions,
        Omit<SupportCreateSuggestionOptions, 'handleChange' | 'optionText'> {}
