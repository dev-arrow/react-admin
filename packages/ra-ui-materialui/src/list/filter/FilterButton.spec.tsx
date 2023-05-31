import * as React from 'react';
import expect from 'expect';
import { render, fireEvent } from '@testing-library/react';
import { ThemeProvider, Theme, StyledEngineProvider } from '@mui/styles';
import { createTheme } from '@mui/material/styles';

import FilterButton from './FilterButton';
import TextInput from '../../input/TextInput';

declare module '@mui/styles/defaultTheme' {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface DefaultTheme extends Theme {}
}

const theme = createTheme();

describe('<FilterButton />', () => {
    const defaultProps = {
        resource: 'post',
        filters: [
            <TextInput source="title" label="Title" />,
            <TextInput source="customer.name" label="Name" />,
        ],
        displayedFilters: {
            title: true,
            'customer.name': true,
        },
        showFilter: () => {},
        filterValues: {},
    };

    describe('filter button', () => {
        it('should not be rendered, if all filters are already being displayed', () => {
            const { queryByText } = render(<FilterButton {...defaultProps} />);
            expect(queryByText('ra.action.add_filter')).toBeNull();
        });
    });

    describe('filter selection menu', () => {
        it('should display only hidden filters', () => {
            const hiddenFilter = (
                <TextInput source="Returned" label="Returned" />
            );
            const { getByLabelText, queryByText } = render(
                <StyledEngineProvider injectFirst>
                    <ThemeProvider theme={theme}>
                        <FilterButton
                            {...defaultProps}
                            filters={defaultProps.filters.concat(hiddenFilter)}
                        />
                    </ThemeProvider>
                </StyledEngineProvider>
            );

            fireEvent.click(getByLabelText('ra.action.add_filter'));

            expect(queryByText('Returned')).not.toBeNull();
            expect(queryByText('Name')).toBeNull();
        });
    });
});
