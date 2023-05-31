import * as React from 'react';
import {
    CreateBase,
    Form,
    Identifier,
    RaRecord,
    SaveButton,
    useGetIdentity,
    useListContext,
    useNotify,
    useRecordContext,
    useResourceContext,
    useUpdate,
} from 'react-admin';
import { useFormContext } from 'react-hook-form';

import { Stack } from '@mui/material';
import { NoteInputs } from './NoteInputs';
import { getCurrentDate } from './note';

const foreignKeyMapping = {
    contacts: 'contact_id',
    deals: 'deal_id',
};

export const NoteCreate = ({
    showStatus,
    reference,
}: {
    showStatus?: boolean;
    reference: 'contacts' | 'deals';
}) => {
    const resource = useResourceContext();
    const record = useRecordContext();
    const { identity } = useGetIdentity();

    if (!record || !identity) return null;
    return (
        <CreateBase resource={resource} redirect={false}>
            <Form>
                <NoteInputs showStatus={showStatus} />
                <Stack direction="row" justifyContent={'flex-end'}>
                    <NoteCreateButton reference={reference} record={record} />
                </Stack>
            </Form>
        </CreateBase>
    );
};

const NoteCreateButton = ({
    reference,
    record,
}: {
    reference: 'contacts' | 'deals';
    record: RaRecord<Identifier>;
}) => {
    const [update] = useUpdate();
    const notify = useNotify();
    const { identity } = useGetIdentity();
    const { reset } = useFormContext();
    const { refetch } = useListContext();

    if (!record || !identity) return null;

    const handleSuccess = (data: any) => {
        reset();
        refetch();
        update(reference, {
            id: (record && record.id) as unknown as Identifier,
            data: { last_seen: data.date, status: data.status },
            previousData: record,
        });
        notify('Note added', { type: 'success' });
    };
    return (
        <SaveButton
            type="button"
            label="Add this note"
            icon={<></>}
            variant="contained"
            transform={data => ({
                ...data,
                [foreignKeyMapping[reference]]: record.id,
                sales_id: identity.id,
                date: data.date || getCurrentDate(),
            })}
            mutationOptions={{
                onSuccess: handleSuccess,
            }}
        />
    );
};
