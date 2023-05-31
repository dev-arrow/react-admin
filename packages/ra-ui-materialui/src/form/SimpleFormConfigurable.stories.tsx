import * as React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { PreferencesEditorContextProvider } from 'ra-core';
import { ThemeProvider, createTheme, Box } from '@mui/material';
import { QueryClientProvider, QueryClient } from 'react-query';

import { Inspector, InspectorButton } from '../preferences';
import { NumberInput, TextInput } from '../input';
import { SimpleFormConfigurable } from './SimpleFormConfigurable';

export default { title: 'ra-ui-materialui/forms/SimpleFormConfigurable' };

const data = {
    id: 1,
    title: 'War and Peace',
    author: 'Leo Tolstoy',
    year: 1869,
};

const Wrapper = ({ children }) => (
    <QueryClientProvider client={new QueryClient()}>
        <ThemeProvider theme={createTheme()}>
            <PreferencesEditorContextProvider>
                <MemoryRouter>
                    <Inspector />
                    <Box display="flex" justifyContent="flex-end">
                        <InspectorButton />
                    </Box>
                    <Box p={2}>{children}</Box>
                </MemoryRouter>
            </PreferencesEditorContextProvider>
        </ThemeProvider>
    </QueryClientProvider>
);

export const Basic = () => (
    <Wrapper>
        <SimpleFormConfigurable record={data}>
            <TextInput source="title" fullWidth />
            <TextInput source="author" />
            <NumberInput source="year" />
        </SimpleFormConfigurable>
    </Wrapper>
);
