import React, { useState } from 'react';

const FileUploader: React.FC = () => {
  const [fileContent, setFileContent] = useState<string>('');

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setFileContent(content);
      };
      reader.readAsText(file);
    } else {
      setFileContent('');
      alert('Please select a file.');
    }
  };

  return (
    <section>
      <div role='button' className='m-5 p-3 bg-sky-400 rounded-full'>
        <label htmlFor="file">Upload a board</label>
        <input className='hidden' id="file" name="file"type="file" onChange={handleFileUpload} />
      </div>
      <div>
        <h3>File Contents:</h3>
        <pre>{fileContent}</pre>
      </div>
    </section>
  );
};

export default FileUploader;
