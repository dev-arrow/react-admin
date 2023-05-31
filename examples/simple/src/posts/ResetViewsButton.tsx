import * as React from 'react';
import PropTypes from 'prop-types';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import {
    useUpdateMany,
    useNotify,
    useUnselectAll,
    Button,
    CRUD_UPDATE_MANY,
} from 'react-admin';
import { useQueryClient } from 'react-query';

const ResetViewsButton = ({ resource, selectedIds }) => {
    const notify = useNotify();
    const queryClient = useQueryClient();
    const unselectAll = useUnselectAll();
    const [updateMany, { loading }] = useUpdateMany(
        resource,
        selectedIds,
        { views: 0 },
        {
            action: CRUD_UPDATE_MANY,
            onSuccess: () => {
                notify('ra.notification.updated', {
                    type: 'info',
                    messageArgs: { smart_count: selectedIds.length },
                });
                unselectAll(resource);
                // FIXME: Remove when useUpdateMany is migrated to react-query
                setTimeout(() => queryClient.refetchQueries(['posts']), 500);
            },
            onFailure: error =>
                notify(
                    typeof error === 'string'
                        ? error
                        : error.message || 'ra.notification.http_error',
                    { type: 'warning' }
                ),
            mutationMode: 'optimistic',
        }
    );

    return (
        <Button
            label="simple.action.resetViews"
            disabled={loading}
            onClick={updateMany}
        >
            <VisibilityOff />
        </Button>
    );
};

ResetViewsButton.propTypes = {
    basePath: PropTypes.string,
    label: PropTypes.string,
    resource: PropTypes.string.isRequired,
    selectedIds: PropTypes.arrayOf(PropTypes.any).isRequired,
};

export default ResetViewsButton;
