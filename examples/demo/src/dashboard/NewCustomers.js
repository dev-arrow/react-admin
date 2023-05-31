import React, { useMemo } from 'react';
import Card from '@material-ui/core/Card';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import CustomerIcon from '@material-ui/icons/PersonAdd';
import Divider from '@material-ui/core/Divider';
import { Link } from 'react-router-dom';
import { useTranslate, useQuery, GET_LIST } from 'react-admin';

import CardIcon from './CardIcon';

const styles = theme => ({
    main: {
        flex: '1',
        marginLeft: '1em',
        marginTop: 20,
    },
    card: {
        padding: '16px 0',
        overflow: 'inherit',
        textAlign: 'right',
    },
    title: {
        padding: '0 16px',
    },
    value: {
        padding: '0 16px',
        minHeight: 48,
    },
    avatar: {
        background: theme.palette.background.avatar,
    },
    listItemText: {
        paddingRight: 0,
    },
});

const NewCustomers = ({ classes }) => {
    const translate = useTranslate();
    const aMonthAgo = useMemo(() => {
        const date = new Date();
        date.setDate(date.getDate() - 30);
        return date;
    }, []);

    const { loaded, data: visitors } = useQuery(GET_LIST, 'customers', {
        filter: {
            has_ordered: true,
            first_seen_gte: aMonthAgo.toISOString(),
        },
        sort: { field: 'first_seen', order: 'DESC' },
        pagination: { page: 1, perPage: 100 },
    });

    if (!loaded) return null;

    const nb = visitors.reduce(nb => ++nb, 0);
    return (
        <div className={classes.main}>
            <CardIcon Icon={CustomerIcon} bgColor="#4caf50" />
            <Card className={classes.card}>
                <Typography className={classes.title} color="textSecondary">
                    {translate('pos.dashboard.new_customers')}
                </Typography>
                <Typography
                    variant="headline"
                    component="h2"
                    className={classes.value}
                >
                    {nb}
                </Typography>
                <Divider />
                <List>
                    {visitors.map(record => (
                        <ListItem
                            button
                            to={`/customers/${record.id}`}
                            component={Link}
                            key={record.id}
                        >
                            <Avatar
                                src={`${record.avatar}?size=32x32`}
                                className={classes.avatar}
                            />
                            <ListItemText
                                primary={`${record.first_name} ${
                                    record.last_name
                                }`}
                                className={classes.listItemText}
                            />
                        </ListItem>
                    ))}
                </List>
            </Card>
        </div>
    );
};

export default withStyles(styles)(NewCustomers);
