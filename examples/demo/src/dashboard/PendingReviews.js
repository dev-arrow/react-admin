import React from 'react';
import compose from 'recompose/compose';
import Card from 'material-ui/Card';
import List, { ListItem, ListItemText } from 'material-ui/List';
import Avatar from 'material-ui/Avatar';
import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import CommentIcon from '@material-ui/icons/Comment';
import Divider from 'material-ui/Divider';
import { Link } from 'react-router-dom';
import { translate } from 'react-admin';

import CardIcon from './CardIcon';

import StarRatingField from '../reviews/StarRatingField';

const styles = theme => ({
    main: {
        flex: '1',
        marginRight: '1em',
        marginTop: 20,
    },
    titleLink: { textDecoration: 'none', color: 'inherit' },
    card: {
        overflow: 'inherit',
        textAlign: 'right',
        padding: 16,
    },
    value: {
        minHeight: 48,
    },
    avatar: {
        background: theme.palette.background.avatar,
    },
    listItemText: {
        overflowY: 'hidden',
        height: '4em',
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical',
    },
});

const location = {
    pathname: 'reviews',
    query: { filter: JSON.stringify({ status: 'pending' }) },
};

const PendingReviews = ({
    reviews = [],
    customers = {},
    nb,
    translate,
    classes,
}) => (
    <div className={classes.main}>
        <CardIcon Icon={CommentIcon} bgColor="#f44336" />
        <Card className={classes.card}>
            <Typography className={classes.title} color="textSecondary">
                {translate('pos.dashboard.pending_reviews')}
            </Typography>
            <Typography
                variant="headline"
                component="h2"
                className={classes.value}
            >
                <Link to={location} className={classes.titleLink}>
                    {nb}
                </Link>
            </Typography>
            <Divider />
            <List>
                {reviews.map(record => (
                    <ListItem
                        key={record.id}
                        button
                        component={Link}
                        to={`/reviews/${record.id}`}
                    >
                        {customers[record.customer_id] ? (
                            <Avatar
                                src={`${customers[record.customer_id]
                                    .avatar}?size=32x32`}
                                className={classes.avatar}
                            />
                        ) : (
                            <Avatar />
                        )}

                        <ListItemText
                            primary={<StarRatingField record={record} />}
                            secondary={record.comment}
                            className={classes.listItemText}
                            style={{ paddingRight: 0 }}
                        />
                    </ListItem>
                ))}
            </List>
        </Card>
    </div>
);

const enhance = compose(withStyles(styles), translate);

export default enhance(PendingReviews);
