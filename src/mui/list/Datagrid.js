import React, { PropTypes } from 'react';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';
import FlatButton from 'material-ui/FlatButton';
import ContentSort from 'material-ui/svg-icons/content/sort';

const Datagrid = ({ resource, fields, ids, data, currentSort, basePath, selectable, updateSort }) => (
    <Table multiSelectable={selectable}>
        <TableHeader adjustForCheckbox={selectable} displaySelectAll={selectable}>
            <TableRow>
                {fields.map(field => (
                    <TableHeaderColumn key={field.props.label || 'no-key'}>
                        {(field.props.label || field.props.source) &&
                            <FlatButton
                                labelPosition="before"
                                onClick={updateSort}
                                data-sort={field.props.source}
                                label={field.props.label || field.props.source}
                                icon={field.props.source === currentSort.sort ? <ContentSort style={currentSort.order === 'ASC' ? { transform: 'rotate(180deg)' } : {}} /> : false}
                            />
                        }
                    </TableHeaderColumn>
                ))}
            </TableRow>
        </TableHeader>
        <TableBody showRowHover displayRowCheckbox={selectable}>
            {ids.map(id => (
                <TableRow key={id}>
                    {fields.map(field => (
                        <TableRowColumn key={`${id}-${field.props.source}`}>
                            <field.type {...field.props} record={data[id]} basePath={basePath} resource={resource} />
                        </TableRowColumn>
                    ))}
                </TableRow>
            ))}
        </TableBody>
    </Table>
);

Datagrid.propTypes = {
    fields: PropTypes.array.isRequired,
    ids: PropTypes.arrayOf(PropTypes.number).isRequired,
    resource: PropTypes.string,
    selectable: PropTypes.bool,
    data: PropTypes.object.isRequired,
    currentSort: PropTypes.shape({
        sort: PropTypes.string,
        order: PropTypes.string,
    }),
    basePath: PropTypes.string,
    updateSort: PropTypes.func,
};

Datagrid.defaultProps = {
    selectable: true,
};

export default Datagrid;
