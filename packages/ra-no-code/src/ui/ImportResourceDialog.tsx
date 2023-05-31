import React, { FormEvent, useState } from 'react';
import { parse } from 'papaparse';
import {
    Button,
    Dialog,
    DialogProps,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    RootRef,
    TextField,
} from '@material-ui/core';
import { useDropzone } from 'react-dropzone';
import {
    useResourcesConfiguration,
    getFieldDefinitionsFromRecords,
} from '../ResourceConfiguration';
import { Record, useDataProvider, useRefresh } from 'ra-core';
import { useHistory } from 'react-router-dom';

export const ImportResourceDialog = (props: ImportResourceDialogProps) => {
    const dataProvider = useDataProvider();
    const [parsing, setParsing] = useState(false);
    const [file, setFile] = useState<File>();
    const [resource, setResource] = useState<string>();
    const [resources, { addResource }] = useResourcesConfiguration();
    const history = useHistory();
    const refresh = useRefresh();

    const onDrop = (acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            const acceptedFile = acceptedFiles[0];
            if (acceptedFile) {
                setFile(acceptedFile);
                setResource(acceptedFile.name.split('.')[0]);
            }
        }
    };

    const handleClose = () => {
        if (props.onClose) {
            props.onClose();
        }
    };

    const handleSubmit = (event: FormEvent) => {
        event.preventDefault();

        if (resource && file) {
            setParsing(true);
            parse<Record>(file, {
                header: true,
                complete: ({ data }) => {
                    const resourceAlreadyExists = !!resources[resource];

                    data.forEach(record => {
                        if (record.id) {
                            dataProvider.create(resource, { data: record });
                        }
                    });
                    setParsing(false);
                    const fields = getFieldDefinitionsFromRecords(data);
                    addResource({ name: resource, fields });
                    history.push(`/${resource}`);
                    handleClose();

                    if (resourceAlreadyExists) {
                        // If we imported more records for an existing resource,
                        // we must refresh the list
                        refresh();
                    }
                },
            });
        }
    };

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
    });
    const { ref, ...rootProps } = getRootProps();

    return (
        <Dialog
            {...props}
            aria-labelledby="import-resource-dialog-title"
            aria-describedby="import-resource-dialog-description"
        >
            <form onSubmit={handleSubmit}>
                <DialogTitle id="import-resource-dialog-title">
                    Import a new resource
                </DialogTitle>
                {parsing ? (
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            Generating the user interface for the resource,
                            please wait...
                        </DialogContentText>
                    </DialogContent>
                ) : (
                    <>
                        <RootRef rootRef={ref}>
                            <DialogContent {...rootProps}>
                                <input {...getInputProps()} />
                                <DialogContentText id="alert-dialog-description">
                                    Welcome to react-admin no-code!
                                </DialogContentText>
                                <DialogContentText>
                                    Drop a csv file here or click here to choose
                                    a local file.
                                </DialogContentText>
                            </DialogContent>
                        </RootRef>
                        {!!file && (
                            <DialogContent>
                                <TextField
                                    label="Resource name"
                                    value={resource}
                                    onChange={event =>
                                        setResource(event.target.value)
                                    }
                                />
                            </DialogContent>
                        )}
                    </>
                )}
                <DialogActions>
                    {!!file && resource && (
                        <Button disabled={parsing} type="submit">
                            Import
                        </Button>
                    )}
                    <Button disabled={parsing} onClick={() => handleClose()}>
                        Cancel
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export interface ImportResourceDialogProps
    extends Omit<DialogProps, 'onClose'> {
    onClose?: () => void;
}
