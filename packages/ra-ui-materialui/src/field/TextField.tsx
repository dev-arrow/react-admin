import React, { FunctionComponent } from 'react';
import get from 'lodash/get';
import pure from 'recompose/pure';
import Typography, { TypographyProps } from '@material-ui/core/Typography';

import sanitizeRestProps from './sanitizeRestProps';
import { FieldProps, InjectedFieldProps, fieldPropTypes } from './types';

const TextField: FunctionComponent<
    FieldProps & InjectedFieldProps & TypographyProps
> = ({ className, source, record = {}, emptyText, ...rest }) => {
    const value = get(record, source);

    const getValue = () => {
        if (value == null && emptyText) {
            return emptyText;
        }
        return typeof value !== 'string' ? JSON.stringify(value) : value;
    };

    return (
        <Typography
            component="span"
            variant="body2"
            className={className}
            {...sanitizeRestProps(rest)}
        >
            {getValue()}
        </Typography>
    );
};

// wat? TypeScript looses the displayName if we don't set it explicitly
TextField.displayName = 'TextField';

const EnhancedTextField = pure(TextField);

EnhancedTextField.defaultProps = {
    addLabel: true,
};

EnhancedTextField.propTypes = {
    // @ts-ignore
    ...Typography.propTypes,
    ...fieldPropTypes,
};

EnhancedTextField.displayName = 'EnhancedTextField';

export default EnhancedTextField;
