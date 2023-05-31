import assert from 'assert';
import { shallow } from 'enzyme';
import React from 'react';

import NullableBooleanInput from './NullableBooleanInput';

describe('<NullableBooleanInput />', () => {
    const defaultProps = {
        input: {},
        meta: {},
    };

    it('should give three different choices for true, false or unknown', () => {
        const wrapper = shallow(<NullableBooleanInput {...defaultProps} />);
        const choices = wrapper.find('SelectInput').prop('choices');
        assert.deepEqual(choices, [
            { value: null, label: '' },
            { value: false, label: 'No' },
            { value: true, label: 'Yes' },
        ]);
    });

    describe('error message', () => {
        it('should not be displayed if field is pristine', () => {
            const wrapper = shallow(<NullableBooleanInput {...defaultProps} meta={{ touched: false }} />);
            const SelectInputElement = wrapper.find('SelectInput');
            assert.equal(SelectInputElement.prop('errorText'), false);
        });

        it('should not be displayed if field has been touched but is valid', () => {
            const wrapper = shallow(<NullableBooleanInput {...defaultProps} meta={{ touched: true, error: false }} />);
            const SelectInputElement = wrapper.find('SelectInput');
            assert.equal(SelectInputElement.prop('errorText'), false);
        });

        it('should be displayed if field has been touched and is invalid', () => {
            const wrapper = shallow(<NullableBooleanInput {...defaultProps} meta={{ touched: true, error: 'Required field.' }} />);
            const SelectInputElement = wrapper.find('SelectInput');
            assert.equal(SelectInputElement.prop('errorText'), 'Required field.');
        });
    });
});
