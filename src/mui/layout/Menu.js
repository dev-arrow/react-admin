import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import inflection from 'inflection';
import Drawer from 'material-ui/Drawer';
import { List, ListItem } from 'material-ui/List';
import MenuItem from 'material-ui/MenuItem';
import Paper from 'material-ui/Paper';
import { Link } from 'react-router';
import compose from 'recompose/compose';
import translate from '../../i18n/translate';
import { setSidebarVisibility as setSidebarVisibilityAction } from '../../actions';

const styles = {
    sidebarOpen: {
        flex: '0 0 16em',
        marginLeft: 0,
        order: -1,
        transition: 'margin 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms',
    },
    sidebarClosed: {
        flex: '0 0 16em',
        marginLeft: '-16em',
        order: -1,
        transition: 'margin 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms',
    },
    main: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%',
    },
};

const translatedResourceName = (resource, translate) =>
    translate(`resources.${resource.name}.name`, {
        smart_count: 2,
        _: resource.options.label ?
            translate(resource.options.label, { smart_count: 2, _: resource.options.label }) :
            inflection.humanize(inflection.pluralize(resource.name)),
    });

class Menu extends Component {
    handleClose = () => {
        this.props.setSidebarVisibility(false);
    }

    renderUndockedMenu() {
        const { resources, translate, logout, open, setSidebarVisibility } = this.props;
        return (
            <Drawer docked={false} open={open} onRequestChange={setSidebarVisibility}>
                {resources
                    .filter(r => r.list)
                    .map(resource =>
                        <MenuItem
                            key={resource.name}
                            containerElement={<Link to={`/${resource.name}`} />}
                            primaryText={translatedResourceName(resource, translate)}
                            leftIcon={<resource.icon />}
                            onTouchTap={this.handleClose}
                        />,
                    )
                }
                {logout}
            </Drawer>
        );
    }

    renderDockedMenu() {
        const { resources, translate, logout, open } = this.props;
        return (
            <Paper style={open ? styles.sidebarOpen : styles.sidebarClosed}>
                <div style={styles.main}>
                    <List>
                        {resources
                            .filter(r => r.list)
                            .map(resource =>
                                <ListItem
                                    key={resource.name}
                                    containerElement={<Link to={`/${resource.name}`} />}
                                    primaryText={translatedResourceName(resource, translate)}
                                    leftIcon={<resource.icon />}
                                />,
                            )
                        }
                    </List>
                    <List>
                        {logout}
                    </List>
                </div>
            </Paper>
        );
    }

    render() {
        const { width } = this.props;
        return width === 1 ? this.renderUndockedMenu() : this.renderDockedMenu();
    }
}

Menu.propTypes = {
    logout: PropTypes.element,
    resources: PropTypes.array.isRequired,
    setSidebarVisibility: PropTypes.func.isRequired,
    translate: PropTypes.func.isRequired,
    width: PropTypes.number,
};

const enhanced = compose(
    connect(null, {
        setSidebarVisibility: setSidebarVisibilityAction,
    }),
    translate,
);

export default enhanced(Menu);
