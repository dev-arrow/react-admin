import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';
import { crudGetOneReferenceAndOptions as crudGetOneReferenceAndOptionsAction } from '../../actions/referenceActions';

export class ReferenceInput extends Component {
    componentDidMount() {
        this.props.crudGetOneReferenceAndOptions(this.props.reference, this.props.record[this.props.source]);
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.record.id !== nextProps.record.id) {
            this.props.crudGetOneReferenceAndOptions(nextProps.reference, nextProps.record[nextProps.source]);
        }
    }

    render() {
        const { record, label, source, referenceRecord, referenceSource, allowEmpty, options } = this.props;
        if (!referenceRecord && !allowEmpty) {
            return <TextField floatingLabelText={label} fullWidth />;
        }
        return (
            <SelectField floatingLabelText={label} value={record[source]} onChange={() => {}} fullWidth {...options} >
                <MenuItem value={record[source]} primaryText={referenceRecord[referenceSource]} />
            </SelectField>
        );
    }
}

ReferenceInput.propTypes = {
    source: PropTypes.string.isRequired,
    label: PropTypes.string,
    record: PropTypes.object,
    allowEmpty: PropTypes.bool.isRequired,
    reference: PropTypes.string.isRequired,
    referenceSource: PropTypes.string.isRequired,
    referenceRecord: PropTypes.object,
    options: PropTypes.object,
    crudGetOneReferenceAndOptions: PropTypes.func.isRequired,
};

ReferenceInput.defaultProps = {
    referenceRecord: null,
    record: {},
    allowEmpty: false,
};

function mapStateToProps(state, props) {
    return {
        referenceRecord: state.admin[props.reference].data[props.record[props.source]],
    };
}

export default connect(mapStateToProps, {
    crudGetOneReferenceAndOptions: crudGetOneReferenceAndOptionsAction,
})(ReferenceInput);
