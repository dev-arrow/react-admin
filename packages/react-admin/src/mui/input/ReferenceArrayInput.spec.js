import React from 'react';
import assert from 'assert';
import { shallow } from 'enzyme';
import { InnerReferenceArrayInput } from './ReferenceArrayInput';

describe('<ReferenceArrayInput />', () => {
    const defaultProps = {
        input: {},
        meta: {},
        record: {},
        reference: 'tags',
        resource: 'posts',
        source: 'tag_ids',
        translate: x => `*${x}*`,
    };
    const MyComponent = () => <span id="mycomponent" />;

    it('should render a LinearProgress if isLoading is true', () => {
        const wrapper = shallow(
            <InnerReferenceArrayInput
                {...{
                    ...defaultProps,
                    isLoading: true,
                    input: {},
                }}
            >
                <MyComponent />
            </InnerReferenceArrayInput>
        );
        const MyComponentElement = wrapper.find('MyComponent');
        assert.equal(MyComponentElement.length, 0);
        const LinearProgressElement = wrapper.find(
            'WithStyles(LinearProgress)'
        );
        assert.equal(LinearProgressElement.length, 1);
    });

    it('should display an error if error is defined', () => {
        const wrapper = shallow(
            <InnerReferenceArrayInput
                {...{
                    ...defaultProps,
                    error: 'ra.input.references.all_missing',
                    input: {},
                }}
            >
                <MyComponent />
            </InnerReferenceArrayInput>
        );
        const MyComponentElement = wrapper.find('MyComponent');
        assert.equal(MyComponentElement.length, 0);
        const ErrorElement = wrapper.find('ReferenceError');
        assert.equal(ErrorElement.length, 1);
        assert.equal(
            ErrorElement.prop('error'),
            'ra.input.references.all_missing'
        );
    });

    it('should send an error to the children if warning is defined', () => {
        const wrapper = shallow(
            <InnerReferenceArrayInput
                {...{
                    ...defaultProps,
                    warning: 'fetch error',
                    input: { value: [1, 2] },
                    choices: [{ id: 2 }],
                }}
            >
                <MyComponent />
            </InnerReferenceArrayInput>
        );
        const ErrorElement = wrapper.find('ReferenceError');
        assert.equal(ErrorElement.length, 0);
        const MyComponentElement = wrapper.find('MyComponent');
        assert.equal(MyComponentElement.length, 1);
        assert.deepEqual(MyComponentElement.prop('meta'), {
            helperText: 'fetch error',
        });
    });

    it('should not send an error to the children if warning is not defined', () => {
        const wrapper = shallow(
            <InnerReferenceArrayInput
                {...{
                    ...defaultProps,
                    input: { value: [1, 2] },
                    choices: [{ id: 1 }, { id: 2 }],
                }}
            >
                <MyComponent />
            </InnerReferenceArrayInput>
        );
        const ErrorElement = wrapper.find('ReferenceError');
        assert.equal(ErrorElement.length, 0);
        const MyComponentElement = wrapper.find('MyComponent');
        assert.equal(MyComponentElement.length, 1);
        assert.deepEqual(MyComponentElement.prop('meta'), {
            helperText: false,
        });
    });

    it('should render enclosed component if references present in input are available in state', () => {
        const wrapper = shallow(
            <InnerReferenceArrayInput
                {...{
                    ...defaultProps,
                    input: { value: [1] },
                    choices: [1],
                }}
            >
                <MyComponent />
            </InnerReferenceArrayInput>
        );
        const ErrorElement = wrapper.find('ReferenceError');
        assert.equal(ErrorElement.length, 0);
        const MyComponentElement = wrapper.find('MyComponent');
        assert.equal(MyComponentElement.length, 1);
        assert.deepEqual(MyComponentElement.prop('choices'), [1]);
    });

    it('should render enclosed component even if the choices are empty', () => {
        const wrapper = shallow(
            <InnerReferenceArrayInput
                {...{
                    ...defaultProps,
                    choices: [],
                }}
            >
                <MyComponent />
            </InnerReferenceArrayInput>
        );
        const LinearProgressElement = wrapper.find(
            'WithStyles(LinearProgress)'
        );
        assert.equal(LinearProgressElement.length, 0);
        const ErrorElement = wrapper.find('ReferenceError');
        assert.equal(ErrorElement.length, 0);
        const MyComponentElement = wrapper.find('MyComponent');
        assert.equal(MyComponentElement.length, 1);
        assert.deepEqual(MyComponentElement.prop('choices'), []);
    });

    it('should pass onChange down to child component', () => {
        const onChange = jest.fn();
        const wrapper = shallow(
            <InnerReferenceArrayInput
                {...defaultProps}
                allowEmpty
                onChange={onChange}
            >
                <MyComponent />
            </InnerReferenceArrayInput>
        );
        wrapper.find('MyComponent').simulate('change', 'foo');
        assert.deepEqual(onChange.mock.calls[0], ['foo']);
    });

    it('should pass meta down to child component', () => {
        const wrapper = shallow(
            <InnerReferenceArrayInput
                {...defaultProps}
                allowEmpty
                meta={{ touched: false }}
            >
                <MyComponent />
            </InnerReferenceArrayInput>
        );

        const myComponent = wrapper.find('MyComponent');
        assert.notEqual(myComponent.prop('meta', undefined));
    });
});
