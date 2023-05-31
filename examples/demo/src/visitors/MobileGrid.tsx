// in src/comments.js
import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import { makeStyles } from '@mui/material/styles';
import {
    DateField,
    EditButton,
    useTranslate,
    NumberField,
    Identifier,
} from 'react-admin';

import AvatarField from './AvatarField';
import ColoredNumberField from './ColoredNumberField';
import SegmentsField from './SegmentsField';
import { Customer } from '../types';

const useStyles = makeStyles(theme => ({
    root: { margin: '1em' },
    card: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        margin: '0.5rem 0',
    },
    cardTitleContent: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    cardContent: {
        ...theme.typography.body1,
        display: 'flex',
        flexDirection: 'column',
    },
}));

interface Props {
    ids?: Identifier[];
    data?: { [key: string]: Customer };
    basePath?: string;
}

const MobileGrid = ({ ids, data, basePath }: Props) => {
    const translate = useTranslate();
    const classes = useStyles();

    if (!ids || !data) {
        return null;
    }

    return (
        <div className={classes.root}>
            {ids.map(id => (
                <Card key={id} className={classes.card}>
                    <CardHeader
                        title={
                            <div className={classes.cardTitleContent}>
                                <h2>{`${data[id].first_name} ${data[id].last_name}`}</h2>
                                <EditButton
                                    resource="visitors"
                                    basePath={basePath}
                                    record={data[id]}
                                />
                            </div>
                        }
                        avatar={<AvatarField record={data[id]} size="45" />}
                    />
                    <CardContent className={classes.cardContent}>
                        <div>
                            {translate(
                                'resources.customers.fields.last_seen_gte'
                            )}
                            &nbsp;
                            <DateField record={data[id]} source="last_seen" />
                        </div>
                        <div>
                            {translate(
                                'resources.commands.name',
                                data[id].nb_commands || 1
                            )}
                            &nbsp;:&nbsp;
                            <NumberField
                                record={data[id]}
                                source="nb_commands"
                                label="resources.customers.fields.commands"
                            />
                        </div>
                        <div>
                            {translate(
                                'resources.customers.fields.total_spent'
                            )}
                            &nbsp; :{' '}
                            <ColoredNumberField
                                record={data[id]}
                                source="total_spent"
                                options={{ style: 'currency', currency: 'USD' }}
                            />
                        </div>
                    </CardContent>
                    {data[id].groups && data[id].groups.length > 0 && (
                        <CardContent className={classes.cardContent}>
                            <SegmentsField record={data[id]} />
                        </CardContent>
                    )}
                </Card>
            ))}
        </div>
    );
};

MobileGrid.defaultProps = {
    data: {},
    ids: [],
};

export default MobileGrid;
