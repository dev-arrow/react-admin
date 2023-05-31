import * as React from 'react';

import { AutoSubmitFilterForm, AutoSubmitFilterFormProps } from '.';
import { useInput, required } from '../../../form';
import { ListContextProvider } from '../ListContextProvider';
import { useList } from '../useList';
import { useListContext } from '../useListContext';

export default { title: 'ra-core/controller/list/filter/AutoSubmitFilterForm' };

const TextInput = props => {
    const { field, fieldState } = useInput(props);
    const { error } = fieldState;

    return (
        <div
            style={{
                margin: '1em',
                display: 'flex',
                flexDirection: 'column',
                gap: '5px',
            }}
        >
            <label htmlFor={field.name}>{props.label || field.name}</label>
            <input {...field} />
            {error && (
                <div style={{ color: 'red' }}>
                    {/* @ts-ignore */}
                    {error.message?.message || error.message}
                </div>
            )}
        </div>
    );
};

export const Basic = (props: Partial<AutoSubmitFilterFormProps>) => {
    const listContext = useList({
        data: [
            { id: 1, title: 'Hello', has_newsletter: true },
            { id: 2, title: 'World', has_newsletter: false },
        ],
        filter: {
            category: 'deals',
        },
    });
    return (
        <ListContextProvider value={listContext}>
            <AutoSubmitFilterForm {...props}>
                <TextInput source="title" />
            </AutoSubmitFilterForm>
            <FilterValue />
        </ListContextProvider>
    );
};

export const NoDebounce = () => <Basic debounce={false} />;

export const MultipleInput = () => {
    const listContext = useList({
        data: [
            { id: 1, title: 'Hello', has_newsletter: true },
            { id: 2, title: 'World', has_newsletter: false },
        ],
        filter: {
            category: 'deals',
        },
    });
    return (
        <ListContextProvider value={listContext}>
            <AutoSubmitFilterForm>
                <TextInput source="title" />
                <TextInput source="author" />
            </AutoSubmitFilterForm>
            <FilterValue />
        </ListContextProvider>
    );
};

export const MultipleAutoSubmitFilterForm = () => {
    const listContext = useList({
        data: [
            { id: 1, title: 'Hello', has_newsletter: true },
            { id: 2, title: 'World', has_newsletter: false },
        ],
        filter: {
            category: 'deals',
        },
    });
    return (
        <ListContextProvider value={listContext}>
            <AutoSubmitFilterForm>
                <TextInput source="title" />
            </AutoSubmitFilterForm>
            <AutoSubmitFilterForm>
                <TextInput source="author" />
            </AutoSubmitFilterForm>
            <FilterValue />
        </ListContextProvider>
    );
};

export const PerInputValidation = () => {
    const listContext = useList({
        data: [
            { id: 1, title: 'Hello', has_newsletter: true },
            { id: 2, title: 'World', has_newsletter: false },
        ],
        filter: {
            category: 'deals',
            author: 'Leo Tolstoy',
        },
    });
    return (
        <ListContextProvider value={listContext}>
            <AutoSubmitFilterForm>
                <TextInput source="title" />
                <TextInput source="author" validate={required()} />
            </AutoSubmitFilterForm>
            <FilterValue />
        </ListContextProvider>
    );
};

const validateFilters = values => {
    const errors: any = {};
    if (!values.author) {
        errors.author = 'The author is required';
    }
    return errors;
};
export const GlobalValidation = () => {
    const listContext = useList({
        data: [
            { id: 1, title: 'Hello', has_newsletter: true },
            { id: 2, title: 'World', has_newsletter: false },
        ],
        filter: {
            category: 'deals',
            author: 'Leo Tolstoy',
        },
    });
    return (
        <ListContextProvider value={listContext}>
            <AutoSubmitFilterForm validate={validateFilters}>
                <TextInput source="title" />
                <TextInput source="author" isRequired />
            </AutoSubmitFilterForm>
            <FilterValue />
        </ListContextProvider>
    );
};

const FilterValue = () => {
    const { filterValues } = useListContext();
    return (
        <div style={{ margin: '1em' }}>
            <p>Filter values:</p>
            <pre>{JSON.stringify(filterValues, null, 2)}</pre>
            <pre style={{ display: 'none' }} data-testid="filter-values">
                {JSON.stringify(filterValues)}
            </pre>
        </div>
    );
};
