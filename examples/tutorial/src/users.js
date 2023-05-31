import React from 'react';
import {
    SimpleList,
    List,
    Datagrid,
    EmailField,
    TextField,
    useMediaQuery,
} from 'react-admin';

export const UserList = props => (
    <List title="All users" {...props}>
        {useMediaQuery(theme => theme.breakpoints.down('sm')) ? (
            <SimpleList
                primaryText={record => record.name}
                secondaryText={record => record.username}
                tertiaryText={record => record.email}
            />
        ) : (
            <Datagrid>
                <TextField source="id" />
                <TextField source="name" />
                <TextField source="username" />
                <EmailField source="email" />
            </Datagrid>
        )}
    </List>
);
