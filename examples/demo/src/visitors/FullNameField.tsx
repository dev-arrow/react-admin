import React, { FC, memo } from 'react';
import { makeStyles } from '@material-ui/core/styles';

import AvatarField from './AvatarField';
import { FieldProps, Customer } from '../types';

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        flexWrap: 'nowrap',
        alignItems: 'center',
    },
    avatar: {
        marginRight: theme.spacing(1),
    },
}));

interface Props extends FieldProps<Customer> {
    size?: string;
}

const FullNameField: FC<Props> = ({ record, size }) => {
    const classes = useStyles();
    return record ? (
        <div className={classes.root}>
            <AvatarField
                className={classes.avatar}
                record={record}
                size={size}
            />
            {record.first_name} {record.last_name}
        </div>
    ) : null;
};

FullNameField.defaultProps = {
    source: 'last_name',
    label: 'resources.customers.fields.name',
};

export default memo<Props>(FullNameField);
