import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from 'material-ui/Button';
import Popover from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import ContentFilter from 'material-ui-icons/FilterList';
import translate from '../../i18n/translate';
import FilterButtonMenuItem from './FilterButtonMenuItem';

export class FilterButton extends Component {
    constructor(props) {
        super(props);
        this.handleShow = this.handleShow.bind(this);
        this.state = {
            open: false,
        };
        this.handleTouchTap = this.handleTouchTap.bind(this);
        this.handleRequestClose = this.handleRequestClose.bind(this);
        this.handleShow = this.handleShow.bind(this);
    }

    getHiddenFilters() {
        const { filters, displayedFilters, filterValues } = this.props;
        return filters.filter(
            filterElement =>
                !filterElement.props.alwaysOn &&
                !displayedFilters[filterElement.props.source] &&
                !filterValues[filterElement.props.source]
        );
    }

    handleTouchTap(event) {
        // This prevents ghost click.
        event.preventDefault();

        this.setState({
            open: true,
            anchorEl: event.currentTarget,
        });
    }

    handleRequestClose() {
        this.setState({
            open: false,
        });
    }

    handleShow({ source, defaultValue }) {
        this.props.showFilter(source, defaultValue);
        this.setState({
            open: false,
        });
    }

    render() {
        const hiddenFilters = this.getHiddenFilters();
        const { resource } = this.props;
        const { open, anchorEl } = this.state;

        return (
            hiddenFilters.length > 0 && (
                <div style={{ display: 'inline-block' }}>
                    <Button
                        className="add-filter"
                        color="primary"
                        onClick={this.handleTouchTap}
                    >
                        <ContentFilter />
                        &nbsp;
                        {this.props.translate('ra.action.add_filter')}
                    </Button>
                    <Popover
                        open={open}
                        anchorEl={anchorEl}
                        anchorOrigin={{
                            horizontal: 'left',
                            vertical: 'bottom',
                        }}
                        targetOrigin={{ horizontal: 'left', vertical: 'top' }}
                        onRequestClose={this.handleRequestClose}
                    >
                        <Menu>
                            {hiddenFilters.map(filterElement => (
                                <FilterButtonMenuItem
                                    key={filterElement.props.source}
                                    filter={filterElement.props}
                                    resource={resource}
                                    onShow={this.handleShow}
                                />
                            ))}
                        </Menu>
                    </Popover>
                </div>
            )
        );
    }
}

FilterButton.propTypes = {
    resource: PropTypes.string.isRequired,
    filters: PropTypes.arrayOf(PropTypes.node).isRequired,
    displayedFilters: PropTypes.object.isRequired,
    filterValues: PropTypes.object.isRequired,
    showFilter: PropTypes.func.isRequired,
    translate: PropTypes.func.isRequired,
};

export default translate(FilterButton);
