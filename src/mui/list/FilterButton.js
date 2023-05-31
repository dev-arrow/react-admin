import React, { Component, PropTypes } from 'react';
import FlatButton from 'material-ui/FlatButton';
import Popover from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import ContentFilter from 'material-ui/svg-icons/content/filter-list';
import title from '../../util/title';
import Translate from '../../i18n/Translate';

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
        return filters
            .filter(filterElement =>
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

    handleShow(event) {
        const { key, defaultValue } = event.currentTarget.dataset;
        this.props.showFilter(key, defaultValue);
        this.setState({
            open: false,
        });
    }

    render() {
        const hiddenFilters = this.getHiddenFilters();
        const { open, anchorEl } = this.state;

        return (hiddenFilters.length > 0 && <div style={{ display: 'inline-block' }}>
            <FlatButton primary label={this.props.translate('aor.action.add_filter')} icon={<ContentFilter />} onTouchTap={this.handleTouchTap} />
            <Popover
                open={open}
                anchorEl={anchorEl}
                anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
                targetOrigin={{ horizontal: 'left', vertical: 'top' }}
                onRequestClose={this.handleRequestClose}
            >
                <Menu>
                    {hiddenFilters.map(filterElement =>
                        <MenuItem
                            data-key={filterElement.props.source}
                            data-default-value={filterElement.props.defaultValue}
                            key={filterElement.props.source}
                            primaryText={title(filterElement.props.label, filterElement.props.source)}
                            onTouchTap={this.handleShow}
                        />
                    )}
                </Menu>
            </Popover>
        </div>);
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

export default Translate(FilterButton);
