'''
'use client';

import { forwardRef } from 'react';
import ReactQuill, { ReactQuillProps } from 'react-quill';
import 'react-quill/dist/quill.snow.css';

// This is the crux of the solution. We are creating a wrapper component
// that forwards the ref to the underlying ReactQuill component. 
// This is the modern and correct way to get a reference to a component's DOM node in React 18,
// replacing the deprecated findDOMNode which caused all our problems.
const QuillEditor = forwardRef<ReactQuill, ReactQuillProps>((props, ref) => (
  <ReactQuill ref={ref} {...props} />
));

QuillEditor.displayName = 'QuillEditor';

export default QuillEditor;
'''