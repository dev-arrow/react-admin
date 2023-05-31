import * as React from 'react';
import { BaseSyntheticEvent, ReactNode } from 'react';
import { FormProvider, FieldValues, UseFormProps } from 'react-hook-form';

import { FormGroupsProvider } from './FormGroupsProvider';
import { RaRecord } from '../types';
import { useRecordContext, OptionalRecordContextProvider } from '../controller';
import { ValidateForm } from './getSimpleValidationResolver';
import { useAugmentedForm } from './useAugmentedForm';

/**
 * Creates a form element, initialized with the current record, calling the saveContext on submit
 *
 * Wrapper around react-hook-form's useForm, FormContextProvider, and <form>.
 * Also sets up a FormGroupContext, and handles submission validation.
 *
 * @example
 *
 * const MyForm = ({ record, defaultValues, validate }) => (
 *    <Form record={record} defaultValues={defaultValues} validate={validate}>
 *        <Stack>
 *            <TextInput source="title" />
 *            <SaveButton />
 *        </Stack>
 *    </Form>
 * );
 *
 * @typedef {Object} Props the props you can use
 * @prop {Object} defaultValues
 * @prop {Function} validate
 * @prop {Function} save
 *
 * @see useForm
 * @see FormGroupContext
 *
 * @link https://react-hook-form.com/api/useformcontext
 */
export const Form = (props: FormProps) => {
    const { children } = props;
    const record = useRecordContext(props);
    const { form, formHandleSubmit } = useAugmentedForm(props);

    return (
        <OptionalRecordContextProvider value={record}>
            <FormProvider {...form}>
                <FormGroupsProvider>
                    <form onSubmit={formHandleSubmit}>{children}</form>
                </FormGroupsProvider>
            </FormProvider>
        </OptionalRecordContextProvider>
    );
};

export type FormProps = FormOwnProps &
    Omit<UseFormProps, 'onSubmit'> & {
        validate?: ValidateForm;
    };

export type FormRenderProps = {
    handleSubmit: (e?: BaseSyntheticEvent) => void;
    saving?: boolean;
};

export type FormRender = (
    props: FormRenderProps
) => React.ReactElement<any, any>;

export interface FormOwnProps {
    children: ReactNode;
    defaultValues?: any;
    formRootPathname?: string;
    record?: Partial<RaRecord>;
    onSubmit?: (data: FieldValues) => any | Promise<any>;
    saving?: boolean;
    warnWhenUnsavedChanges?: boolean;
}
