import React, { useState } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css'; // Import the standard Snow theme

const Generation = () => {
  const [content, setContent] = useState('');

  // Define the custom toolbar to closely match the image provided
  const modules = {
    toolbar: [
      // History (undo/redo usually requires a custom handler in Quill, but we leave the groups here)
      [{ 'font': [] }, { 'size': [] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'script': 'sub'}, { 'script': 'super' }],
      [{ 'color': [] }, { 'background': [] }],
      ['clean'],
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }], // Normal/Header dropdown
      [{ 'align': [] }],
      ['link', 'image'],
      [{ 'list': 'bullet' }, { 'list': 'ordered' }, 'code-block', 'blockquote'],
    ],
  };

  const formats = [
    'font', 'size',
    'bold', 'italic', 'underline', 'strike',
    'script', 'color', 'background',
    'header', 'align', 'link', 'image',
    'list', 'bullet', 'code-block', 'blockquote'
  ];

  return (
    <div style={{ animation: 'slideUp 0.5s ease', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Container to hold the white editor within the dark theme layout */}
      <div className="quill-wrapper" style={{ background: '#ffffff', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }}>
        
        {/* ReactQuill Component */}
        <ReactQuill 
          theme="snow"
          value={content} 
          onChange={setContent} 
          modules={modules}
          formats={formats}
          style={{ height: '600px', backgroundColor: '#ffffff', color: '#000000' }}
          placeholder="Start typing or paste your content here..."
        />
        
      </div>

      {/* Adding custom CSS to hide the borders and make it look clean inside the container */}
      <style>{`
        .quill-wrapper .ql-toolbar.ql-snow {
          border: none !important;
          border-bottom: 1px solid #e0e0e0 !important;
          padding: 16px !important;
          background: #fdfdfd;
          border-top-left-radius: 16px;
          border-top-right-radius: 16px;
        }
        .quill-wrapper .ql-container.ql-snow {
          border: none !important;
          background: #ffffff;
          border-bottom-left-radius: 16px;
          border-bottom-right-radius: 16px;
        }
        .quill-wrapper .ql-editor {
          min-height: 500px;
          font-size: 16px;
          padding: 32px;
          font-family: 'Inter', sans-serif;
          color: #000000 !important;
        }
        .quill-wrapper .ql-editor p, 
        .quill-wrapper .ql-editor h1, 
        .quill-wrapper .ql-editor h2, 
        .quill-wrapper .ql-editor h3, 
        .quill-wrapper .ql-editor span,
        .quill-wrapper .ql-editor li {
          color: #000000 !important;
        }
        .quill-wrapper .ql-editor.ql-blank::before {
          color: #999999;
          font-style: normal;
        }
        /* Make toolbar buttons match the screenshot style */
        .quill-wrapper .ql-toolbar button {
          margin-right: 4px;
          border-radius: 4px;
          transition: background 0.2s;
        }
        .quill-wrapper .ql-toolbar button:hover {
          background: #f0f0f0;
        }
        .quill-wrapper .ql-picker {
          color: #444;
        }
      `}</style>

    </div>
  );
};

export default Generation;
