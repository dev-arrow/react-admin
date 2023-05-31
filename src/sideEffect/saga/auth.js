import { put, call, takeEvery } from 'redux-saga/effects';
import { push, replace } from 'react-router-redux';

import { showNotification, hideNotification } from '../../actions/notificationActions';
import { USER_LOGIN, USER_LOGIN_FAILURE, USER_CHECK, USER_LOGOUT } from '../../actions/authActions';
import { FETCH_ERROR } from '../../actions/fetchActions';
import { AUTH_LOGIN, AUTH_CHECK, AUTH_ERROR, AUTH_LOGOUT } from '../../auth';

export default (authClient) => {
    function* handleAuth(action) {
        const { type, payload, error, meta } = action;
        switch (type) {
        case USER_LOGIN: {
            try {
                yield put({ type: 'USER_LOGIN_LOADING' });
                yield call(authClient, AUTH_LOGIN, payload);
                yield put({ type: 'USER_LOGIN_SUCCESS' });
                yield put(push(meta.pathName || '/'));
            } catch (e) {
                yield put({ type: 'USER_LOGIN_FAILURE', error: e, meta: { auth: true } });
            }
            break;
        }
        case USER_LOGIN_FAILURE: {
            const errorMessage = typeof error === 'string'
                ? error
                : (typeof error === 'undefined' || !error.message ? 'aor.auth.sign_in_error' : error.message);
            yield put(showNotification(errorMessage, 'warning'));
            break;
        }
        case USER_CHECK: {
            try {
                yield call(authClient, AUTH_CHECK, payload);
            } catch (e) {
                yield call(authClient, AUTH_LOGOUT);
                yield put(replace('/login'));
            }
            break;
        }
        case USER_LOGOUT: {
            yield call(authClient, AUTH_LOGOUT);
            yield put(push('/login'));
            break;
        }
        case FETCH_ERROR:
            try {
                yield call(authClient, AUTH_ERROR, error);
            } catch (e) {
                yield call(authClient, AUTH_LOGOUT);
                yield put(push('/login'));
                yield put(hideNotification());
            }
            break;
        }
    }
    return function* watchAuthActions() {
        yield [
            takeEvery(action => action.meta && action.meta.auth, handleAuth),
            takeEvery(FETCH_ERROR, handleAuth),
        ];
    };
};
