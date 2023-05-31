import {
    FunctionComponent,
    cloneElement,
    Children,
    useEffect,
    useState,
    memo,
    useCallback,
} from 'react';
import get from 'lodash/get';
import { Identifier } from 'ra-core';

import { FieldProps, InjectedFieldProps, fieldPropTypes } from './types';

interface State {
    data: object;
    ids: Identifier[];
}

const initialState = {
    data: {},
    ids: [],
};

const getDataAndIds = (record: object, source: string, fieldKey: string) => {
    const list = get(record, source);
    if (!list) {
        return initialState;
    }
    return fieldKey
        ? {
              data: list.reduce((prev, item) => {
                  prev[item[fieldKey]] = item;
                  return prev;
              }, {}),
              ids: list.map(item => item[fieldKey]),
          }
        : {
              data: list.reduce((prev, item) => {
                  prev[JSON.stringify(item)] = item;
                  return prev;
              }, {}),
              ids: list.map(JSON.stringify),
          };
};

/**
 * Display a collection
 *
 * Ideal for embedded arrays of objects, e.g.
 * {
 *   id: 123
 *   tags: [
 *     { name: 'foo' },
 *     { name: 'bar' }
 *   ]
 * }
 *
 * The child must be an iterator component
 * (like <Datagrid> or <SingleFieldList>).
 *
 * @example Display all the backlinks of the current post as a <Datagrid>
 * // post = {
 * //   id: 123
 * //   backlinks: [
 * //       {
 * //           uuid: '34fdf393-f449-4b04-a423-38ad02ae159e',
 * //           date: '2012-08-10T00:00:00.000Z',
 * //           url: 'http://example.com/foo/bar.html',
 * //       },
 * //       {
 * //           uuid: 'd907743a-253d-4ec1-8329-404d4c5e6cf1',
 * //           date: '2012-08-14T00:00:00.000Z',
 * //           url: 'https://blog.johndoe.com/2012/08/12/foobar.html',
 * //       }
 * //    ]
 * // }
 *     <ArrayField source="backlinks">
 *         <Datagrid>
 *             <DateField source="date" />
 *             <UrlField source="url" />
 *         </Datagrid>
 *     </ArrayField>
 *
 * @example Display all the tags of the current post as <Chip> components
 * // post = {
 * //   id: 123
 * //   tags: [
 * //     { name: 'foo' },
 * //     { name: 'bar' }
 * //   ]
 * // }
 *     <ArrayField source="tags">
 *         <SingleFieldList>
 *             <ChipField source="name" />
 *         </SingleFieldList>
 *     </ArrayField>
 *
 * If the array value contains a lot of items, you may experience slowdowns in the UI.
 * In such cases, set the `fieldKey` prop to use one field as key, and reduce CPU and memory usage:
 *
 * @example
 *     <ArrayField source="backlinks" fieldKey="uuid">
 *         ...
 *     </ArrayField>
 *
 * If you need to render a collection in a custom way, it's often simpler
 * to write your own component:
 *
 * @example
 *     const TagsField = ({ record }) => (
 *          <ul>
 *              {record.tags.map(item => (
 *                  <li key={item.name}>{item.name}</li>
 *              ))}
 *          </ul>
 *     )
 *     TagsField.defaultProps = { addLabel: true };
 */
export const ArrayField: FunctionComponent<
    FieldProps & InjectedFieldProps & State
> = ({
    addLabel,
    basePath,
    children,
    record,
    sortable,
    source,
    fieldKey,
    ...rest
}) => {
    const { ids: initialIds, data: initialData } = record
        ? getDataAndIds(record, source, fieldKey)
        : initialState;
    const [ids, setIds] = useState(initialIds);
    const [data, setData] = useState(initialData);

    useEffect(() => {
        const { ids, data } = getDataAndIds(record, source, fieldKey);
        setIds(ids);
        setData(data);
    }, [record, source, fieldKey]);

    // @ts-ignore
    return cloneElement(Children.only(children), {
        ids,
        data,
        loading: false,
        basePath,
        currentSort: {},
        ...rest,
    });
};

const EnhancedArrayField = memo<FieldProps>(ArrayField);
// @ts-ignore
EnhancedArrayField.defaultProps = {
    addLabel: true,
};

EnhancedArrayField.propTypes = fieldPropTypes;
EnhancedArrayField.displayName = 'EnhancedArrayField';

export default EnhancedArrayField;
