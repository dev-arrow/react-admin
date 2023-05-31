import * as React from 'react';
import { Link, FieldProps, useRecordContext } from 'react-admin';

import FullNameField from './FullNameField';
import { Customer } from '../types';

const CustomerLinkField = (props: FieldProps<Customer>) => {
    const record = useRecordContext();
    if (!record) {
        return null;
    }
    return (
        <Link to={`/customers/${record.id}`}>
            <FullNameField />
        </Link>
    );
};

CustomerLinkField.defaultProps = {
    source: 'customer_id',
    addLabel: true,
};

export default CustomerLinkField;
