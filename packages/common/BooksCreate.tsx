import React from 'react';
import {
    Create,
    NumberInput,
    SimpleForm,
    TextInput,
} from '../ra-ui-materialui/src';

export const BooksCreate = () => (
    <Create>
        <SimpleForm>
            <NumberInput source="id" />
            <TextInput source="title" />
            <TextInput source="author" />
            <NumberInput source="year" />
        </SimpleForm>
    </Create>
);
