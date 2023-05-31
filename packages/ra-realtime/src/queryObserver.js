import { END } from 'redux-saga';

export default emitter => ({
    complete() {
        emitter(END);
    },
    error() {
        emitter(END);
    },
    next(apolloQueryResult) {
        emitter(apolloQueryResult);
    },
});
