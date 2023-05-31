import assert from 'assert';
import { shallow } from 'enzyme';
import React from 'react';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

import { FileInputPreview } from './FileInputPreview';

describe('<FileInputPreview />', () => {
    const muiTheme = getMuiTheme({ userAgent: false });

    it('should call `onRemove` prop when clicking on remove button', () => {
        const onRemoveSpy = jest.fn();

        const wrapper = shallow(
            <FileInputPreview onRemove={onRemoveSpy} muiTheme={muiTheme}>
                <div>Child</div>
            </FileInputPreview>
        );

        const removeButton = wrapper.find('IconButton');
        removeButton.simulate('click');

        assert.equal(onRemoveSpy.mock.calls.length, 1);
    });

    it('should render passed children', () => {
        const wrapper = shallow(
            <FileInputPreview onRemove={() => true} muiTheme={muiTheme}>
                <div id="child">Child</div>
            </FileInputPreview>
        );

        const child = wrapper.find('#child');
        assert.equal(child.length, 1);
    });

    it('should clean up generated URLs for preview', () => {
        const file = { preview: 'previewUrl' };
        const revokeObjectURL = jest.fn();

        global.window = {
            URL: {
                revokeObjectURL,
            },
        };
        const wrapper = shallow(
            <FileInputPreview
                onRemove={() => true}
                file={file}
                muiTheme={muiTheme}
            >
                <div id="child">Child</div>
            </FileInputPreview>,
            { lifecycleExperimental: true }
        );

        wrapper.unmount();
        assert.equal(revokeObjectURL.mock.calls[0][0], 'previewUrl');
    });

    it('should not try to clean up preview urls if not passed a File object with a preview', () => {
        const file = {};
        const revokeObjectURL = jest.fn();

        global.window = {
            URL: {
                revokeObjectURL,
            },
        };
        const wrapper = shallow(
            <FileInputPreview
                onRemove={() => true}
                file={file}
                muiTheme={muiTheme}
            >
                <div id="child">Child</div>
            </FileInputPreview>,
            { lifecycleExperimental: true }
        );

        wrapper.unmount();
        assert.equal(revokeObjectURL.mock.calls.length, 0);
    });
});
