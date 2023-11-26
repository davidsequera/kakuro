import React, { useState } from 'react';
import { createBoardFromFile } from '../../game_interface/CreateBoard';

const FileUploader: React.FC = () => {
  const [file, setFile] = useState<File | undefined>(undefined);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFile(event.target.files?.[0])
    const file = event.target.files?.[0];
    console.log(event.target.files?.[0]);
    if (file) {
      const reader: FileReader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        console.log(content);
        console.log(createBoardFromFile(content));
      };
      reader.readAsText(file);
    } else {
      alert('Please select a file.');
    }
  };

  return (
    <section>
      <div role='button' className='m-5 p-3 bg-sky-400 rounded-full'>
        <label htmlFor="file">Upload a board</label>
        <input className='hidden' id="file" name="file" type="file" accept=".txt" onChange={handleFileUpload} />
      </div>
      <div>
      </div>
    </section>
  );
};

export default FileUploader;
