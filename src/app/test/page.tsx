'use client'
import LargeHeading from '@/components/ui/LargeHeading'
import Paragraph from '@/components/ui/Paragraph'
import { FC, ChangeEvent, useState, useRef } from 'react'
import 'simplebar-react/dist/simplebar.min.css'



import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Similarity API | Documentation',
  description: 'Free & open-source text similarity API',
}

const page: FC = () => {
    const [file, setFile] = useState<File>();
    const [responseData, setResponseData] = useState<any>();
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
          setFile(e.target.files[0]);
        }
      };

      const handleUploadClick = () => {
        if (!file) {
          return;
        }
    
        var myHeaders = new Headers();
        myHeaders.append("accept", "application/json");
        myHeaders.append("x-api-key", "1234");

        var formdata = new FormData();
        formdata.append("file", file, file.name);

        var requestOptions: RequestInit = {
            method: 'POST',
            headers: myHeaders,
            body: formdata,
          };

        fetch("http://127.0.0.1:8080/detect_img", requestOptions)
            .then(async response => {
              setResponseData(await response.json())
            })
            .catch(error => console.log('error', error));
        
      };
  return (
    <div>
        <input type="file" onChange={handleFileChange} />
        <div>{file && `${file.name} - ${file.type}`}</div>
        <button onClick={handleUploadClick}>Upload</button>
          {responseData ? (<div>
            <img src={responseData.imageURL} alt="Prediction" />
          </div>) : (<div>Loading...</div>)}
    </div>
  )
}


export default page
