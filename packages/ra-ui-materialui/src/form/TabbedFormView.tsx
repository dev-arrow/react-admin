import * as React from 'react';
import {
    ChangeEvent,
    Children,
    cloneElement,
    isValidElement,
    ReactElement,
    ReactNode,
    useState,
} from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { matchPath, useLocation } from 'react-router-dom';
import { Divider } from '@mui/material';
import { styled } from '@mui/material/styles';
import {
    FormWithRedirectRenderProps,
    MutationMode,
    Record,
    useResourceContext,
} from 'ra-core';
import { Toolbar } from './Toolbar';
import { TabbedFormTabs, getTabbedFormTabFullPath } from './TabbedFormTabs';

export const TabbedFormView = (props: TabbedFormViewProps): ReactElement => {
    const {
        basePath,
        children,
        className,
        formRootPathname,
        handleSubmit,
        handleSubmitWithRedirect,
        invalid,
        mutationMode,
        pristine,
        record,
        redirect: defaultRedirect,
        rootPath: rootPathFromProps,
        saving,
        submitOnEnter = true,
        syncWithLocation = true,
        tabs = DefaultTabs,
        toolbar = DefaultToolbar,
        variant,
        margin,
        validating,
        ...rest
    } = props;
    const location = useLocation();
    const resource = useResourceContext(props);
    const rootPath = rootPathFromProps ?? getRootPath(location.pathname);
    const [tabValue, setTabValue] = useState(0);

    const handleTabChange = (event: ChangeEvent<{}>, value: any): void => {
        if (!syncWithLocation) {
            setTabValue(value);
        }
    };

    return (
        <Root
            className={classnames('tabbed-form', className)}
            {...sanitizeRestProps(rest)}
        >
            {cloneElement(
                tabs,
                {
                    classes: TabbedFormClasses,
                    onChange: handleTabChange,
                    syncWithLocation,
                    url: rootPath,
                    value: tabValue,
                },
                children
            )}
            <Divider />
            <div className={TabbedFormClasses.content}>
                {/* All tabs are rendered (not only the one in focus), to allow validation
                on tabs not in focus. The tabs receive a `hidden` property, which they'll
                use to hide the tab using CSS if it's not the one in focus.
                See https://github.com/marmelab/react-admin/issues/1866 */}
                {Children.map(children, (tab: ReactElement, index) => {
                    if (!tab) {
                        return;
                    }
                    const tabPath = getTabbedFormTabFullPath(
                        tab,
                        index,
                        rootPath
                    );
                    const hidden = syncWithLocation
                        ? !matchPath(tabPath, location.pathname)
                        : tabValue !== index;

                    return isValidElement<any>(tab)
                        ? React.cloneElement(tab, {
                              intent: 'content',
                              classes: TabbedFormClasses,
                              resource,
                              record,
                              basePath,
                              hidden,
                              variant: tab.props.variant || variant,
                              margin: tab.props.margin || margin,
                              value: syncWithLocation ? tabPath : index,
                          })
                        : null;
                })}
            </div>
            {toolbar &&
                React.cloneElement(toolbar, {
                    basePath,
                    className: 'toolbar',
                    handleSubmitWithRedirect,
                    handleSubmit,
                    invalid,
                    mutationMode,
                    pristine,
                    record,
                    redirect: defaultRedirect,
                    resource,
                    saving,
                    submitOnEnter,
                    validating,
                })}
        </Root>
    );
};

TabbedFormView.propTypes = {
    basePath: PropTypes.string,
    children: PropTypes.node,
    className: PropTypes.string,
    defaultValue: PropTypes.oneOfType([PropTypes.object, PropTypes.func]), // @deprecated
    handleSubmit: PropTypes.func, // passed by react-final-form
    initialValues: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
    invalid: PropTypes.bool,
    location: PropTypes.object,
    match: PropTypes.object,
    mutationMode: PropTypes.oneOf(['pessimistic', 'optimistic', 'undoable']),
    pristine: PropTypes.bool,
    // @ts-ignore
    record: PropTypes.object,
    redirect: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.bool,
        PropTypes.func,
    ]),
    resource: PropTypes.string,
    save: PropTypes.func, // the handler defined in the parent, which triggers the REST submission
    saving: PropTypes.bool,
    submitOnEnter: PropTypes.bool,
    tabs: PropTypes.element,
    toolbar: PropTypes.element,
    translate: PropTypes.func,
    validate: PropTypes.func,
    value: PropTypes.number,
    version: PropTypes.number,
};

const DefaultTabs = <TabbedFormTabs />;
const DefaultToolbar = <Toolbar />;

export interface TabbedFormViewProps extends FormWithRedirectRenderProps {
    basePath?: string;
    children?: ReactNode;
    className?: string;
    margin?: 'none' | 'normal' | 'dense';
    mutationMode?: MutationMode;
    record?: Record;
    resource?: string;
    rootPath?: string;
    syncWithLocation?: boolean;
    tabs?: ReactElement;
    toolbar?: ReactElement;
    variant?: 'standard' | 'outlined' | 'filled';
    submitOnEnter?: boolean;
    __versions?: any; // react-final-form internal prop, missing in their type
}

const sanitizeRestProps = ({
    active,
    dirty,
    dirtyFields,
    dirtyFieldsSinceLastSubmit,
    dirtySinceLastSubmit,
    error,
    errors,
    form,
    hasSubmitErrors,
    hasValidationErrors,
    initialValues,
    modified = null,
    modifiedSinceLastSubmit,
    save = null,
    submitError,
    submitErrors,
    submitFailed,
    submitSucceeded,
    submitting,
    touched = null,
    valid,
    values,
    visited = null,
    __versions = null,
    ...props
}) => props;

const PREFIX = 'RaTabbedForm';

export const TabbedFormClasses = {
    errorTabButton: `${PREFIX}-errorTabButton`,
    content: `${PREFIX}-content`,
};

const Root = styled('form', { name: PREFIX })(({ theme }) => ({
    [`& .${TabbedFormClasses.errorTabButton}`]: {
        color: theme.palette.error.main,
    },
    [`& .${TabbedFormClasses.content}`]: {
        paddingTop: theme.spacing(1),
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(2),
    },
}));

const getRootPath = (path: string) => {
    const createMatch = matchPath(':resource/create/*', path);
    const editMatch = matchPath(':resource/:id/*', path);

    if (createMatch) {
        return createMatch.pathnameBase;
    }

    if (editMatch) {
        return editMatch.pathnameBase;
    }

    return null;
};
