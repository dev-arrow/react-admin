import { FieldValues, useFormContext, useWatch } from 'react-hook-form';

// hook taken from https://www.react-hook-form.com/api/usewatch/#rules
export const useFormValues = <
    TFieldValues extends FieldValues = FieldValues
>() => {
    const { getValues } = useFormContext<TFieldValues>();

    return {
        ...useWatch(), // subscribe to form value updates
        ...getValues(), // always merge with latest form values
    };
};
