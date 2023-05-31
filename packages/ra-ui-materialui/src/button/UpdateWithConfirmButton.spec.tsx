import * as React from 'react';
import { screen, render, waitFor, fireEvent } from '@testing-library/react';
import expect from 'expect';
import { CoreAdminContext, MutationMode, testDataProvider } from 'ra-core';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import { UpdateWithConfirmButton } from './UpdateWithConfirmButton';
import { Toolbar, SimpleForm } from '../form';
import { Edit } from '../detail';
import { TextInput } from '../input';
import { Notification } from '../layout';

const theme = createTheme();

const invalidButtonDomProps = {
    record: { id: 123, foo: 'bar' },
    redirect: 'list',
    resource: 'posts',
    mutationMode: 'pessimistic' as MutationMode,
};

describe('<UpdateWithConfirmButton />', () => {
    it('should render a button with no DOM errors', () => {
        const spy = jest.spyOn(console, 'error').mockImplementation(() => {});

        render(
            <CoreAdminContext dataProvider={testDataProvider()}>
                <ThemeProvider theme={theme}>
                    <UpdateWithConfirmButton
                        data={{}}
                        {...invalidButtonDomProps}
                    />
                </ThemeProvider>
            </CoreAdminContext>
        );

        expect(spy).not.toHaveBeenCalled();
        expect(
            screen.getByLabelText('ra.action.update').getAttribute('type')
        ).toEqual('button');

        spy.mockRestore();
    });

    const defaultEditProps = {
        id: '123',
        resource: 'posts',
        location: {},
        match: {},
        mutationMode: 'pessimistic' as MutationMode,
    };

    it('should allow to override the resource', async () => {
        const dataProvider = testDataProvider({
            // @ts-ignore
            getOne: () =>
                Promise.resolve({
                    data: { id: 123, title: 'lorem', views: 1000 },
                }),
            update: jest.fn().mockResolvedValueOnce({ data: { id: 123 } }),
        });
        const EditToolbar = props => (
            <Toolbar {...props}>
                <UpdateWithConfirmButton
                    resource="comments"
                    data={{ views: 0 }}
                />
            </Toolbar>
        );
        render(
            <ThemeProvider theme={theme}>
                <CoreAdminContext dataProvider={dataProvider}>
                    <Edit {...defaultEditProps}>
                        <SimpleForm toolbar={<EditToolbar />}>
                            <TextInput source="title" />
                        </SimpleForm>
                    </Edit>
                </CoreAdminContext>
            </ThemeProvider>
        );
        // waitFor for the dataProvider.getOne() return
        await waitFor(() => {
            expect(screen.queryByDisplayValue('lorem')).not.toBeNull();
        });
        fireEvent.click(screen.getByLabelText('ra.action.update'));
        fireEvent.click(screen.getByText('ra.action.confirm'));
        await waitFor(() => {
            expect(dataProvider.update).toHaveBeenCalledWith('comments', {
                id: 123,
                data: { views: 0 },
                previousData: { id: 123, title: 'lorem', views: 1000 },
                meta: undefined,
            });
        });
    });

    it('should allows to undo the deletion after confirmation if mutationMode is undoable', async () => {
        const dataProvider = testDataProvider({
            // @ts-ignore
            getOne: () =>
                Promise.resolve({
                    data: { id: 123, title: 'lorem', views: 1000 },
                }),
            update: jest.fn().mockResolvedValueOnce({ data: { id: 123 } }),
        });
        const EditToolbar = props => (
            <Toolbar {...props}>
                <UpdateWithConfirmButton
                    data={{ views: 0 }}
                    mutationMode="undoable"
                />
            </Toolbar>
        );
        render(
            <ThemeProvider theme={theme}>
                <CoreAdminContext dataProvider={dataProvider}>
                    <>
                        <Edit {...defaultEditProps}>
                            <SimpleForm toolbar={<EditToolbar />}>
                                <TextInput source="title" />
                            </SimpleForm>
                        </Edit>
                        <Notification />
                    </>
                </CoreAdminContext>
            </ThemeProvider>
        );
        // waitFor for the dataProvider.getOne() return
        await waitFor(() => {
            expect(screen.queryByDisplayValue('lorem')).not.toBeNull();
        });
        fireEvent.click(screen.getByLabelText('ra.action.update'));
        fireEvent.click(screen.getByText('ra.action.confirm'));

        await waitFor(() => {
            expect(
                screen.queryByText('ra.notification.updated')
            ).not.toBeNull();
        });
        expect(screen.queryByText('ra.action.undo')).not.toBeNull();
    });

    it('should allow to override the success side effects', async () => {
        const dataProvider = testDataProvider({
            // @ts-ignore
            getOne: () =>
                Promise.resolve({
                    data: { id: 123, title: 'lorem', views: 1000 },
                }),
            update: jest.fn().mockResolvedValueOnce({ data: { id: 123 } }),
        });
        const onSuccess = jest.fn();
        const EditToolbar = props => (
            <Toolbar {...props}>
                <UpdateWithConfirmButton
                    data={{ views: 0 }}
                    mutationOptions={{ onSuccess }}
                />
            </Toolbar>
        );
        render(
            <ThemeProvider theme={theme}>
                <CoreAdminContext dataProvider={dataProvider}>
                    <Edit {...defaultEditProps}>
                        <SimpleForm toolbar={<EditToolbar />}>
                            <TextInput source="title" />
                        </SimpleForm>
                    </Edit>
                </CoreAdminContext>
            </ThemeProvider>
        );
        // waitFor for the dataProvider.getOne() return
        await waitFor(() => {
            expect(screen.queryByDisplayValue('lorem')).not.toBeNull();
        });
        fireEvent.click(screen.getByLabelText('ra.action.update'));
        fireEvent.click(screen.getByText('ra.action.confirm'));
        await waitFor(() => {
            expect(dataProvider.update).toHaveBeenCalled();
            expect(onSuccess).toHaveBeenCalledWith(
                { id: 123 },
                {
                    id: 123,
                    data: { views: 0 },
                    previousData: { id: 123, title: 'lorem', views: 1000 },
                    meta: undefined,
                    resource: 'posts',
                },
                { snapshot: expect.any(Array) }
            );
        });
    });

    it('should allow to override the error side effects', async () => {
        jest.spyOn(console, 'error').mockImplementation(() => {});
        const dataProvider = testDataProvider({
            // @ts-ignore
            getOne: () =>
                Promise.resolve({
                    data: { id: 123, title: 'lorem', views: 1000 },
                }),
            update: jest.fn().mockRejectedValueOnce(new Error('not good')),
        });
        const onError = jest.fn();
        const EditToolbar = props => (
            <Toolbar {...props}>
                <UpdateWithConfirmButton
                    data={{ views: 0 }}
                    mutationOptions={{ onError }}
                />
            </Toolbar>
        );
        render(
            <ThemeProvider theme={theme}>
                <CoreAdminContext dataProvider={dataProvider}>
                    <Edit {...defaultEditProps}>
                        <SimpleForm toolbar={<EditToolbar />}>
                            <TextInput source="title" />
                        </SimpleForm>
                    </Edit>
                </CoreAdminContext>
            </ThemeProvider>
        );
        // waitFor for the dataProvider.getOne() return
        await waitFor(() => {
            expect(screen.queryByDisplayValue('lorem')).toBeDefined();
        });
        fireEvent.click(screen.getByLabelText('ra.action.update'));
        fireEvent.click(screen.getByText('ra.action.confirm'));
        await waitFor(() => {
            expect(dataProvider.update).toHaveBeenCalled();
            expect(onError).toHaveBeenCalledWith(
                new Error('not good'),
                {
                    id: 123,
                    data: { views: 0 },
                    previousData: { id: 123, title: 'lorem', views: 1000 },
                    meta: undefined,
                    resource: 'posts',
                },
                { snapshot: expect.any(Array) }
            );
        });
    });
});
