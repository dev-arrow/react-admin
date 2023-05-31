import * as React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import { CoreAdminContext, required, testDataProvider } from 'ra-core';
import { SimpleForm } from '../form';
import { defaultTheme } from '../defaultTheme';
import { TextInput } from './TextInput';

describe('<TextInput />', () => {
    const defaultProps = {
        source: 'title',
        resource: 'posts',
    };

    it('should render the input correctly', () => {
        render(
            <ThemeProvider theme={createTheme(defaultTheme)}>
                <CoreAdminContext dataProvider={testDataProvider()}>
                    <SimpleForm
                        defaultValues={{ title: 'hello' }}
                        onSubmit={jest.fn}
                    >
                        <TextInput {...defaultProps} />
                    </SimpleForm>
                </CoreAdminContext>
            </ThemeProvider>
        );
        const TextFieldElement = screen.getByLabelText(
            'resources.posts.fields.title'
        ) as HTMLInputElement;
        expect(TextFieldElement.value).toEqual('hello');
        expect(TextFieldElement.getAttribute('type')).toEqual('text');
    });

    it('should use a ResettableTextField when type is password', () => {
        render(
            <ThemeProvider theme={createTheme(defaultTheme)}>
                <CoreAdminContext dataProvider={testDataProvider()}>
                    <SimpleForm
                        defaultValues={{ title: 'hello' }}
                        onSubmit={jest.fn}
                    >
                        <TextInput {...defaultProps} type="password" />
                    </SimpleForm>
                </CoreAdminContext>
            </ThemeProvider>
        );
        const TextFieldElement = screen.getByLabelText(
            'resources.posts.fields.title'
        );
        expect(TextFieldElement.getAttribute('type')).toEqual('password');
    });

    describe('error message', () => {
        it('should not be displayed if field is pristine', () => {
            render(
                <ThemeProvider theme={createTheme(defaultTheme)}>
                    <CoreAdminContext dataProvider={testDataProvider()}>
                        <SimpleForm onSubmit={jest.fn}>
                            <TextInput
                                {...defaultProps}
                                defaultValue=""
                                validate={required()}
                            />
                        </SimpleForm>
                    </CoreAdminContext>
                </ThemeProvider>
            );
            fireEvent.click(screen.getByText('ra.action.save'));
            const error = screen.queryByText('ra.validation.required');
            expect(error).toBeNull();
        });

        it('should not be displayed if field has been touched but is valid', () => {
            render(
                <ThemeProvider theme={createTheme(defaultTheme)}>
                    <CoreAdminContext dataProvider={testDataProvider()}>
                        <SimpleForm onSubmit={jest.fn}>
                            <TextInput
                                {...defaultProps}
                                defaultValue=""
                                validate={required()}
                            />
                        </SimpleForm>
                    </CoreAdminContext>
                </ThemeProvider>
            );

            const input = screen.getByLabelText(
                'resources.posts.fields.title *'
            );
            fireEvent.change(input, { target: { value: 'test' } });
            fireEvent.click(screen.getByText('ra.action.save'));
            const error = screen.queryByText('ra.validation.required');
            expect(error).toBeNull();
        });

        it('should be displayed if field has been touched and is invalid', async () => {
            render(
                <ThemeProvider theme={createTheme(defaultTheme)}>
                    <CoreAdminContext dataProvider={testDataProvider()}>
                        <SimpleForm mode="onBlur" onSubmit={jest.fn}>
                            <TextInput
                                {...defaultProps}
                                defaultValue="foo"
                                validate={required()}
                            />
                        </SimpleForm>
                    </CoreAdminContext>
                </ThemeProvider>
            );

            const input = screen.getByLabelText(
                'resources.posts.fields.title *'
            );
            fireEvent.change(input, { target: { value: '' } });
            fireEvent.blur(input);
            await waitFor(() => {
                expect(
                    screen.queryByText('ra.validation.required')
                ).not.toBeNull();
            });
        });
    });
});
