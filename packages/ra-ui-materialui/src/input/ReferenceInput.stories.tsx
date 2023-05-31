import * as React from 'react';
import { Form, testDataProvider } from 'ra-core';
import polyglotI18nProvider from 'ra-i18n-polyglot';
import englishMessages from 'ra-language-english';
import { Stack } from '@mui/material';

import { AdminContext } from '../AdminContext';
import { SelectInput, TextInput } from '../input';
import { ReferenceInput } from './ReferenceInput';

export default { title: 'ra-ui-materialui/input/ReferenceInput' };

const tags = [
    { id: 5, name: 'lorem' },
    { id: 6, name: 'ipsum' },
];

const dataProvider = testDataProvider({
    getList: () =>
        new Promise(resolve => {
            setTimeout(
                () =>
                    resolve({
                        // @ts-ignore
                        data: tags,
                        total: tags.length,
                    }),
                1500
            );
        }),
    // @ts-ignore
    getMany: (resource, params) => {
        return Promise.resolve({
            data: tags.filter(tag => params.ids.includes(tag.id)),
        });
    },
});

const i18nProvider = polyglotI18nProvider(() => englishMessages);

export const Loading = () => (
    <AdminContext dataProvider={dataProvider} i18nProvider={i18nProvider}>
        <Form onSubmit={() => {}} defaultValues={{ tag_ids: [5] }}>
            <Stack sx={{ width: 200 }}>
                <ReferenceInput
                    reference="tags"
                    resource="posts"
                    source="tag_ids"
                >
                    <SelectInput optionText="name" />
                </ReferenceInput>
                <TextInput source="foo" />
            </Stack>
        </Form>
    </AdminContext>
);
