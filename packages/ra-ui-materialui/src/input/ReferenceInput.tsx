import React, { Children, ReactElement } from 'react';
import PropTypes from 'prop-types';
import {
    ChoicesContextProvider,
    useReferenceInputController,
    InputProps,
    ResourceContextProvider,
} from 'ra-core';

import { ReferenceError } from './ReferenceError';

/**
 * An Input component for choosing a reference record. Useful for foreign keys.
 *
 * This component fetches the possible values in the reference resource
 * (using `dataProvider.getList()`), then delegates rendering
 * to a subcomponent, to which it passes the possible choices
 * as the `choices` attribute.
 *
 * Use it with a selector component as child, like `<AutocompleteInput>`,
 * `<SelectInput>`, or `<RadioButtonGroupInput>`.
 *
 * @example
 * export const CommentEdit = (props) => (
 *     <Edit {...props}>
 *         <SimpleForm>
 *             <ReferenceInput label="Post" source="post_id" reference="posts">
 *                 <AutocompleteInput optionText="title" />
 *             </ReferenceInput>
 *         </SimpleForm>
 *     </Edit>
 * );
 *
 * @example
 * export const CommentEdit = (props) => (
 *     <Edit {...props}>
 *         <SimpleForm>
 *             <ReferenceInput label="Post" source="post_id" reference="posts">
 *                 <SelectInput optionText="title" />
 *             </ReferenceInput>
 *         </SimpleForm>
 *     </Edit>
 * );
 *
 * By default, restricts the possible values to 25. You can extend this limit
 * by setting the `perPage` prop.
 *
 * @example
 * <ReferenceInput
 *      source="post_id"
 *      reference="posts"
 *      perPage={100}>
 *     <SelectInput optionText="title" />
 * </ReferenceInput>
 *
 * By default, orders the possible values by id desc. You can change this order
 * by setting the `sort` prop (an object with `field` and `order` properties).
 *
 * @example
 * <ReferenceInput
 *      source="post_id"
 *      reference="posts"
 *      sort={{ field: 'title', order: 'ASC' }}>
 *     <SelectInput optionText="title" />
 * </ReferenceInput>
 *
 * Also, you can filter the query used to populate the possible values. Use the
 * `filter` prop for that.
 *
 * @example
 * <ReferenceInput
 *      source="post_id"
 *      reference="posts"
 *      filter={{ is_published: true }}>
 *     <SelectInput optionText="title" />
 * </ReferenceInput>
 *
 * The enclosed component may filter results. ReferenceInput passes a `setFilter`
 * function as prop to its child component. It uses the value to create a filter
 * for the query - by default { q: [searchText] }. You can customize the mapping
 * searchText => searchQuery by setting a custom `filterToQuery` function prop:
 *
 * @example
 * <ReferenceInput
 *      source="post_id"
 *      reference="posts"
 *      filterToQuery={searchText => ({ title: searchText })}>
 *     <AutocompleteInput optionText="title" />
 * </ReferenceInput>
 */
export const ReferenceInput = (props: ReferenceInputProps) => {
    const { children, label, reference } = props;

    const controllerProps = useReferenceInputController(props);

    if (Children.count(children) !== 1) {
        throw new Error('<ReferenceInput> only accepts a single child');
    }

    // This is not a form error but an unrecoverable error from the
    // useReferenceInputController hook
    if (controllerProps.error) {
        return <ReferenceError label={label} error={controllerProps.error} />;
    }

    return (
        <ResourceContextProvider value={reference}>
            <ChoicesContextProvider value={controllerProps}>
                {children}
            </ChoicesContextProvider>
        </ResourceContextProvider>
    );
};

ReferenceInput.propTypes = {
    allowEmpty: PropTypes.bool,
    children: PropTypes.element.isRequired,
    className: PropTypes.string,
    classes: PropTypes.object,
    filter: PropTypes.object,
    filterToQuery: PropTypes.func.isRequired,
    label: PropTypes.string,
    onChange: PropTypes.func,
    perPage: PropTypes.number,
    record: PropTypes.object,
    reference: PropTypes.string.isRequired,
    resource: PropTypes.string,
    sort: PropTypes.shape({
        field: PropTypes.string,
        order: PropTypes.oneOf(['ASC', 'DESC']),
    }),
    source: PropTypes.string,
};

ReferenceInput.defaultProps = {
    filter: {},
    filterToQuery: searchText => (searchText ? { q: searchText } : {}),
    perPage: 25,
    sort: { field: 'id', order: 'DESC' },
};

export interface ReferenceInputProps extends InputProps {
    allowEmpty?: boolean;
    children: ReactElement;
    className?: string;
    filterToQuery?: (filter: string) => any;
    label?: string;
    perPage?: number;
    reference: string;
    // @deprecated
    referenceSource?: (resource: string, source: string) => string;
    resource?: string;
    enableGetChoices?: (filters: any) => boolean;
    [key: string]: any;
}
