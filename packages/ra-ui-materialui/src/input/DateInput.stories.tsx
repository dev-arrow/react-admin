import * as React from 'react';
import polyglotI18nProvider from 'ra-i18n-polyglot';
import englishMessages from 'ra-language-english';
import { minValue } from 'ra-core';

import { AdminContext } from '../AdminContext';
import { Create } from '../detail';
import { SimpleForm } from '../form';
import { DateInput } from './DateInput';
import { FormInspector } from './common';

export default { title: 'ra-ui-materialui/input/DateInput' };

export const Basic = () => (
    <Wrapper>
        <DateInput source="published" />
    </Wrapper>
);

export const FullWidth = () => (
    <Wrapper>
        <DateInput source="published" fullWidth />
    </Wrapper>
);

export const Disabled = () => (
    <Wrapper>
        <DateInput source="published" disabled />
        <DateInput source="announcement" defaultValue="01/01/2000" disabled />
    </Wrapper>
);

export const ReadOnly = () => (
    <Wrapper>
        <DateInput source="published" readOnly />
        <DateInput source="announcement" defaultValue="01/01/2000" readOnly />
    </Wrapper>
);

export const Validate = () => (
    <Wrapper>
        <DateInput source="published" validate={minValue('2022-10-26')} />
    </Wrapper>
);

const i18nProvider = polyglotI18nProvider(() => englishMessages);

const Wrapper = ({ children, onSuccess = console.log }) => (
    <AdminContext i18nProvider={i18nProvider}>
        <Create resource="posts" mutationOptions={{ onSuccess }}>
            <SimpleForm>
                {children}
                <FormInspector name="published" />
            </SimpleForm>
        </Create>
    </AdminContext>
);
