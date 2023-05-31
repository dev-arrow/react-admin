import * as React from 'react';
import { isValidElement, ReactElement } from 'react';
import PropTypes from 'prop-types';
import { Link, useLocation } from 'react-router-dom';
import MuiTab from '@mui/material/Tab';
import classnames from 'classnames';
import { useTranslate, useFormGroup } from 'ra-core';
import { TabbedFormClasses } from './TabbedFormView';

export const FormTabHeader = ({
    label,
    value,
    icon,
    className,
    syncWithLocation,
    ...rest
}: FormTabHeaderProps): ReactElement => {
    const translate = useTranslate();
    const location = useLocation();
    const formGroup = useFormGroup(value.toString());
    const propsForLink = {
        component: Link,
        to: { ...location, pathname: value },
    };

    return (
        <MuiTab
            label={
                isValidElement(label) ? label : translate(label, { _: label })
            }
            value={value}
            icon={icon}
            className={classnames('form-tab', className, {
                [TabbedFormClasses.errorTabButton]:
                    formGroup.invalid && formGroup.touched,
                error: formGroup.invalid && formGroup.touched,
            })}
            {...(syncWithLocation ? propsForLink : {})} // to avoid TypeScript screams, see https://github.com/mui-org/material-ui/issues/9106#issuecomment-451270521
            id={`tabheader-${value}`}
            aria-controls={`tabpanel-${value}`}
            {...rest}
        />
    );
};

interface FormTabHeaderProps {
    className?: string;
    hidden?: boolean;
    icon?: ReactElement;
    intent?: 'header' | 'content';
    label: string | ReactElement;
    margin?: 'none' | 'normal' | 'dense';
    path?: string;
    resource?: string;
    syncWithLocation?: boolean;
    value?: string | number;
    variant?: 'standard' | 'outlined' | 'filled';
}

FormTabHeader.propTypes = {
    className: PropTypes.string,
    contentClassName: PropTypes.string,
    children: PropTypes.node,
    intent: PropTypes.oneOf(['header', 'content']),
    hidden: PropTypes.bool,
    icon: PropTypes.element,
    label: PropTypes.oneOfType([PropTypes.string, PropTypes.element])
        .isRequired,
    margin: PropTypes.oneOf(['none', 'dense', 'normal']),
    path: PropTypes.string,
    // @ts-ignore
    record: PropTypes.object,
    resource: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    variant: PropTypes.oneOf(['standard', 'outlined', 'filled']),
};
