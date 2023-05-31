import React from 'react';
import PropTypes from 'prop-types';
import { LinearProgress } from 'material-ui/Progress';
import { withStyles } from 'material-ui/styles';
import { CoreReferenceManyField } from 'react-admin-core';

const styles = {
    progress: { marginTop: '1em' },
};

export const InnerReferenceManyField = ({
    children,
    classes = {},
    className,
    currentSort,
    data,
    ids,
    isLoading,
    reference,
    referenceBasePath,
    setSort,
}) => {
    if (isLoading) {
        return <LinearProgress className={classes.progress} />;
    }

    return React.cloneElement(children, {
        className,
        resource: reference,
        ids,
        data,
        basePath: referenceBasePath,
        currentSort,
        setSort,
    });
};

/**
 * Render related records to the current one.
 *
 * You must define the fields to be passed to the iterator component as children.
 *
 * @example Display all the comments of the current post as a datagrid
 * <ReferenceManyField reference="comments" target="post_id">
 *     <Datagrid>
 *         <TextField source="id" />
 *         <TextField source="body" />
 *         <DateField source="created_at" />
 *         <EditButton />
 *     </Datagrid>
 * </ReferenceManyField>
 *
 * @example Display all the books by the current author, only the title
 * <ReferenceManyField reference="books" target="author_id">
 *     <SingleFieldList>
 *         <ChipField source="title" />
 *     </SingleFieldList>
 * </ReferenceManyField>
 *
 * By default, restricts the possible values to 25. You can extend this limit
 * by setting the `perPage` prop.
 *
 * @example
 * <ReferenceManyField perPage={10} reference="comments" target="post_id">
 *    ...
 * </ReferenceManyField>
 *
 * By default, orders the possible values by id desc. You can change this order
 * by setting the `sort` prop (an object with `field` and `order` properties).
 *
 * @example
 * <ReferenceManyField sort={{ field: 'created_at', order: 'DESC' }} reference="comments" target="post_id">
 *    ...
 * </ReferenceManyField>
 *
 * Also, you can filter the query used to populate the possible values. Use the
 * `filter` prop for that.
 *
 * @example
 * <ReferenceManyField filter={{ is_published: true }} reference="comments" target="post_id">
 *    ...
 * </ReferenceManyField>
 */
export const ReferenceManyField = ({
    basePath,
    children,
    classes = {},
    className,
    filter,
    perPage,
    record,
    resource,
    reference,
    source,
    target,
}) => {
    if (React.Children.count(children) !== 1) {
        throw new Error(
            '<ReferenceManyField> only accepts a single child (like <Datagrid>)'
        );
    }

    return (
        <CoreReferenceManyField
            {...{
                filter,
                perPage,
                record,
                resource,
                reference,
                basePath,
                source,
                target,
            }}
        >
            {({
                data,
                ids,
                isLoading,
                referenceBasePath,
                currentSort,
                setSort,
            }) => (
                <InnerReferenceManyField
                    {...{
                        children,
                        classes,
                        className,
                        currentSort,
                        data,
                        ids,
                        isLoading,
                        reference,
                        referenceBasePath,
                        setSort,
                    }}
                />
            )}
        </CoreReferenceManyField>
    );
};

ReferenceManyField.propTypes = {
    addLabel: PropTypes.bool,
    basePath: PropTypes.string.isRequired,
    children: PropTypes.element.isRequired,
    classes: PropTypes.object,
    className: PropTypes.string,
    filter: PropTypes.object,
    label: PropTypes.string,
    perPage: PropTypes.number,
    record: PropTypes.object,
    reference: PropTypes.string.isRequired,
    resource: PropTypes.string.isRequired,
    source: PropTypes.string.isRequired,
    target: PropTypes.string.isRequired,
};

ReferenceManyField.defaultProps = {
    filter: {},
    perPage: 25,
    sort: { field: 'id', order: 'DESC' },
    source: 'id',
};

const EnhancedReferenceManyField = withStyles(styles)(ReferenceManyField);

EnhancedReferenceManyField.defaultProps = {
    addLabel: true,
    source: 'id',
};

export default EnhancedReferenceManyField;
