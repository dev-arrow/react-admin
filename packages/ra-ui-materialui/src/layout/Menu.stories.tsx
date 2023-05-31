import * as React from 'react';
import { Menu } from './Menu';
import { Resource, testDataProvider } from 'ra-core';
import { defaultTheme, Admin } from 'react-admin';
import { Layout } from '..';
import { AppBar, Typography } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import { Box } from '@mui/material';
import { ToggleThemeButton } from '../button';
import { Title } from './Title';
import { SidebarToggleButton } from './SidebarToggleButton';

export default { title: 'ra-ui-materialui/layout/Menu' };

const resources = ['Posts', 'Comments', 'Tags', 'Users', 'Orders', 'Reviews'];

export const MenuDefault = () => (
    <Admin dataProvider={testDataProvider()} layout={StorybookLayoutDefault}>
        {resources.map(resource => {
            return (
                <Resource
                    name={resource}
                    list={<StorybookList name={resource} />}
                />
            );
        })}
    </Admin>
);
const StorybookLayoutDefault = props => (
    <Layout {...props} menu={StorybookMenuDefault} appBar={StorybookAppBar} />
);
const StorybookMenuDefault = () => {
    return <Menu hasDashboard={true} dense={false} />;
};

export const MenuDense = () => (
    <Admin dataProvider={testDataProvider()} layout={StorybookLayoutDense}>
        {resources.map(resource => {
            return (
                <Resource
                    name={resource}
                    list={<StorybookList name={resource} />}
                />
            );
        })}
    </Admin>
);
const StorybookLayoutDense = props => (
    <Layout {...props} menu={StorybookMenuDense} appBar={StorybookAppBar} />
);
const StorybookMenuDense = () => {
    return <Menu hasDashboard={true} dense={true} />;
};

const StorybookAppBar = props => {
    const darkTheme = createTheme({
        palette: { mode: 'dark' },
    });
    return (
        <AppBar
            {...props}
            elevation={1}
            sx={{ flexDirection: 'row', flexWrap: 'nowrap' }}
        >
            <SidebarToggleButton />
            <Box sx={{ flex: '1 1 100%' }}>
                <Typography variant="h6" id="react-admin-title" />
            </Box>
            <Box sx={{ flex: '0 0 auto' }}>
                <ToggleThemeButton
                    lightTheme={defaultTheme}
                    darkTheme={darkTheme}
                />
            </Box>
        </AppBar>
    );
};

const StorybookList = ({ name }) => (
    <>
        <Title title={name} />
        <Typography variant="h4">{name}</Typography>
    </>
);
