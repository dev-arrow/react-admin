import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form';
import { CardContent } from 'material-ui/Card';
import IconButton from 'material-ui/IconButton';
import ActionHide from 'material-ui-icons/HighlightOff';
import compose from 'recompose/compose';
import withProps from 'recompose/withProps';
import { withTheme } from 'material-ui/styles';

import translate from '../../i18n/translate';

const getStyles = ({ palette: { primary1Color } }) => ({
    card: {
        marginTop: '-14px',
        paddingTop: 0,
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        flexWrap: 'wrap',
    },
    body: { display: 'flex', alignItems: 'flex-end' },
    spacer: { width: 48 },
    icon: { color: primary1Color || '#00bcd4', paddingBottom: 0 },
    clearFix: { clear: 'right' },
});

const emptyRecord = {};

export class FilterForm extends Component {
    getShownFilters() {
        const { filters, displayedFilters, initialValues } = this.props;
        return filters.filter(
            filterElement =>
                filterElement.props.alwaysOn ||
                displayedFilters[filterElement.props.source] ||
                typeof initialValues[filterElement.props.source] !== 'undefined'
        );
    }

    handleHide = event =>
        this.props.hideFilter(event.currentTarget.dataset.key);

    render() {
        const { resource, translate, theme } = this.props;

        const styles = getStyles(theme);

        return (
            <div>
                <CardContent style={styles.card}>
                    {this.getShownFilters()
                        .reverse()
                        .map(filterElement => (
                            <div
                                key={filterElement.props.source}
                                data-source={filterElement.props.source}
                                className="filter-field"
                                style={filterElement.props.style || styles.body}
                            >
                                {filterElement.props.alwaysOn ? (
                                    <div style={styles.spacer}>&nbsp;</div>
                                ) : (
                                    <IconButton
                                        iconStyle={styles.icon}
                                        className="hide-filter"
                                        onClick={this.handleHide}
                                        data-key={filterElement.props.source}
                                        tooltip={translate(
                                            'ra.action.remove_filter'
                                        )}
                                    >
                                        <ActionHide />
                                    </IconButton>
                                )}
                                <div>
                                    <Field
                                        allowEmpty
                                        {...filterElement.props}
                                        name={filterElement.props.source}
                                        component={filterElement.type}
                                        resource={resource}
                                        record={emptyRecord}
                                    />
                                </div>
                            </div>
                        ))}
                </CardContent>
                <div style={styles.clearFix} />
            </div>
        );
    }
}

FilterForm.propTypes = {
    resource: PropTypes.string.isRequired,
    filters: PropTypes.arrayOf(PropTypes.node).isRequired,
    displayedFilters: PropTypes.object.isRequired,
    hideFilter: PropTypes.func.isRequired,
    initialValues: PropTypes.object,
    translate: PropTypes.func.isRequired,
    theme: PropTypes.object.isRequired,
};

export const mergeInitialValuesWithDefaultValues = ({
    initialValues,
    filters,
}) => ({
    initialValues: {
        ...filters
            .filter(
                filterElement =>
                    filterElement.props.alwaysOn &&
                    filterElement.props.defaultValue
            )
            .reduce(
                (acc, filterElement) => ({
                    ...acc,
                    [filterElement.props.source]:
                        filterElement.props.defaultValue,
                }),
                {}
            ),
        ...initialValues,
    },
});

const enhance = compose(
    withTheme(),
    translate,
    withProps(mergeInitialValuesWithDefaultValues),
    reduxForm({
        form: 'filterForm',
        enableReinitialize: true,
        onChange: (values, dispatch, props) => props.setFilters(values),
    })
);

export default enhance(FilterForm);
