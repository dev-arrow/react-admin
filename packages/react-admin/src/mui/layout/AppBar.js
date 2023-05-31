import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import MuiAppBar from 'material-ui/AppBar';
import { withTheme } from 'material-ui/styles';
import compose from 'recompose/compose';
import { toggleSidebar as toggleSidebarAction } from '../../actions';

const AppBar = ({ title, toggleSidebar }) => (
    <MuiAppBar title={title} onLeftIconButtonTouchTap={toggleSidebar} />
);

AppBar.propTypes = {
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.element])
        .isRequired,
    toggleSidebar: PropTypes.func.isRequired,
};

const enhance = compose(
    withTheme(), // force redraw on theme change
    connect(null, {
        toggleSidebar: toggleSidebarAction,
    })
);

export default enhance(AppBar);
