import {
    all,
    put,
    call,
    select,
    takeLatest,
    takeEvery,
} from 'redux-saga/effects';
import { push, replace } from 'connected-react-router';

import { AuthProvider } from '../types';
import {
    showNotification,
    hideNotification,
} from '../actions/notificationActions';
import {
    USER_LOGIN,
    USER_LOGIN_LOADING,
    USER_LOGIN_SUCCESS,
    USER_LOGIN_FAILURE,
    USER_CHECK,
    USER_LOGOUT,
} from '../actions/authActions';
import { FETCH_ERROR } from '../actions/fetchActions';
import { AUTH_LOGIN, AUTH_CHECK, AUTH_ERROR, AUTH_LOGOUT } from '../auth';

const nextPathnameSelector = state => {
    const locationState = state.router.location.state;
    return locationState && locationState.nextPathname;
};

const currentPathnameSelector = state => state.router.location;

const getErrorMessage = (error, defaultMessage) =>
    typeof error === 'string'
        ? error
        : typeof error === 'undefined' || !error.message
        ? defaultMessage
        : error.message;

export default (authProvider?: AuthProvider) => {
    if (!authProvider) {
        return () => null;
    }
    return function* watchAuthActions() {
        yield all([
            takeEvery(USER_LOGIN, handleLogin(authProvider)),
            takeEvery(USER_CHECK, handleCheck(authProvider)),
            takeEvery(USER_LOGOUT, handleLogout(authProvider)),
            takeLatest(FETCH_ERROR, handleFetchError(authProvider)),
        ]);
    };
};

export const handleLogin = (authProvider: AuthProvider) =>
    function*(action) {
        const { payload, meta } = action;
        try {
            yield put({ type: USER_LOGIN_LOADING });
            const authPayload = yield call(authProvider, AUTH_LOGIN, payload);
            yield put({
                type: USER_LOGIN_SUCCESS,
                payload: authPayload,
            });
            const redirectTo = yield meta.pathName ||
                select(nextPathnameSelector);
            yield put(push(redirectTo || '/'));
        } catch (e) {
            yield put({
                type: USER_LOGIN_FAILURE,
                error: e,
                meta: { auth: true },
            });
            const errorMessage = getErrorMessage(e, 'ra.auth.sign_in_error');
            yield put(showNotification(errorMessage, 'warning'));
        }
    };

export const handleCheck = (authProvider: AuthProvider) =>
    function*(action) {
        const { payload, meta } = action;
        try {
            yield call(authProvider, AUTH_CHECK, payload);
        } catch (error) {
            yield call(authProvider, AUTH_LOGOUT);
            yield put(
                replace({
                    pathname: (error && error.redirectTo) || '/login',
                    state: { nextPathname: meta.pathName },
                })
            );
            const errorMessage = getErrorMessage(
                error,
                'ra.auth.auth_check_error'
            );
            yield put(showNotification(errorMessage, 'warning'));
        }
    };

export const handleLogout = (authProvider: AuthProvider) =>
    function*(action) {
        const { payload } = action;

        const redirectTo = yield call(authProvider, AUTH_LOGOUT);
        yield put(
            push((payload && payload.redirectTo) || redirectTo || '/login')
        );
    };

export const handleFetchError = (authProvider: AuthProvider) =>
    function*(action) {
        const { error } = action;
        try {
            yield call(authProvider, AUTH_ERROR, error);
        } catch (e) {
            const nextPathname = yield select(currentPathnameSelector);
            const redirectTo = yield call(authProvider, AUTH_LOGOUT);
            yield put(
                push({
                    pathname: redirectTo || '/login',
                    state: { nextPathname },
                })
            );
            yield put(hideNotification());
            yield put(
                showNotification('ra.notification.logged_out', 'warning')
            );
        }
    };
