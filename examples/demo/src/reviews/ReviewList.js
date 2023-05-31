import React, { Fragment, Component } from 'react';
import { BulkActions, BulkDeleteAction, List, Responsive } from 'react-admin';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { Route } from 'react-router';
import Drawer from '@material-ui/core/Drawer';

import BulkApproveAction from './BulkApproveAction';
import BulkRejectAction from './BulkRejectAction';
import ReviewListMobile from './ReviewListMobile';
import ReviewListDesktop from './ReviewListDesktop';
import ReviewFilter from './ReviewFilter';
import ReviewEdit from './ReviewEdit';

const ReviewsBulkActions = props => (
    <BulkActions {...props}>
        <BulkApproveAction label="resources.reviews.action.accept" />
        <BulkRejectAction label="resources.reviews.action.reject" />
        <BulkDeleteAction />
    </BulkActions>
);

class ReviewList extends Component {
    render() {
        const props = this.props;
        return (
            <Fragment>
                <List
                    {...props}
                    bulkActions={<ReviewsBulkActions />}
                    filters={<ReviewFilter />}
                    perPage={25}
                    sort={{ field: 'date', order: 'DESC' }}
                >
                    <Responsive
                        xsmall={<ReviewListMobile />}
                        medium={<ReviewListDesktop />}
                    />
                </List>
                <Route path="/reviews/:id">
                    {({ match }) => {
                        const isMatch =
                            match &&
                            match.params &&
                            match.params.id !== 'create';
                        return (
                            <Drawer
                                variant="persistent"
                                open={isMatch}
                                anchor="right"
                                onClose={this.handleClose}
                            >
                                {/* To avoid any errors if the route does not match, we don't render at all the component in this case */}
                                {isMatch ? (
                                    <ReviewEdit
                                        id={match.params.id}
                                        onCancel={this.handleClose}
                                        {...props}
                                    />
                                ) : null}
                            </Drawer>
                        );
                    }}
                </Route>
            </Fragment>
        );
    }

    handleClose = () => {
        this.props.push('/reviews');
    };
}

export default connect(
    undefined,
    { push }
)(ReviewList);
