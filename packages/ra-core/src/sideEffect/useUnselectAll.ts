import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { setListSelectedIds } from '../actions';

/**
 * Hook for Unselect All Side Effect
 *
 * @example
 *
 * const unselectAll = useUnselectAll('posts');
 * unselectAll();
 */
const useUnselectAll = (resource1?: string) => {
    const dispatch = useDispatch();
    return useCallback(
        (resource2?: string) => {
            if (!resource2 && !resource1) {
                console.log(
                    "You didn't specify the resource at initialization (useUnselectAll('posts')) nor when using the callback (unselectAll('posts'))"
                );
            }
            dispatch(setListSelectedIds(resource2 || resource1, []));
        },
        [dispatch, resource1]
    );
};

export default useUnselectAll;
