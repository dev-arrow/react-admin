import React from 'react';
import {
    List,
    Datagrid,
    TextField,
    DateField,
    ReferenceField,
    NumberField,
    ShowGuesser,
    Filter,
    DateInput,
} from 'react-admin';

import FullNameField from '../visitors/FullNameField';
import AddressField from '../visitors/AddressField';

const ListFilters = props => (
    <Filter {...props}>
        <DateInput source="date_gte" alwaysOn />
        <DateInput source="date_lte" alwaysOn />
    </Filter>
);

const InvoiceList = props => (
    <List {...props} filters={<ListFilters />} perPage={25}>
        <Datagrid expand={<ShowGuesser />}>
            <TextField source="id" />
            <DateField source="date" />
            <ReferenceField source="customer_id" reference="customers">
                <FullNameField />
            </ReferenceField>
            <ReferenceField
                source="customer_id"
                reference="customers"
                linkType={false}
                label="resources.invoices.fields.address"
            >
                <AddressField />
            </ReferenceField>
            <ReferenceField source="command_id" reference="commands">
                <TextField source="id" />
            </ReferenceField>
            <NumberField source="total_ex_taxes" />
            <NumberField source="delivery_fees" />
            <NumberField source="taxes" />
            <NumberField source="total" />
        </Datagrid>
    </List>
);

export default InvoiceList;
