import * as React from 'react';
import { FunctionComponent, ReactElement } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { useFormContext } from 'react-hook-form';
import { CoreAdminContext } from '../core';
import { testDataProvider } from '../dataProvider';
import { FormWithRedirect } from './FormWithRedirect';
import { useInput, InputProps } from './useInput';
import { required } from './validate';

const Input: FunctionComponent<
    {
        children: (props: ReturnType<typeof useInput>) => ReactElement;
    } & InputProps
> = ({ children, ...props }) => {
    const inputProps = useInput(props);
    return children(inputProps);
};

describe('useInput', () => {
    it('returns the props needed for an input', () => {
        let inputProps;
        render(
            <CoreAdminContext dataProvider={testDataProvider()}>
                <FormWithRedirect
                    onSubmit={jest.fn()}
                    render={() => (
                        <Input
                            defaultValue="A title"
                            source="title"
                            resource="posts"
                            validate={required()}
                        >
                            {props => {
                                inputProps = props;
                                return <div />;
                            }}
                        </Input>
                    )}
                />
            </CoreAdminContext>
        );

        expect(inputProps.id).toEqual('title');
        expect(inputProps.isRequired).toEqual(true);
        expect(inputProps.field).toBeDefined();
        expect(inputProps.field.name).toEqual('title');
        expect(inputProps.field.value).toEqual('A title');
        expect(inputProps.fieldState).toBeDefined();
    });

    it('allows to override the input id', () => {
        let inputProps;
        render(
            <CoreAdminContext dataProvider={testDataProvider()}>
                <FormWithRedirect
                    onSubmit={jest.fn()}
                    render={() => (
                        <Input id="my-title" source="title" resource="posts">
                            {props => {
                                inputProps = props;
                                return <div />;
                            }}
                        </Input>
                    )}
                />
            </CoreAdminContext>
        );

        expect(inputProps.id).toEqual('my-title');
        expect(inputProps.field).toBeDefined();
        expect(inputProps.field.name).toEqual('title');
        expect(inputProps.fieldState).toBeDefined();
    });

    it('allows to extend the input event handlers', () => {
        const handleBlur = jest.fn();
        const handleChange = jest.fn();

        render(
            <CoreAdminContext dataProvider={testDataProvider()}>
                <FormWithRedirect
                    onSubmit={jest.fn()}
                    render={() => (
                        <Input
                            source="title"
                            resource="posts"
                            onBlur={handleBlur}
                            onChange={handleChange}
                        >
                            {({ id, field }) => {
                                return (
                                    <input
                                        type="text"
                                        id={id}
                                        aria-label="Title"
                                        {...field}
                                    />
                                );
                            }}
                        </Input>
                    )}
                />
            </CoreAdminContext>
        );
        const input = screen.getByLabelText('Title');

        fireEvent.change(input, {
            target: { value: 'A title' },
        });
        expect(handleChange).toHaveBeenCalled();

        fireEvent.blur(input);
        expect(handleBlur).toHaveBeenCalled();
    });

    it('applies the defaultValue when input does not have a value', () => {
        const onSubmit = jest.fn();
        render(
            <CoreAdminContext dataProvider={testDataProvider()}>
                <FormWithRedirect
                    onSubmit={onSubmit}
                    render={({ handleSubmit }) => (
                        <form onSubmit={handleSubmit}>
                            <Input
                                source="title"
                                resource="posts"
                                defaultValue="foo"
                            >
                                {({ id, field }) => {
                                    return (
                                        <input
                                            type="text"
                                            id={id}
                                            aria-label="Title"
                                            {...field}
                                        />
                                    );
                                }}
                            </Input>
                        </form>
                    )}
                />
            </CoreAdminContext>
        );
        expect(screen.queryByDisplayValue('foo')).not.toBeNull();
    });

    it('does not apply the defaultValue when input has a value of 0', () => {
        const { queryByDisplayValue } = render(
            <CoreAdminContext dataProvider={testDataProvider()}>
                <FormWithRedirect
                    onSubmit={jest.fn()}
                    record={{ id: 1, views: 0 }}
                    render={() => {
                        return (
                            <Input
                                source="views"
                                resource="posts"
                                defaultValue={99}
                            >
                                {({ id, field }) => {
                                    return (
                                        <input
                                            type="number"
                                            id={id}
                                            aria-label="Views"
                                            {...field}
                                        />
                                    );
                                }}
                            </Input>
                        );
                    }}
                />
            </CoreAdminContext>
        );
        expect(queryByDisplayValue('99')).toBeNull();
    });

    it('does not apply the defaultValue when input has a value of 0', () => {
        const { queryByDisplayValue } = render(
            <CoreAdminContext dataProvider={testDataProvider()}>
                <FormWithRedirect
                    onSubmit={jest.fn()}
                    record={{ id: 1, views: 0 }}
                    render={() => {
                        return (
                            <Input
                                source="views"
                                resource="posts"
                                defaultValue={99}
                            >
                                {({ id, field }) => {
                                    return (
                                        <input
                                            type="number"
                                            id={id}
                                            aria-label="Views"
                                            {...field}
                                        />
                                    );
                                }}
                            </Input>
                        );
                    }}
                />
            </CoreAdminContext>
        );
        expect(queryByDisplayValue('99')).toBeNull();
    });

    const BooleanInput = ({
        source,
        defaultValue,
    }: {
        source: string;
        defaultValue?: boolean;
    }) => (
        <Input source={source} defaultValue={defaultValue} resource="posts">
            {() => <BooleanInputValue source={source} />}
        </Input>
    );

    const BooleanInputValue = ({ source }) => {
        const values = useFormContext().getValues();
        return (
            <>
                {typeof values[source] === 'undefined'
                    ? 'undefined'
                    : values[source]
                    ? 'true'
                    : 'false'}
            </>
        );
    };

    it('does not change the value if the field is of type checkbox and has no value', () => {
        const { queryByText } = render(
            <CoreAdminContext dataProvider={testDataProvider()}>
                <FormWithRedirect
                    onSubmit={jest.fn()}
                    record={{ id: 1 }}
                    render={() => <BooleanInput source="is_published" />}
                />
            </CoreAdminContext>
        );
        expect(queryByText('undefined')).not.toBeNull();
    });

    it('applies the defaultValue true when the field is of type checkbox and has no value', () => {
        const { queryByText } = render(
            <CoreAdminContext dataProvider={testDataProvider()}>
                <FormWithRedirect
                    onSubmit={jest.fn()}
                    record={{ id: 1 }}
                    render={() => (
                        <BooleanInput
                            source="is_published"
                            defaultValue={true}
                        />
                    )}
                />
            </CoreAdminContext>
        );
        expect(queryByText('true')).not.toBeNull();
    });

    it('applies the defaultValue false when the field is of type checkbox and has no value', () => {
        const { queryByText } = render(
            <CoreAdminContext dataProvider={testDataProvider()}>
                <FormWithRedirect
                    onSubmit={jest.fn()}
                    record={{ id: 1 }}
                    render={() => (
                        <BooleanInput
                            source="is_published"
                            defaultValue={false}
                        />
                    )}
                />
            </CoreAdminContext>
        );
        expect(queryByText('false')).not.toBeNull();
    });

    it('does not apply the defaultValue true when the field is of type checkbox and has a value', () => {
        const { queryByText } = render(
            <CoreAdminContext dataProvider={testDataProvider()}>
                <FormWithRedirect
                    record={{ id: 1, is_published: false }}
                    onSubmit={jest.fn()}
                    render={() => (
                        <BooleanInput
                            source="is_published"
                            defaultValue={true}
                        />
                    )}
                />
            </CoreAdminContext>
        );
        expect(queryByText('false')).not.toBeNull();
    });

    it('does not apply the defaultValue false when the field is of type checkbox and has a value', () => {
        const { queryByText } = render(
            <CoreAdminContext dataProvider={testDataProvider()}>
                <FormWithRedirect
                    record={{ id: 1, is_published: true }}
                    onSubmit={jest.fn()}
                    render={() => (
                        <BooleanInput
                            source="is_published"
                            defaultValue={false}
                        />
                    )}
                />
            </CoreAdminContext>
        );
        expect(queryByText('true')).not.toBeNull();
    });
});
