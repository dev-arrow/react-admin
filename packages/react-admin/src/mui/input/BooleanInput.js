import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Switch from 'material-ui/Switch';

import addField from '../form/addField';
import FieldTitle from '../../util/FieldTitle';

const styles = {
    block: {
        margin: '1rem 0',
        maxWidth: 250,
    },
    label: {
        color: 'rgba(0, 0, 0, 0.298039)',
    },
    toggle: {
        marginBottom: 16,
    },
};

export class BooleanInput extends Component {
    handleToggle = (event, value) => {
        this.props.input.onChange(value);
    };

    render() {
        const {
            input,
            isRequired,
            label,
            source,
            elStyle,
            resource,
            options,
        } = this.props;

        return (
            <div style={elStyle || styles.block}>
                <Switch
                    defaultToggled={!!input.value}
                    onToggle={this.handleToggle}
                    labelStyle={styles.label}
                    style={styles.toggle}
                    label={
                        <FieldTitle
                            label={label}
                            source={source}
                            resource={resource}
                            isRequired={isRequired}
                        />
                    }
                    {...options}
                />
            </div>
        );
    }
}

BooleanInput.propTypes = {
    elStyle: PropTypes.object,
    input: PropTypes.object,
    isRequired: PropTypes.bool,
    label: PropTypes.string,
    resource: PropTypes.string,
    source: PropTypes.string,
    options: PropTypes.object,
};

BooleanInput.defaultProps = {
    options: {},
};

export default addField(BooleanInput);
