import * as React from 'react';
import { AdminContext } from '../AdminContext';
import fakeRestDataProvider from 'ra-data-fakerest';
import { Resource } from 'ra-core';
import {
    AdminUI,
    Create,
    Datagrid,
    Edit,
    EditButton,
    List,
    PrevNextButton,
    Show,
    ShowButton,
    SimpleForm,
    SimpleShowLayout,
    TextField,
    TextInput,
    TopToolbar,
} from 'react-admin';
import englishMessages from 'ra-language-english';
import polyglotI18nProvider from 'ra-i18n-polyglot';
import { MemoryRouter } from 'react-router';
import { seed, address, internet, name } from 'faker/locale/en_GB';

export default { title: 'ra-ui-materialui/button/PrevNextButton' };

const i18nProvider = polyglotI18nProvider(() => englishMessages, 'en');

seed(123); // we want consistent results
const data = {
    customers: Array.from(Array(900).keys()).map(id => {
        const first_name = name.firstName();
        const last_name = name.lastName();
        const email = internet.email(first_name, last_name);

        return {
            id,
            first_name,
            last_name,
            email,
            city: address.city(),
        };
    }),
};

const dataProvider = fakeRestDataProvider(data);

const MyTopToolbar = ({ children }) => (
    <TopToolbar
        sx={{
            justifyContent: 'space-between',
        }}
    >
        {children}
    </TopToolbar>
);

const defaultFields = [
    <TextField source="id" key="id" />,
    <TextField source="first_name" key="first_name" />,
    <TextField source="last_name" key="last_name" />,
    <TextField source="email" key="email" />,
    <TextField source="city" key="city" />,
];

const defaultInputs = [
    <TextInput source="first_name" key="first_name" />,
    <TextInput source="last_name" key="last_name" />,
    <TextInput source="email" key="email" />,
    <TextInput source="city" key="city" />,
];

const DefaultDataGrid = () => (
    <Datagrid rowClick="edit">{defaultFields}</Datagrid>
);
const DefaultSimpleForm = () => <SimpleForm>{defaultInputs}</SimpleForm>;
const DefaultSimpleShowLayout = () => (
    <SimpleShowLayout>{defaultFields}</SimpleShowLayout>
);

export const Basic = () => (
    <MemoryRouter>
        <AdminContext dataProvider={dataProvider} i18nProvider={i18nProvider}>
            <AdminUI>
                <Resource
                    name="customers"
                    list={
                        <List>
                            <DefaultDataGrid />
                        </List>
                    }
                    edit={
                        <Edit
                            actions={
                                <MyTopToolbar>
                                    <PrevNextButton />
                                    <ShowButton />
                                </MyTopToolbar>
                            }
                        >
                            <DefaultSimpleForm />
                        </Edit>
                    }
                    show={
                        <Show
                            actions={
                                <MyTopToolbar>
                                    <PrevNextButton />
                                    <PrevNextButton linkType="show" />
                                </MyTopToolbar>
                            }
                        >
                            <DefaultSimpleShowLayout />
                        </Show>
                    }
                />
            </AdminUI>
        </AdminContext>
    </MemoryRouter>
);

export const WithStoreKey = () => (
    <MemoryRouter>
        <AdminContext dataProvider={dataProvider} i18nProvider={i18nProvider}>
            <AdminUI>
                <Resource
                    name="customers"
                    list={
                        <List storeKey="withStoreKey">
                            <DefaultDataGrid />
                        </List>
                    }
                    edit={
                        <Edit
                            actions={
                                <MyTopToolbar>
                                    <PrevNextButton storeKey="withStoreKey" />
                                    <ShowButton />
                                </MyTopToolbar>
                            }
                        >
                            <DefaultSimpleForm />
                        </Edit>
                    }
                    show={
                        <Show
                            actions={
                                <MyTopToolbar>
                                    <PrevNextButton
                                        linkType="show"
                                        storeKey="withStoreKey"
                                    />
                                    <EditButton />
                                </MyTopToolbar>
                            }
                        >
                            <DefaultSimpleShowLayout />
                        </Show>
                    }
                />
            </AdminUI>
        </AdminContext>
    </MemoryRouter>
);

export const WithFilter = () => (
    <MemoryRouter>
        <AdminContext dataProvider={dataProvider} i18nProvider={i18nProvider}>
            <AdminUI>
                <Resource
                    name="customers"
                    list={
                        <List
                            filter={{ q: 'East a' }}
                            filters={[
                                <TextInput
                                    label="Search"
                                    source="q"
                                    alwaysOn
                                />,
                            ]}
                            sort={{ field: 'first_name', order: 'DESC' }}
                        >
                            <DefaultDataGrid />
                        </List>
                    }
                    edit={
                        <Edit
                            actions={
                                <MyTopToolbar>
                                    <PrevNextButton
                                        sort={{
                                            field: 'first_name',
                                            order: 'DESC',
                                        }}
                                        filter={{ q: 'East a' }}
                                    />
                                    <ShowButton />
                                </MyTopToolbar>
                            }
                        >
                            <DefaultSimpleForm />
                        </Edit>
                    }
                    show={
                        <Show
                            actions={
                                <MyTopToolbar>
                                    <PrevNextButton
                                        linkType="show"
                                        sort={{
                                            field: 'first_name',
                                            order: 'DESC',
                                        }}
                                        filter={{ q: 'East a' }}
                                    />
                                    <EditButton />
                                </MyTopToolbar>
                            }
                        >
                            <DefaultSimpleShowLayout />
                        </Show>
                    }
                />
            </AdminUI>
        </AdminContext>
    </MemoryRouter>
);

export const WithLimit = () => (
    <MemoryRouter>
        <AdminContext dataProvider={dataProvider} i18nProvider={i18nProvider}>
            <AdminUI>
                <Resource
                    name="customers"
                    list={
                        <List>
                            <DefaultDataGrid />
                        </List>
                    }
                    edit={
                        <Edit
                            actions={
                                <MyTopToolbar>
                                    <PrevNextButton limit={500} />
                                    <ShowButton />
                                </MyTopToolbar>
                            }
                        >
                            <DefaultSimpleForm />
                        </Edit>
                    }
                    show={
                        <Show
                            actions={
                                <MyTopToolbar>
                                    <PrevNextButton
                                        linkType="show"
                                        limit={500}
                                    />
                                    <ShowButton />
                                </MyTopToolbar>
                            }
                        >
                            <DefaultSimpleShowLayout />
                        </Show>
                    }
                />
            </AdminUI>
        </AdminContext>
    </MemoryRouter>
);

export const ShouldNotBeRendered = () => (
    <MemoryRouter>
        <AdminContext dataProvider={dataProvider} i18nProvider={i18nProvider}>
            <Create
                resource="customers"
                actions={
                    <MyTopToolbar>
                        <PrevNextButton />
                    </MyTopToolbar>
                }
            >
                <DefaultSimpleForm />
            </Create>
        </AdminContext>
    </MemoryRouter>
);

export const WithStyle = () => (
    <MemoryRouter>
        <AdminContext dataProvider={dataProvider} i18nProvider={i18nProvider}>
            <AdminUI>
                <Resource
                    name="customers"
                    list={
                        <List>
                            <DefaultDataGrid />
                        </List>
                    }
                    edit={
                        <Edit
                            actions={
                                <MyTopToolbar>
                                    <PrevNextButton
                                        limit={500}
                                        sx={{
                                            color: 'blue',
                                        }}
                                    />
                                    <ShowButton />
                                </MyTopToolbar>
                            }
                        >
                            <DefaultSimpleForm />
                        </Edit>
                    }
                    show={
                        <Show
                            actions={
                                <MyTopToolbar>
                                    <PrevNextButton
                                        linkType="show"
                                        sx={{
                                            '& .RaPrevNextButton-list': {
                                                marginBottom: '20px',
                                            },
                                        }}
                                    />
                                    <ShowButton />
                                </MyTopToolbar>
                            }
                        >
                            <DefaultSimpleShowLayout />
                        </Show>
                    }
                />
            </AdminUI>
        </AdminContext>
    </MemoryRouter>
);
