import * as React from 'react';
import { createContext, ReactNode } from 'react';
import { Record } from '../../types';

/**
 * Context to store a record.
 *
 * @see RecordContextProvider
 * @see useRecordContext
 */
export const RecordContext = createContext<Record | Omit<Record, 'id'>>(
    undefined
);

RecordContext.displayName = 'RecordContext';

/**
 * Provider for the Record Context, to store a record.
 *
 * Use the useRecordContext() hook to read the context.
 * That's what the Edit and Show components do in react-admin.
 *
 * Many react-admin components read the RecordContext, including all Field
 * components.
 *
 * @example
 *
 * import { useGetOne, RecordContextProvider } from 'ra-core';
 *
 * const Show = ({ resource, id }) => {
 *     const { data } = useGetOne(resource, id);
 *     return (
 *         <RecordContextProvider value={data}>
 *             ...
 *         </RecordContextProvider>
 *     );
 * };
 */
export const RecordContextProvider = <
    RecordType extends Record | Omit<Record, 'id'> = Record
>({
    children,
    value,
}: RecordContextProviderProps<RecordType>) => (
    <RecordContext.Provider value={value}>{children}</RecordContext.Provider>
);

export interface RecordContextProviderProps<RecordType> {
    children: ReactNode;
    value?: RecordType;
}
