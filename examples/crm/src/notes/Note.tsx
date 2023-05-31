import * as React from 'react';
import { useState, FormEvent, ChangeEvent } from 'react';
import {
    TextField,
    ReferenceField,
    DateField,
    useResourceContext,
    useDelete,
    useUpdate,
    useNotify,
    FileField,
    ResourceContextValue,
} from 'react-admin';
import {
    Box,
    Typography,
    Tooltip,
    IconButton,
    FilledInput,
    Button,
    Stack,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import TrashIcon from '@mui/icons-material/Delete';

import { Status } from '../misc/Status';

export const Note = ({
    showStatus,
    note,
}: {
    showStatus?: boolean;
    note: any;
    isLast: boolean;
}) => {
    const [isHover, setHover] = useState(false);
    const [isEditing, setEditing] = useState(false);
    const [noteText, setNoteText] = useState(note.text);
    const resource = useResourceContext();
    const notify = useNotify();

    const [update, { isPending }] = useUpdate();

    const [deleteNote] = useDelete(
        resource,
        { id: note.id, previousData: note },
        {
            mutationMode: 'undoable',
            onSuccess: () => {
                notify('Note deleted', { type: 'info', undoable: true });
            },
        }
    );

    const handleDelete = () => {
        deleteNote();
    };

    const handleEnterEditMode = () => {
        setEditing(true);
    };

    const handleCancelEdit = () => {
        setEditing(false);
        setNoteText(note.text);
        setHover(false);
    };

    const handleTextChange = (event: ChangeEvent<HTMLInputElement>) => {
        setNoteText(event.target.value);
    };

    const handleNoteUpdate = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        update(
            resource,
            { id: note.id, data: { text: noteText }, previousData: note },
            {
                onSuccess: () => {
                    setEditing(false);
                    setNoteText(note.text);
                    setHover(false);
                },
            }
        );
    };

    return (
        <Box
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
        >
            <Box color="text.secondary">
                <ReferenceField
                    record={note}
                    resource={resource}
                    source="sales_id"
                    reference="sales"
                >
                    <TextField source="first_name" variant="body1" />
                </ReferenceField>{' '}
                <Typography component="span" variant="body1">
                    added a note on{' '}
                </Typography>
                <DateField
                    source="date"
                    record={note}
                    variant="body1"
                    showTime
                    locales="en"
                    options={{
                        dateStyle: 'full',
                        timeStyle: 'short',
                    }}
                />{' '}
                {showStatus && <Status status={note.status} />}
            </Box>
            {isEditing ? (
                <form onSubmit={handleNoteUpdate}>
                    <FilledInput
                        value={noteText}
                        onChange={handleTextChange}
                        fullWidth
                        multiline
                        sx={{
                            paddingTop: '16px',
                            paddingLeft: '14px',
                            paddingRight: '60px',
                            paddingBottom: '14px',
                            lineHeight: 1.3,
                        }}
                        autoFocus
                    />
                    <Box display="flex" justifyContent="flex-end" mt={1}>
                        <Button
                            sx={{ mr: 1 }}
                            onClick={handleCancelEdit}
                            color="primary"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            color="primary"
                            variant="contained"
                            disabled={isPending}
                        >
                            Update Note
                        </Button>
                    </Box>
                </form>
            ) : (
                <Box
                    sx={{
                        bgcolor: '#edf3f0',
                        padding: '0 1em',
                        borderRadius: '10px',
                        display: 'flex',
                        alignItems: 'stretch',
                        marginBottom: 1,
                    }}
                >
                    <Box flex={1}>
                        {note.text
                            .split('\n')
                            .map((paragraph: string, index: number) => (
                                <Box
                                    component="p"
                                    fontFamily="fontFamily"
                                    fontSize="body1.fontSize"
                                    lineHeight={1.3}
                                    marginBottom={2.4}
                                    key={index}
                                >
                                    {paragraph}
                                </Box>
                            ))}
                    </Box>
                    <Box
                        sx={{
                            marginLeft: 2,
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-around',
                            visibility: isHover ? 'visible' : 'hidden',
                        }}
                    >
                        <Tooltip title="Edit note">
                            <IconButton
                                size="small"
                                onClick={handleEnterEditMode}
                            >
                                <EditIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete note">
                            <IconButton size="small" onClick={handleDelete}>
                                <TrashIcon />
                            </IconButton>
                        </Tooltip>
                    </Box>
                </Box>
            )}
            {note.attachment && (
                <NoteAttachmentField
                    note={note}
                    resource={resource}
                    isEditing={isEditing}
                />
            )}
        </Box>
    );
};

const NoteAttachmentField = ({
    note,
    resource,
    isEditing,
}: {
    note: any;
    resource: ResourceContextValue;
    isEditing: boolean;
}) => {
    const [update] = useUpdate();

    if (!note.attachment) {
        return null;
    }

    const handleDeleteAttachment = () => {
        update(resource, {
            id: note.id,
            data: { attachment: null },
            previousData: note,
        });
    };

    if (isImage(note.attachment.rawFile)) {
        return (
            <Stack direction="row" alignItems="center" ml={3}>
                <img
                    src={note.attachment.src}
                    alt={note.attachment.title}
                    style={{
                        width: '200px',
                        height: '100px',
                        objectFit: 'contain',
                        cursor: 'pointer',
                    }}
                    onClick={() => window.open(note.attachment.src, '_blank')}
                />
                {isEditing && (
                    <IconButton
                        aria-label="delete"
                        onClick={() => handleDeleteAttachment()}
                    >
                        <TrashIcon />
                    </IconButton>
                )}
            </Stack>
        );
    }

    return (
        <Stack direction="row" alignItems="center" ml={3}>
            <FileField
                record={note}
                source="attachment.src"
                title="attachment.title"
                target="_blank"
            />
            {isEditing && (
                <IconButton
                    aria-label="delete"
                    onClick={() => handleDeleteAttachment()}
                >
                    <TrashIcon />
                </IconButton>
            )}
        </Stack>
    );
};

const isImage = (file: File) => {
    return file && file.type.startsWith('image/');
};
