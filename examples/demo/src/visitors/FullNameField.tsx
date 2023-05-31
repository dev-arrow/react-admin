import * as React from 'react';
import { memo } from 'react';
import { makeStyles } from '@mui/material/styles';

import { FieldProps } from 'react-admin';
import AvatarField from './AvatarField';
import { Customer } from '../types';

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        flexWrap: 'nowrap',
        alignItems: 'center',
    },
    avatar: {
        marginRight: theme.spacing(1),
        marginTop: -theme.spacing(0.5),
        marginBottom: -theme.spacing(0.5),
    },
}));

interface Props extends FieldProps<Customer> {
    size?: string;
}

const FullNameField = (props: Props) => {
    const { record, size } = props;
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
