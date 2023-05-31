import React from 'react';
import debounce from 'lodash/debounce';
import {render, fireEvent, waitForElement, cleanup, getByTestId} from 'react-testing-library'

import { RichTextInput } from './index';

let container;

jest.mock('lodash/debounce');
describe('RichTextInput', () => {
    beforeEach(() => {
      container = document.createElement('div');
      document.body.appendChild(container);
      // required as quilljs uses getSelection api
      document.getSelection = () => {
          return {
            removeAllRanges: () => {},
            getRangeAt: function() {}, 
          };
      };
    });

    afterEach(() => {
        document.body.removeChild(container);
        container = null;
    });

    it('should call handleChange only once when editing', async () => {
        jest.useFakeTimers();
        const mockFn = jest.fn();
        debounce.mockImplementation(fn => fn);
        const { getByTestId, rerender } = render(
        <RichTextInput
            input={{
              value: '<p>test</p>',
                onChange: mockFn
            }}
            meta={{error: null}} />);
        const quillNode = await waitForElement(() => {
            return getByTestId('quill')
        });
        const node = quillNode.querySelector('.ql-editor');
        fireEvent.input(node, {
          target: { innerHTML: '<p>test1</p>' }
        });

        jest.runOnlyPendingTimers();

        rerender(
          <RichTextInput
            input={{
              value: '<p>test1</p>',
                onChange: mockFn
            }}
            meta={{error: null}} />)

        expect(mockFn).toHaveBeenCalledTimes(1);
    });
})
