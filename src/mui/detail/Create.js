import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Card, CardTitle } from 'material-ui/Card';
import withWidth from 'material-ui/utils/withWidth';
import compose from 'recompose/compose';
import inflection from 'inflection';
import AppBar from '../layout/AppBar';
import Title from '../layout/Title';
import { crudCreate as crudCreateAction } from '../../actions/dataActions';
import DefaultActions from './CreateActions';
import translate from '../../i18n/translate';

class Create extends Component {
    getBasePath() {
        const { location } = this.props;
        return location.pathname.split('/').slice(0, -1).join('/');
    }

    handleSubmit = (record) => this.props.crudCreate(this.props.resource, record, this.getBasePath());

    render() {
        const { actions = <DefaultActions />, children, isLoading, resource, title, translate, width } = this.props;
        const basePath = this.getBasePath();
        const isMobile = width === 1;

        const resourceName = translate(`resources.${resource}.name`, {
            smart_count: 1,
            _: inflection.humanize(inflection.singularize(resource)),
        });
        const defaultTitle = translate('aor.page.create', {
            name: `${resourceName}`,
        });
        const titleElement = <Title title={title} defaultTitle={defaultTitle} />;

        return (
            <div>
                {isMobile && <AppBar title={titleElement} />}
                <Card style={{ opacity: isLoading ? 0.8 : 1 }}>
                    {actions && React.cloneElement(actions, {
                        basePath,
                        resource,
                    })}
                    {!isMobile && <CardTitle title={<Title title={title} defaultTitle={defaultTitle} />} />}
                    {React.cloneElement(children, {
                        onSubmit: this.handleSubmit,
                        resource,
                        basePath,
                        record: {},
                    })}
                </Card>
            </div>
        );
    }
}

Create.propTypes = {
    actions: PropTypes.element,
    children: PropTypes.element,
    crudCreate: PropTypes.func.isRequired,
    isLoading: PropTypes.bool.isRequired,
    location: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    resource: PropTypes.string.isRequired,
    title: PropTypes.any,
    translate: PropTypes.func.isRequired,
    width: PropTypes.number,
};

Create.defaultProps = {
    data: {},
};

function mapStateToProps(state) {
    return {
        isLoading: state.admin.loading > 0,
    };
}

const enhance = compose(
    connect(
        mapStateToProps,
        { crudCreate: crudCreateAction },
    ),
    translate,
    withWidth(),
);

export default enhance(Create);
