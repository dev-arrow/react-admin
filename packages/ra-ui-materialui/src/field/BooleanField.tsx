import React, { SFC } from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import pure from 'recompose/pure';
import FalseIcon from '@material-ui/icons/Clear';
import TrueIcon from '@material-ui/icons/Done';
import Typography from '@material-ui/core/Typography';
import { createStyles, withStyles, WithStyles } from '@material-ui/core/styles';
import compose from 'recompose/compose';
import { translate as withTranslate } from 'ra-core';

import { FieldProps } from './types';
import sanitizeRestProps from './sanitizeRestProps';

const styles = createStyles({
    label: {
        // Move the text out of the flow of the container.
        position: 'absolute',

        // Reduce its height and width to just one pixel.
        height: 1,
        width: 1,

        // Hide any overflowing elements or text.
        overflow: 'hidden',

        // Clip the box to zero pixels.
        clip: 'rect(0, 0, 0, 0)',

        // Text won't wrap to a second line.
        whiteSpace: 'nowrap',
    },
});

interface Props extends FieldProps, WithStyles<typeof styles> {
    valueLabelTrue?: string;
    valueLabelFalse?: string;
}

export const BooleanField: SFC<Props> = ({
    className,
    classes,
    source,
    record = {},
    translate,
    valueLabelTrue,
    valueLabelFalse,
    ...rest
}) => {
    const value = get(record, source);
    let ariaLabel = value ? valueLabelTrue : valueLabelFalse;

    if (!ariaLabel) {
        ariaLabel =
            value === false
                ? translate('ra.boolean.false')
                : translate('ra.boolean.true');
    }

    if (value === false) {
        return (
            <Typography
                component="span"
                variant="body1"
                className={className}
                {...sanitizeRestProps(rest)}
            >
                <span className={classes.label}>{ariaLabel}</span>
                <FalseIcon data-testid="false" />
            </Typography>
        );
    }

    if (value === true) {
        return (
            <Typography
                component="span"
                variant="body1"
                className={className}
                {...sanitizeRestProps(rest)}
            >
                <span className={classes.label}>{ariaLabel}</span>
                <TrueIcon data-testid="true" />
            </Typography>
        );
    }

    return (
        <Typography
            component="span"
            variant="body1"
            className={className}
            {...sanitizeRestProps(rest)}
        />
    );
};

const PureBooleanField = compose(
    pure,
    withStyles(styles),
    withTranslate
)(BooleanField);

PureBooleanField.defaultProps = {
    addLabel: true,
};

export default PureBooleanField;
