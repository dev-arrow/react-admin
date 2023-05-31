import * as React from 'react';
import { styled } from '@mui/material/styles';
import { Fragment } from 'react';
import MuiToolbar from '@mui/material/Toolbar';

import {
    SaveButton,
    DeleteButton,
    ToolbarProps,
    useRecordContext,
    useRedirect,
} from 'react-admin';
import AcceptButton from './AcceptButton';
import RejectButton from './RejectButton';

const PREFIX = 'ReviewEditToolbar';

const classes = {
    root: `${PREFIX}-root`,
};

const StyledMuiToolbar = styled(MuiToolbar)(({ theme }) => ({
    [`&.${classes.root}`]: {
        backgroundColor: theme.palette.background.paper,
        display: 'flex',
        justifyContent: 'space-between',
    },
}));

const ReviewEditToolbar = (props: ToolbarProps) => {
    const { basePath, invalid, resource, saving } = props;
    const redirect = useRedirect();

    const record = useRecordContext(props);

    if (!record) return null;
    return (
        <StyledMuiToolbar className={classes.root}>
            {record.status === 'pending' ? (
                <Fragment>
                    <AcceptButton record={record} />
                    <RejectButton record={record} />
                </Fragment>
            ) : (
                <Fragment>
                    <SaveButton
                        invalid={invalid}
                        saving={saving}
                        onSuccess={() => {
                            redirect('list', '/reviews');
                        }}
                        submitOnEnter={true}
                    />
                    <DeleteButton
                        basePath={basePath}
                        record={record}
                        resource={resource}
                    />
                </Fragment>
            )}
        </StyledMuiToolbar>
    );
};

export default ReviewEditToolbar;
