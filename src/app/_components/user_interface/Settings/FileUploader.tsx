import React, { useState } from 'react';

const FileUploader = ({setBoardFromFile}: any) => {
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setBoardFromFile(file);
    }else{
      alert("Please select a file")
      console.log("no file")
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
