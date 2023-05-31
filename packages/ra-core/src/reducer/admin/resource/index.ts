import {
    REGISTER_RESOURCE,
    RegisterResourceAction,
    UNREGISTER_RESOURCE,
    UnregisterResourceAction,
} from '../../../actions';

const initialState = {};

type ActionTypes =
    | RegisterResourceAction
    | UnregisterResourceAction
    | { type: 'OTHER_ACTION'; payload?: any; meta?: { resource?: string } };

export default (previousState = initialState, action: ActionTypes) => {
    if (action.type === REGISTER_RESOURCE) {
        const resourceState = {
            props: action.payload,
        };
        return {
            ...previousState,
            [action.payload.name]: resourceState,
        };
    }

    if (action.type === UNREGISTER_RESOURCE) {
        return Object.keys(previousState).reduce((acc, key) => {
            if (key === action.payload) {
                return acc;
            }

            return { ...acc, [key]: previousState[key] };
        }, {});
    }

    if (!action.meta || !action.meta.resource) {
        return previousState;
    }

    const resources = Object.keys(previousState);
    const newState = resources.reduce(
        (acc, resource) => ({
            ...acc,
            [resource]:
                action.meta.resource === resource
                    ? {
                          props: previousState[resource].props,
                      }
                    : previousState[resource],
        }),
        {}
    );

    return newState;
};

export const getResources = state =>
    Object.keys(state).map(key => state[key].props);

export const getReferenceResource = (state, props) => state[props.reference];
