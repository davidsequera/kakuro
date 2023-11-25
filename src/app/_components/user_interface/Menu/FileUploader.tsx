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
    <div>
      <input type="file" onChange={handleFileUpload} />
      <div>
        <h3>File Contents:</h3>
        <pre>{fileContent}</pre>
      </div>
    </div>
  );
};

export default FileUploader;
