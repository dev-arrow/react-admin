import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DatePicker from 'material-ui/DatePicker';
import FieldTitle from '../../util/FieldTitle';

export const datify = input => {
    if (!input) {
        return null;
    }

    const date = input instanceof Date ? input : new Date(input);
    if (isNaN(date)) {
        throw new Error(`Invalid date: ${input}`);
    }

    return date;
};

class DateInput extends Component {
    onChange = (_, date) => this.props.input.onChange(date);
    onBlur = () => this.props.input.onBlur();

    render() {
        const { input, isRequired, label, meta: { touched, error }, options, source, elStyle, resource } = this.props;

        return (<DatePicker
            {...input}
            errorText={touched && error}
            floatingLabelText={<FieldTitle label={label} source={source} resource={resource} isRequired={isRequired} />}
            DateTimeFormat={Intl.DateTimeFormat}
            container="inline"
            autoOk
            value={datify(input.value)}
            onChange={this.onChange}
            onBlur={this.onBlur}
            style={elStyle}
            {...options}
        />);
    }
}

DateInput.propTypes = {
    addField: PropTypes.bool.isRequired,
    elStyle: PropTypes.object,
    input: PropTypes.object,
    isRequired: PropTypes.bool,
    label: PropTypes.string,
    meta: PropTypes.object,
    options: PropTypes.object,
    resource: PropTypes.string,
    source: PropTypes.string,
};

DateInput.defaultProps = {
    addField: true,
    options: {},
};

export default DateInput;
