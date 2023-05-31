import React, { Children, cloneElement } from 'react';
import PropTypes from 'prop-types';
import Card from '@material-ui/core/Card';
import { withStyles, createStyles } from '@material-ui/core/styles';
import classnames from 'classnames';
import { CreateController, ComponentPropType } from 'ra-core';

import TitleForRecord from '../layout/TitleForRecord';
import { TitlePropType } from '../layout';

const styles = createStyles({
    root: {},
    main: {
        display: 'flex',
    },
    noActions: {
        marginTop: '1em',
    },
    card: {
        flex: '1 1 auto',
    },
});

const sanitizeRestProps = ({
    actions,
    children,
    className,
    crudCreate,
    isLoading,
    resource,
    title,
    hasCreate,
    hasEdit,
    hasList,
    hasShow,
    match,
    location,
    history,
    options,
    locale,
    permissions,
    translate,
    ...rest
}) => rest;

export const CreateView = withStyles(styles)(
    ({
        actions: Actions,
        aside: Aside,
        basePath,
        children,
        classes,
        className,
        defaultTitle,
        hasList,
        hasShow,
        record = {},
        redirect,
        resource,
        save,
        title,
        ...rest
    }) => (
        <div
            className={classnames('create-page', classes.root, className)}
            {...sanitizeRestProps(rest)}
        >
            <TitleForRecord
                title={title}
                record={record}
                defaultTitle={defaultTitle}
            />
            {Actions &&
                <Actions
                    basePath={basePath}
                    hasList={hasList}
                    resource={resource}
                />
            }
            <div
                className={classnames(classes.main, {
                    [classes.noActions]: !Actions,
                })}
            >
                <Card className={classes.card}>
                    {cloneElement(Children.only(children), {
                        basePath,
                        record,
                        redirect:
                            typeof children.props.redirect === 'undefined'
                                ? redirect
                                : children.props.redirect,
                        resource,
                        save,
                    })}
                </Card>
                {Aside &&
                    <Aside
                        basePath={basePath}
                        record={record}
                        resource={resource}
                        save={save}
                    />
                }
            </div>
        </div>
    )
);

CreateView.propTypes = {
    actions: ComponentPropType,
    aside: ComponentPropType,
    basePath: PropTypes.string,
    children: PropTypes.element,
    classes: PropTypes.object,
    className: PropTypes.string,
    defaultTitle: PropTypes.any,
    hasList: PropTypes.bool,
    hasShow: PropTypes.bool,
    record: PropTypes.object,
    redirect: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    resource: PropTypes.string,
    save: PropTypes.func,
    title: TitlePropType,
};

CreateView.defaultProps = {
    classes: {},
};

/**
 * Page component for the Create view
 *
 * The `<Create>` component renders the page title and actions.
 * It is not responsible for rendering the actual form -
 * that's the job of its child component (usually `<SimpleForm>`),
 * to which it passes pass the `record` as prop.
 *
 * The `<Create>` component accepts the following props:
 *
 * - title
 * - actions
 *
 * Both expect an element for value.
 *
 * @example
 *     // in src/posts.js
 *     import React from 'react';
 *     import { Create, SimpleForm, TextInput } from 'react-admin';
 *
 *     export const PostCreate = (props) => (
 *         <Create {...props}>
 *             <SimpleForm>
 *                 <TextInput source="title" />
 *             </SimpleForm>
 *         </Create>
 *     );
 *
 *     // in src/App.js
 *     import React from 'react';
 *     import { Admin, Resource } from 'react-admin';
 *
 *     import { PostCreate } from './posts';
 *
 *     const App = () => (
 *         <Admin dataProvider={...}>
 *             <Resource name="posts" create={PostCreate} />
 *         </Admin>
 *     );
 *     export default App;
 */
const Create = props => (
    <CreateController {...props}>
        {controllerProps => <CreateView {...props} {...controllerProps} />}
    </CreateController>
);

Create.propTypes = {
    actions: ComponentPropType,
    aside: ComponentPropType,
    children: PropTypes.element,
    classes: PropTypes.object,
    className: PropTypes.string,
    hasCreate: PropTypes.bool,
    hasEdit: PropTypes.bool,
    hasShow: PropTypes.bool,
    resource: PropTypes.string.isRequired,
    title: TitlePropType,
    record: PropTypes.object,
    hasList: PropTypes.bool,
};

export default Create;
