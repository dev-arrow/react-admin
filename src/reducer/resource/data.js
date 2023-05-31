import {
    CRUD_GET_LIST_SUCCESS,
    CRUD_GET_ONE_SUCCESS,
    CRUD_GET_MANY_SUCCESS,
    CRUD_UPDATE,
    CRUD_UPDATE_SUCCESS,
    CRUD_CREATE_SUCCESS,
} from '../../actions/dataActions';

export default (resource) => (previousState = {}, { type, payload, meta }) => {
    if (!meta || meta.resource !== resource) {
        return previousState;
    }
    switch (type) {
    case CRUD_GET_LIST_SUCCESS:
    case CRUD_GET_MANY_SUCCESS: {
        const newRecords = {};
        payload.data.forEach(record => {
            newRecords[record.id] = record;
        });
        return {
            ...previousState,
            ...newRecords
        };
    }
    case CRUD_GET_ONE_SUCCESS:
    case CRUD_UPDATE: // replace record in edit form with edited one to avoid displaying previous record version
    case CRUD_UPDATE_SUCCESS:
    case CRUD_CREATE_SUCCESS:
        return { ...previousState, [payload.data.id]: payload.data };
    default:
        return previousState;
    }
};

export const getRecord = (state, id) => state[id];
