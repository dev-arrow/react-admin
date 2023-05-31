import * as React from 'react';
import { Card, Box } from '@mui/material';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import {
    useGetList,
    SimpleList,
    useGetIdentity,
    Link,
    ReferenceField,
} from 'react-admin';

import { CompanyAvatar } from '../companies/CompanyAvatar';
import { Deal } from '../types';
import { useCRMContext } from '../CRM/CRMContext';

export const DealsPipeline = () => {
    const { identity } = useGetIdentity();
    const { dealStages } = useCRMContext();
    const { data, total, isPending } = useGetList<Deal>(
        'deals',
        {
            pagination: { page: 1, perPage: 10 },
            sort: { field: 'last_seen', order: 'DESC' },
            filter: { stage_neq: 'lost', sales_id: identity?.id },
        },
        { enabled: Number.isInteger(identity?.id) }
    );

    const getOrderedDeals = (data?: Deal[]): Deal[] | undefined => {
        if (!data) {
            return;
        }
        const deals: Deal[] = [];
        dealStages
            ?.filter(stage => stage.value !== 'won')
            .forEach(stage =>
                data
                    .filter(deal => deal.stage === stage.value)
                    .forEach(deal => deals.push(deal))
            );
        return deals;
    };

    return (
        <>
            <Box display="flex" alignItems="center" marginBottom="1em">
                <Box ml={2} mr={2} display="flex">
                    <MonetizationOnIcon color="disabled" fontSize="large" />
                </Box>
                <Link
                    underline="none"
                    variant="h5"
                    color="textSecondary"
                    to="/deals"
                >
                    Deals Pipeline
                </Link>
            </Box>
            <Card>
                <SimpleList<Deal>
                    resource="deals"
                    linkType="show"
                    data={getOrderedDeals(data)}
                    total={total}
                    isPending={isPending}
                    primaryText={deal => deal.name}
                    secondaryText={deal =>
                        `${deal.amount.toLocaleString('en-US', {
                            notation: 'compact',
                            style: 'currency',
                            currency: 'USD',
                            currencyDisplay: 'narrowSymbol',
                            minimumSignificantDigits: 3,
                            // @ts-ignore
                        })} , ${dealStages.find(stage => stage.value === deal.stage)?.label}}`
                    }
                    leftAvatar={deal => (
                        <ReferenceField
                            source="company_id"
                            record={deal}
                            reference="companies"
                            resource="deals"
                            link={false}
                        >
                            <CompanyAvatar size="small" />
                        </ReferenceField>
                    )}
                />
            </Card>
        </>
    );
};
