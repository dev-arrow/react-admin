import { createStore, compose, applyMiddleware } from 'redux';
import { routerMiddleware } from 'connected-react-router';
import createSagaMiddleware from 'redux-saga';
import { all, fork } from 'redux-saga/effects';
import { History } from 'history';

import { AuthProvider, DataProvider, I18nProvider } from './types';
import createAppReducer from './reducer';
import { adminSaga } from './sideEffect';
import { defaultI18nProvider } from './i18n';
import { CLEAR_STATE } from './actions/clearActions';

interface Window {
    __REDUX_DEVTOOLS_EXTENSION__?: () => () => void;
}

export type InitialState = object | (() => object);

interface Params {
    dataProvider: DataProvider;
    history: History;
    authProvider?: AuthProvider;
    customReducers?: any;
    customSagas?: any[];
    i18nProvider?: I18nProvider;
    initialState?: InitialState;
    locale?: string;
}

export default ({
    dataProvider,
    history,
    customReducers = {},
    authProvider = null,
    customSagas = [],
    i18nProvider = defaultI18nProvider,
    initialState,
    locale = 'en',
}: Params) => {
    const messages = i18nProvider(locale);
    const appReducer = createAppReducer(
        customReducers,
        locale,
        messages,
        history
    );

    const resettableAppReducer = (state, action) =>
        appReducer(
            action.type !== CLEAR_STATE
                ? state
                : // Erase data from the store but keep location, notifications, etc.
                  // This allows e.g. to display a notification on logout
                  {
                      ...state,
                      admin: {
                          ...state.admin,
                          resources: {},
                          customQueries: {},
                          references: { oneToMany: {}, possibleValues: {} },
                      },
                  },
            action
        );
    const saga = function* rootSaga() {
        yield all(
            [
                adminSaga(dataProvider, authProvider, i18nProvider),
                ...customSagas,
            ].map(fork)
        );
    };
    const sagaMiddleware = createSagaMiddleware();
    const typedWindow = window as Window;

    const store = createStore(
        resettableAppReducer,
        typeof initialState === 'function' ? initialState() : initialState,
        compose(
            applyMiddleware(sagaMiddleware, routerMiddleware(history)),
            typeof typedWindow !== 'undefined' &&
                typedWindow.__REDUX_DEVTOOLS_EXTENSION__
                ? typedWindow.__REDUX_DEVTOOLS_EXTENSION__()
                : f => f
        )
    );
    sagaMiddleware.run(saga);
    return store;
};
