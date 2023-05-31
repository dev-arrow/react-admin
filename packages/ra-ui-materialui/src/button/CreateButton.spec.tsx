import { render, cleanup } from '@testing-library/react';
import * as React from 'react';
import expect from 'expect';
import { TestContext } from 'ra-core';
import { createMuiTheme, ThemeProvider } from '@material-ui/core';
import CreateButton from './CreateButton';

const invalidButtonDomProps = {
    basePath: '',
    handleSubmit: jest.fn(),
    handleSubmitWithRedirect: jest.fn(),
    invalid: false,
    onSave: jest.fn(),
    pristine: false,
    record: { id: 123, foo: 'bar' },
    redirect: 'list',
    resource: 'posts',
    saving: false,
    submitOnEnter: true,
    undoable: false,
};

describe('<CreateButton />', () => {
    afterEach(cleanup);

    it('should render a button with no DOM errors', () => {
        const spy = jest.spyOn(console, 'error').mockImplementation(() => {});

        const theme = createMuiTheme({
            props: {
                MuiWithWidth: {
                    initialWidth: 'sm',
                },
            },
        });

        const { getByLabelText } = render(
            <TestContext>
                <ThemeProvider theme={theme}>
                    <CreateButton {...invalidButtonDomProps} />
                </ThemeProvider>
            </TestContext>
        );

        expect(spy).not.toHaveBeenCalled();
        expect(getByLabelText('ra.action.create').tagName).toEqual('A');

        spy.mockRestore();
    });
});
