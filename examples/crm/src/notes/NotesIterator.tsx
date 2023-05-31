import * as React from 'react';
import { Box, Divider, Stack } from '@mui/material';
import { useListContext } from 'react-admin';

import { Note } from './Note';
import { NoteCreate } from './NoteCreate';

export const NotesIterator = ({
    showStatus,
    reference,
}: {
    showStatus?: boolean;
    reference: 'contacts' | 'deals';
}) => {
    const { data, error, isPending } = useListContext();
    if (isPending || error) return null;
    return (
        <Box mt={4}>
            <NoteCreate showStatus={showStatus} reference={reference} />
            {data && (
                <Stack mt={4} gap={3}>
                    {data.map((note, index) => (
                        <React.Fragment key={index}>
                            <Divider />
                            <Note
                                note={note}
                                isLast={index === data.length - 1}
                                showStatus={showStatus}
                                key={index}
                            />
                        </React.Fragment>
                    ))}
                </Stack>
            )}
        </Box>
    );
};
