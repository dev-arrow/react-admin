import { useContext, useEffect, useRef } from 'react';
import { useFormState, UseFormStateParams } from 'react-final-form';
import { UNSAFE_NavigationContext, useLocation } from 'react-router-dom';
import { History, Transition } from 'history';
import { useTranslate } from '../i18n';

/**
 * Display a confirmation dialog if the form has unsaved changes.
 * - If the user confirms, the navigation continues and the changes are lost.
 * - If the user cancels, the navigation is cancelled and the changes are kept.
 */
const useWarnWhenUnsavedChanges = (
    enable: boolean,
    formRootPathname?: string
) => {
    // react-router v6 does not yet provide a way to block navigation
    // This is planned for a future release
    // See https://github.com/remix-run/react-router/issues/8139
    const navigator = useContext(UNSAFE_NavigationContext).navigator as History;
    const location = useLocation();
    const translate = useTranslate();
    const { pristine, submitSucceeded, submitting } = useFormState(
        UseFormStateSubscription
    );
    const initialLocation = useRef(formRootPathname || location.pathname);

    useEffect(() => {
        if (!enable || pristine) return;

        let unblock = navigator.block((tx: Transition) => {
            const newLocationIsInsideForm = tx.location.pathname.startsWith(
                initialLocation.current
            );

            if (
                !submitting &&
                (newLocationIsInsideForm ||
                    submitSucceeded ||
                    window.confirm(translate('ra.message.unsaved_changes')))
            ) {
                unblock();
                tx.retry();
            }
        });

        return unblock;
    }, [
        enable,
        location,
        navigator,
        pristine,
        submitting,
        submitSucceeded,
        translate,
    ]);
};

const UseFormStateSubscription: UseFormStateParams = {
    // For some reason, subscribing only to pristine does not rerender when a field become dirty
    // because it has a defaultValue (not initialValue as setting an initialValue does not make the field dirty)
    subscription: {
        pristine: true,
        dirtyFields: true,
        submitSucceeded: true,
        submitting: true,
    },
};

export default useWarnWhenUnsavedChanges;
