import React, { FunctionComponent, memo } from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import FalseIcon from '@material-ui/icons/Clear';
import TrueIcon from '@material-ui/icons/Done';
import { Tooltip, Typography } from '@material-ui/core';
import { TypographyProps } from '@material-ui/core/Typography';
import { useTranslate } from 'ra-core';

import { FieldProps, InjectedFieldProps, fieldPropTypes } from './types';
import sanitizeRestProps from './sanitizeRestProps';

interface Props extends FieldProps {
    valueLabelTrue?: string;
    valueLabelFalse?: string;
}

export const BooleanField: FunctionComponent<
    Props & InjectedFieldProps & TypographyProps
> = ({
    className,
    classes: classesOverride,
    emptyText,
    source,
    record = {},
    valueLabelTrue,
    valueLabelFalse,
    ...rest
}) => {
    const translate = useTranslate();
    const value = get(record, source);
    let ariaLabel = value ? valueLabelTrue : valueLabelFalse;

    if (!ariaLabel) {
        ariaLabel = value === false ? 'ra.boolean.false' : 'ra.boolean.true';
    }

    if (value === false || value === true) {
        return (
            <Typography
                component="span"
                variant="body2"
                className={className}
                {...sanitizeRestProps(rest)}
            >
                <Tooltip title={translate(ariaLabel, { _: ariaLabel })}>
                    {value === true ? (
                        <TrueIcon data-testid="true" />
                    ) : (
                        <FalseIcon data-testid="false" />
                    )}
                </Tooltip>
            </Typography>
        );
    }

    return (
        <Typography
            component="span"
            variant="body2"
            className={className}
            {...sanitizeRestProps(rest)}
        >
            {emptyText}
        </Typography>
    );
};

const EnhancedBooleanField = memo<Props & TypographyProps>(BooleanField);
// @ts-ignore
EnhancedBooleanField.defaultProps = {
    addLabel: true,
};
// @ts-ignore
EnhancedBooleanField.propTypes = {
    // @ts-ignore
    ...Typography.propTypes,
    ...fieldPropTypes,
    valueLabelFalse: PropTypes.string,
    valueLabelTrue: PropTypes.string,
};
EnhancedBooleanField.displayName = 'EnhancedBooleanField';

export default EnhancedBooleanField;
