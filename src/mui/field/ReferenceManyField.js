import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import LinearProgress from 'material-ui/LinearProgress';
import { crudGetManyReference as crudGetManyReferenceAction } from '../../actions/dataActions';
import { getReferences } from '../../reducer/references/oneToMany';
import Datagrid from '../list/Datagrid';

const relatedTo = (reference, id, resource, target) => `${resource}_${reference}@${target}_${id}`;

/**
 * @example
 * <ReferenceManyField reference="comments" target="post_id">
 *     <TextField source="id" />
 *     <TextField source="body" />
 *     <DateField source="created_at" />
 *     <EditButton />
 * </ReferenceManyField>
 */
export class ReferenceManyField extends Component {
    componentDidMount() {
        this.props.crudGetManyReference(this.props.reference, this.props.target, this.props.record.id, relatedTo(this.props.reference, this.props.record.id, this.props.resource, this.props.target));
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.record.id !== nextProps.record.id) {
            this.props.crudGetManyReference(nextProps.reference, nextProps.target, nextProps.record.id, relatedTo(nextProps.reference, nextProps.record.id, nextProps.resource, nextProps.target));
        }
    }

    render() {
        const { resource, reference, referenceRecords, children, basePath } = this.props;
        const referenceBasePath = basePath.replace(resource, reference); // FIXME obviously very weak
        return (
            <div style={{ marginTop: '2em' }}>
                {typeof referenceRecords === 'undefined' ?
                    <LinearProgress /> :
                    <Datagrid
                        selectable={false}
                        fields={React.Children.toArray(children)}
                        resource={reference}
                        ids={Object.keys(referenceRecords).map(id => parseInt(id, 10))}
                        data={referenceRecords}
                        basePath={referenceBasePath}
                        currentSort={{}}
                    />
                }
            </div>
        );
    }
}

ReferenceManyField.propTypes = {
    resource: PropTypes.string.isRequired,
    record: PropTypes.object,
    reference: PropTypes.string.isRequired,
    target: PropTypes.string.isRequired,
    referenceRecords: PropTypes.object,
    basePath: PropTypes.string.isRequired,
    crudGetManyReference: PropTypes.func.isRequired,
};

function mapStateToProps(state, props) {
    return {
        referenceRecords: getReferences(state, props.reference, relatedTo(props.reference, props.record.id, props.resource, props.target)),
    };
}

export default connect(mapStateToProps, {
    crudGetManyReference: crudGetManyReferenceAction,
})(ReferenceManyField);
