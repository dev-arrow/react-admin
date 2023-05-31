import 'babel-polyfill';
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, compose, applyMiddleware } from 'redux';
import { Router, Route, Redirect, hashHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import createSagaMiddleware from 'redux-saga';
import reducer from './reducers';
import saga from './sagas';
import FakeRest from './FakeRest';
import fetchMock from 'fetch-mock';
import data from './data';
import CrudRoute from '../src/crud/CrudRoute';
import PostList from './components/posts/PostList';
import PostEdit from './components/posts/PostEdit';
import PostCreate from './components/posts/PostCreate';
import CommentList from './components/comments/CommentList';
import CommentEdit from './components/comments/CommentEdit';
import CommentCreate from './components/comments/CommentCreate';
import Layout from './components/Layout';

window.React = React;

const restServer = new FakeRest.FetchServer('http://localhost:3000');
restServer.init(data);
restServer.toggleLogging(); // logging is off by default, enable it
fetchMock.mock('^http://localhost:3000', restServer.getHandler());

const sagaMiddleware = createSagaMiddleware();
const store = createStore(reducer, undefined, compose(
    applyMiddleware(sagaMiddleware),
    window.devToolsExtension ? window.devToolsExtension() : f => f,
));
sagaMiddleware.run(saga);

const history = syncHistoryWithStore(hashHistory, store);

render(
    <Provider store={store}>
        <Router history={history}>
            <Redirect from="/" to="/posts" />
            <Route path="/" component={Layout}>
                <CrudRoute path="posts" list={PostList} edit={PostEdit} create={PostCreate} />
                <CrudRoute path="comments" list={CommentList} edit={CommentEdit} create={CommentCreate} />
            </Route>
        </Router>
    </Provider>,
    document.getElementById('root')
);
