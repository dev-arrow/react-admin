import * as React from 'react';
import { render, cleanup } from '@testing-library/react';
import { ListContext } from 'ra-core';

import TextInput from '../input/TextInput';
import Filter from './Filter';

describe('<Filter />', () => {
    afterEach(cleanup);

    describe('With form context', () => {
        const defaultProps = {
            context: 'form',
            resource: 'posts',
            setFilters: jest.fn(),
            hideFilter: jest.fn(),
            showFilter: jest.fn(),
            displayedFilters: { title: true },
        };

        it('should render a <FilterForm /> component', () => {
            const { queryByLabelText } = render(
                <ListContext.Provider value={defaultProps}>
                    <Filter>
                        <TextInput source="title" />
                    </Filter>
                </ListContext.Provider>
            );

            expect(
                queryByLabelText('resources.posts.fields.title')
            ).not.toBeNull();
        });

        it('should pass `filterValues` as `initialValues` props', () => {
            const { getByDisplayValue } = render(
                <ListContext.Provider
                    value={{
                        ...defaultProps,
                        filterValues: { title: 'Lorem' },
                    }}
                >
                    <Filter>
                        <TextInput source="title" />
                    </Filter>
                </ListContext.Provider>
            );

            expect(getByDisplayValue('Lorem')).not.toBeNull();
        });
    });
});
