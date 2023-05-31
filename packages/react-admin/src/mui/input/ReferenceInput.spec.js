import React from 'react';
import assert from 'assert';
import { shallow } from 'enzyme';
import { InnerReferenceInput } from './ReferenceInput';

describe('<ReferenceInput />', () => {
    const defaultProps = {
        meta: {},
        input: {},
        label: '',
        record: {},
        reference: 'posts',
        resource: 'comments',
        source: 'post_id',
        translate: x => `*${x}*`,
    };
    const MyComponent = () => <span id="mycomponent" />;

    it('should render a LinearProgress if isLoading is true', () => {
        const wrapper = shallow(
            <InnerReferenceInput
                {...{
                    ...defaultProps,
                    input: { value: 1 },
                    isLoading: true,
                }}
            >
                <MyComponent />
            </InnerReferenceInput>
        );
        const MyComponentElement = wrapper.find('MyComponent');
        assert.equal(MyComponentElement.length, 0);
        const LinearProgressElement = wrapper.find(
            'WithStyles(LinearProgress)'
        );
        assert.equal(LinearProgressElement.length, 1);
    });

    it('should not render a LinearProgress if isLoading is false', () => {
        const wrapper = shallow(
            <InnerReferenceInput
                {...{
                    ...defaultProps,
                    choices: [{ id: 1 }],
                    input: { value: 1 },
                }}
            >
                <MyComponent />
            </InnerReferenceInput>
        );
        const LinearProgressElement = wrapper.find(
            'WithStyles(LinearProgress)'
        );
        assert.equal(LinearProgressElement.length, 0);
        const MyComponentElement = wrapper.find('MyComponent');
        assert.equal(MyComponentElement.length, 1);
        assert.deepEqual(MyComponentElement.prop('choices'), [{ id: 1 }]);
    });

    it('should display an error if error is defined', () => {
        const wrapper = shallow(
            <InnerReferenceInput
                {...{
                    ...defaultProps,
                    error: 'fetch error',
                    input: { value: 1 },
                }}
            >
                <MyComponent />
            </InnerReferenceInput>
        );
        const MyComponentElement = wrapper.find('MyComponent');
        assert.equal(MyComponentElement.length, 0);
        const ErrorElement = wrapper.find('ReferenceError');
        assert.equal(ErrorElement.length, 1);
        assert.equal(ErrorElement.prop('error'), 'fetch error');
    });

    it('should pass warning as helperText to the children if defined', () => {
        const wrapper = shallow(
            <InnerReferenceInput
                {...{
                    ...defaultProps,
                    warning: 'fetch error',
                    choices: [{ id: 1 }],
                    input: { value: 1 },
                }}
            >
                <MyComponent />
            </InnerReferenceInput>
        );
        const ReferenceLoadingProgressElement = wrapper.find(
            'ReferenceLoadingProgress'
        );
        assert.equal(ReferenceLoadingProgressElement.length, 0);
        const ErrorElement = wrapper.find('ReferenceError');
        assert.equal(ErrorElement.length, 0);
        const MyComponentElement = wrapper.find('MyComponent');
        assert.equal(MyComponentElement.length, 1);
        assert.deepEqual(MyComponentElement.prop('meta'), {
            helperText: 'fetch error',
        });
        assert.deepEqual(MyComponentElement.prop('choices'), [{ id: 1 }]);
    });

    it('should pass onChange down to child component', () => {
        const onChange = jest.fn();
        const wrapper = shallow(
            <InnerReferenceInput
                {...defaultProps}
                allowEmpty
                onChange={onChange}
            >
                <MyComponent />
            </InnerReferenceInput>
        );
        wrapper.find('MyComponent').simulate('change', 'foo');
        assert.deepEqual(onChange.mock.calls[0], ['foo']);
    });

    it('should pass meta down to child component', () => {
        const wrapper = shallow(
            <InnerReferenceInput
                {...defaultProps}
                allowEmpty
                meta={{ touched: false }}
            >
                <MyComponent />
            </InnerReferenceInput>
        );

        const myComponent = wrapper.find('MyComponent');
        assert.notEqual(myComponent.prop('meta', undefined));
    });
});
