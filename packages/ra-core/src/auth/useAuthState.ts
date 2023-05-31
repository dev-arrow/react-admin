import { useEffect } from 'react';

import { useCheckAuth } from './useCheckAuth';
import { useSafeSetState } from '../util/hooks';

interface State {
    isLoading: boolean;
    authenticated?: boolean;
}

const emptyParams = {};

/**
 * Hook for getting the authentication status
 *
 * Calls the authProvider.checkAuth() method asynchronously.
 *
 * The return value updates according to the authProvider request state:
 *
 * - isLoading: true just after mount, while the authProvider is being called. false once the authProvider has answered.
 * - authenticated: true while loading. then true or false depending on the authProvider response.
 *
 * To avoid rendering a component and force waiting for the authProvider response, use the useAuthState() hook
 * instead of the useAuthenticated() hook.
 *
 * You can render different content depending on the authenticated status.
 *
 * @see useAuthenticated()
 *
 * @param {Object} params Any params you want to pass to the authProvider
 *
 * @param {Boolean} logoutOnFailure: Optional. Whether the user should be logged out if the authProvider fails to authenticate them. False by default.
 *
 * @returns The current auth check state. Destructure as { authenticated, error, isLoading }.
 *
 * @example
 * import { useAuthState, Loading } from 'react-admin';
 *
 * const MyPage = () => {
 *     const { isLoading, authenticated } = useAuthState();
 *     if (isLoading) {
 *         return <Loading />;
 *     }
 *     if (authenticated) {
 *        return <AuthenticatedContent />;
 *     }
 *     return <AnonymousContent />;
 * };
 */
const useAuthState = (
    params: any = emptyParams,
    logoutOnFailure: boolean = false
): State => {
    const [state, setState] = useSafeSetState({
        isLoading: true,
        authenticated: true, // optimistic
    });
    const checkAuth = useCheckAuth();
    useEffect(() => {
        checkAuth(params, logoutOnFailure)
            .then(() => setState({ isLoading: false, authenticated: true }))
            .catch(() => setState({ isLoading: false, authenticated: false }));
    }, [checkAuth, params, logoutOnFailure, setState]);
    return state;
};

export default useAuthState;
