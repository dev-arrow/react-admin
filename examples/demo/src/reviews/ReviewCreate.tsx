import * as React from 'react';
import {
    SimpleForm,
    Create,
    ReferenceInput,
    TextInput,
    DateInput,
    AutocompleteInput,
    required,
    useNotify,
    useRedirect,
    getRecordFromLocation,
} from 'react-admin';

import StarRatingInput from './StarRatingInput';
import { useLocation } from 'react-router';

const customerOptionRenderer = (choice: any) =>
    `${choice.first_name} ${choice.last_name}`;

const productOptionRenderer = (choice: any) => `${choice.reference}`;

const ReviewCreate = () => {
    const notify = useNotify();
    const redirect = useRedirect();
    const location = useLocation();

    const onSuccess = (_: any) => {
        const record = getRecordFromLocation(location);
        notify(`Changes saved`);
        if (record && record.product_id) {
            redirect(`/products/${record.product_id}/reviews`);
        } else {
            redirect(`/reviews`);
        }
    };

    return (
        <Create mutationOptions={{ onSuccess }}>
            <SimpleForm>
                <ReferenceInput source="customer_id" reference="customers">
                    <AutocompleteInput
                        optionText={customerOptionRenderer}
                        validate={required()}
                    />
                </ReferenceInput>
                <ReferenceInput source="product_id" reference="products">
                    <AutocompleteInput
                        optionText={productOptionRenderer}
                        validate={required()}
                    />
                </ReferenceInput>
                <DateInput
                    source="date"
                    defaultValue={new Date()}
                    validate={required()}
                />
                <StarRatingInput source="rating" defaultValue={2} />
                <TextInput
                    source="comment"
                    multiline
                    fullWidth
                    resettable
                    validate={required()}
                />
            </SimpleForm>
        </Create>
    );
};

export default ReviewCreate;
