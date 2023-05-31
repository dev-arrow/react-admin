import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import LinearProgress from 'material-ui/LinearProgress';
import { crudGetOneReference as crudGetOneReferenceAction } from '../../actions/referenceActions';

/**
 * @example
 * <ReferenceField label="Post" source="post_id" reference="posts">
 *     <TextField source="title" />
 * </ReferenceField>
 */
export class ReferenceField extends Component {
    componentDidMount() {
        this.props.crudGetOneReference(this.props.reference, this.props.record[this.props.source]);
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.record.id !== nextProps.record.id) {
            this.props.crudGetOneReference(nextProps.reference, nextProps.record[nextProps.source]);
        }
    }

    render() {
        const { record, source, reference, referenceRecord, basePath, allowEmpty, children } = this.props;
        if (React.Children.count(children) != 1) {
            throw new Error('<ReferenceField> only accepts a single child');
        }
        const rootPath = basePath.split('/').slice(0, -1).join('/');
        if (!referenceRecord && !allowEmpty) {
            return <LinearProgress />;
        }
        const props = { ...children.props, record: referenceRecord, resource: reference, allowEmpty, basePath };
        return (<Link to={`${rootPath}/${reference}/${record[source]}`}>
            <children.type {...props} />
        </Link>);
    }
}

ReferenceField.propTypes = {
    source: PropTypes.string.isRequired,
    label: PropTypes.string,
    record: PropTypes.object,
    allowEmpty: PropTypes.bool.isRequired,
    reference: PropTypes.string.isRequired,
    referenceRecord: PropTypes.object,
    basePath: PropTypes.string.isRequired,
    crudGetOneReference: PropTypes.func.isRequired,
};

ReferenceField.defaultProps = {
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
    crudGetOneReference: crudGetOneReferenceAction,
})(ReferenceField);
