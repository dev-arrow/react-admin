/* eslint react/jsx-key: off */
import 'babel-polyfill';
import React from 'react';
import { render } from 'react-dom';

import { Admin, Resource, Delete } from 'react-admin'; // eslint-disable-line import/no-unresolved
import jsonRestDataProvider from 'ra-data-fakerest';

import addUploadFeature from './addUploadFeature';

import { PostList, PostCreate, PostEdit, PostShow, PostIcon } from './posts';
import {
    CommentList,
    CommentEdit,
    CommentCreate,
    CommentShow,
    CommentIcon,
} from './comments';
import { UserList, UserEdit, UserCreate, UserIcon, UserShow } from './users';

import data from './data';
import authClient from './authClient';
import messagesProvider from './messagesProvider';
import customSagas from './sagas';

const dataProvider = jsonRestDataProvider(data, true);
const uploadCapableDataProvider = addUploadFeature(dataProvider);
const delayedDataProvider = (type, resource, params) =>
    new Promise(resolve =>
        setTimeout(
            () => resolve(uploadCapableDataProvider(type, resource, params)),
            1000
        )
    );

render(
    <Admin
        authClient={authClient}
        dataProvider={delayedDataProvider}
        messagesProvider={messagesProvider}
        customSagas={customSagas}
        title="Example Admin"
        locale="en"
    >
        {permissions => [
            <Resource
                name="posts"
                list={PostList}
                create={PostCreate}
                edit={PostEdit}
                show={PostShow}
                remove={Delete}
                icon={PostIcon}
            />,
            <Resource
                name="comments"
                list={CommentList}
                create={CommentCreate}
                edit={CommentEdit}
                show={CommentShow}
                remove={Delete}
                icon={CommentIcon}
            />,
            permissions ? (
                <Resource
                    name="users"
                    list={UserList}
                    create={UserCreate}
                    edit={UserEdit}
                    remove={Delete}
                    icon={UserIcon}
                    show={UserShow}
                />
            ) : null,
            <Resource name="tags" />,
        ]}
    </Admin>,
    document.getElementById('root')
);
