import * as React from 'react';
import { TextField } from '@mui/material';
import { useTranslate, usePreferenceInput, usePreferenceKey } from 'ra-core';

/**
 * A component which provides a configuration UI to tweak the SimpleList
 *
 * @param {SimpleListEditorProps} props
 * @param props.defaultPrimaryText The SimpleList columns
 * @param {String} props.resource The resource
 * @param {String} props.preferenceKey The key of the columns preferences
 */
export const SimpleListEditor = (props: SimpleListEditorProps) => {
    const {
        defaultPrimaryText = '',
        defaultSecondaryText = '',
        defaultTertiatyText = '',
    } = props;
    const preferenceKey = usePreferenceKey();

    const translate = useTranslate();

    const primaryTextKey = `${preferenceKey}.primaryText`;
    const primaryTextField = usePreferenceInput(
        primaryTextKey,
        defaultPrimaryText
    );
    const secondaryTextKey = `${preferenceKey}.secondaryText`;
    const secondaryTextField = usePreferenceInput(
        secondaryTextKey,
        defaultSecondaryText
    );
    const tertiaryTextKey = `${preferenceKey}.tertiaryText`;
    const tertiaryTextField = usePreferenceInput(
        tertiaryTextKey,
        defaultTertiatyText
    );

    return (
        <form>
            <TextField
                label={translate('ra.configurable.SimpleList.primaryText', {
                    _: 'Primary Text',
                })}
                {...primaryTextField}
                variant="filled"
                size="small"
                fullWidth
                sx={{ mb: 1 }}
            />
            <TextField
                label={translate('ra.configurable.SimpleList.secondaryText', {
                    _: 'Secondary Text',
                })}
                {...secondaryTextField}
                variant="filled"
                size="small"
                fullWidth
                sx={{ mb: 1 }}
            />
            <TextField
                label={translate('ra.configurable.SimpleList.tertiaryText', {
                    _: 'Tertiary Text',
                })}
                {...tertiaryTextField}
                variant="filled"
                size="small"
                fullWidth
                sx={{ mb: 1 }}
            />
        </form>
    );
};

export interface SimpleListEditorProps {
    defaultPrimaryText?: string;
    defaultSecondaryText?: string;
    defaultTertiatyText?: string;
}
