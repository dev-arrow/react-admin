import { Record } from '../types';
import { useGetMany } from '../dataProvider';

interface Option {
    id: string;
    reference: string;
}

export interface UseReferenceProps {
    loading: boolean;
    loaded: boolean;
    referenceRecord: Record;
}

/**
 * @typedef ReferenceProps
 * @type {Object}
 * @property {boolean} loading: boolean indicating if the reference is loading
 * @property {boolean} loaded: boolean indicating if the reference has loaded
 * @property {Object} referenceRecord: the referenced record.
 */

/**
 * Fetch reference record, and return it when available
 *
 * The reference prop sould be the name of one of the <Resource> components
 * added as <Admin> child.
 *
 * @example
 *
 * const { loading, loaded, referenceRecord } = useReference({
 *     id: 7,
 *     reference: 'users',
 * });
 *
 * @param {Object} option
 * @param {string} option.reference The linked resource name
 * @param {string} option.id The id of the reference
 *
 * @returns {ReferenceProps} The reference record
 */
export const useReference = ({ reference, id }: Option): UseReferenceProps => {
    const { data, loading, loaded } = useGetMany(reference, [id]);
    return { referenceRecord: data[0], loading, loaded };
};

export default useReference;
