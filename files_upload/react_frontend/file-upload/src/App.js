/* eslint-disable no-console */
/* eslint-disable react/jsx-filename-extension */
import React, { useState, useEffect } from 'react';
import axios from 'axios';

// eslint-disable-next-line func-names

const App = function () {
  const [files, setFiles] = useState();
  const [count, setCount] = useState(0);

  useEffect(() => {
    const info = document.getElementById('info');
    info.innerHTML = `${count} file(s) selected: `;
  }, [count]);
  // event handler for file selection
  const updateFile = (evt) => {
    setFiles([...evt.target.files]);
    setCount(evt.target.files.length);
  };

  // event handler for files upload
  const handleUpload = async () => {
    // create new formdata object
    const formData = new FormData();

    // Add files to the formdata object
    for (let i = 0; i < files.length; i += 1) {
      formData.append(`File_${i}`, files[i]);
    }

    try {
      const res = await axios.post('http://localhost:8080/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log(`Upload sucessful ${res}`);
    } catch (err) {
      console.err(err.message);
    }
  };

  return (
    <div>
      <h2>File Upload Example</h2>
      <div id="info" />
      <div>
        File:
        <input
          id="upld"
          type="file"
          name="someFiles"
          multiple="multiple"
          onChange={(e) => updateFile(e)}
        />
      </div>
      <button type="submit" onClick={() => handleUpload()}>
        Upload Files
      </button>
    </div>
  );
};
export default App;
