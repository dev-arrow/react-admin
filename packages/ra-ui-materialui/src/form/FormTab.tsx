import * as React from 'react';
import { FC, ReactElement, ReactNode } from 'react';
import PropTypes from 'prop-types';
import { FormGroupContextProvider, Record } from 'ra-core';

import FormInput from './FormInput';
import { FormTabHeader } from './FormTabHeader';

const hiddenStyle = { display: 'none' };

const FormTab: FC<FormTabProps> = ({
    basePath,
    className,
    classes,
    contentClassName,
    children,
    hidden,
    icon,
    intent,
    label,
    margin,
    path,
    record,
    resource,
    variant,
    value,
    ...rest
}) => {
    const renderHeader = () => (
        <FormTabHeader
            label={label}
            value={value}
            icon={icon}
            className={className}
            classes={classes}
            {...rest}
        />
    );

    const renderContent = () => (
        <FormGroupContextProvider name={value}>
            <span
                style={hidden ? hiddenStyle : null}
                className={contentClassName}
                id={`tabpanel-${value}`}
                aria-labelledby={`tabheader-${value}`}
            >
                {React.Children.map(
                    children,
                    (input: ReactElement) =>
                        input && (
                            <FormInput
                                basePath={basePath}
                                input={input}
                                record={record}
                                resource={resource}
                                variant={input.props.variant || variant}
                                margin={input.props.margin || margin}
                            />
                        )
                )}
            </span>
        </FormGroupContextProvider>
    );

    return intent === 'header' ? renderHeader() : renderContent();
};

FormTab.propTypes = {
    basePath: PropTypes.string,
    className: PropTypes.string,
    contentClassName: PropTypes.string,
    children: PropTypes.node,
    intent: PropTypes.oneOf(['header', 'content']),
    hidden: PropTypes.bool,
    icon: PropTypes.element,
    label: PropTypes.string.isRequired,
    margin: PropTypes.oneOf(['none', 'dense', 'normal']),
    path: PropTypes.string,
    // @ts-ignore
    record: PropTypes.object,
    resource: PropTypes.string,
    value: PropTypes.string,
    variant: PropTypes.oneOf(['standard', 'outlined', 'filled']),
};

export interface FormTabProps {
    basePath?: string;
    className?: string;
    classes?: object;
    children?: ReactNode;
    contentClassName?: string;
    hidden?: boolean;
    icon?: ReactElement;
    intent?: 'header' | 'content';
    label: string;
    margin?: 'none' | 'normal' | 'dense';
    path?: string;
    record?: Record;
    resource?: string;
    value?: string;
    variant?: 'standard' | 'outlined' | 'filled';
}

FormTab.displayName = 'FormTab';

export default FormTab;
