import React from 'react';
import { SaveButton } from 'ra-ui-materialui';
import NodeActions from './NodeActions';

const NodeFormActions = props => (
    <NodeActions {...props}>
        <SaveButton variant="text" />
    </NodeActions>
);

export default NodeFormActions;
