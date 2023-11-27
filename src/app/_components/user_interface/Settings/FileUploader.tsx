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
    <section className='flex flex-col'>
      <div role='button' className='m-2 p-3 bg-sky-400 rounded-full w-max font-bold self-center'>
        <label htmlFor="file">Upload a board</label>
        <input className='hidden' id="file" name="file" type="file" accept=".txt" onChange={handleFileUpload} />
      </div>
      <div>
      </div>
    </section>
  );
};

export default FileUploader;
