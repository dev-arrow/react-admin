import { useCallback } from 'react';

import useAuthProvider from './useAuthProvider';
import { AUTH_GET_PERMISSIONS } from './types';

/**
 * Get a callback for calling the authProvider with the AUTH_GET_PERMISSIONS verb.
 *
 * @see useAuthProvider
 *
 * @returns {Function} getPermissions callback
 *
 * This is a low level hook. See those more specialized hooks
 * offering state handling.
 *
 * @see usePermissions
 *
 * @example
 *
 * import { useGetPermissions } from 'react-admin';
 *
 * const Roles = () => {
 *     const [permissions, setPermissions] = useState([]);
 *     const getPermissions = useGetPermissions();
 *     useEffect(() => {
 *         getPermissions().then(permissions => setPermissions(permissions))
 *     }, [])
 *     return (
 *         <ul>
 *             {permissions.map((permission, key) => (
 *                 <li key={key}>{permission}</li>
 *             ))}
 *         </ul>
 *     );
 * }
 */
const useGetPermissions = (): GetPermissions => {
    const authProvider = useAuthProvider();
    const getPermissions = useCallback(
        (params: any = {}) => authProvider(AUTH_GET_PERMISSIONS, params),
        [authProvider]
    );

    return authProvider ? getPermissions : getPermissionsWithoutProvider;
};

const getPermissionsWithoutProvider = () => Promise.resolve([]);

/**
 * Ask the permissions to the  authProvider using the AUTH_GET_PERMISSIONS verb
 *
 * @param {Object} params The parameters to pass to the authProvider
 *
 * @return {Promise} The authProvider response
 */
type GetPermissions = (params?: any) => Promise<any>;

export default useGetPermissions;
