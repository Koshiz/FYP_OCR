'use client'
import { FC, ChangeEvent, useState, useEffect } from 'react'
import 'simplebar-react/dist/simplebar.min.css'

//Firebase Imports
import { initializeApp } from "firebase/app";
import { getFirestore, collection, query, where, getDocs, onSnapshot } from "firebase/firestore";
import  firebaseConfig  from "../../../firebaseConfig";




import { Firestore, QuerySnapshot, } from '@google-cloud/firestore'
import { json } from 'stream/consumers';

import { Loader2 } from 'lucide-react';


const page: FC = () => {
    const [file, setFile] = useState<File>();
    const [responseData, setResponseData] = useState<any>();
    const [documentData, setDocumentData] = useState<any>();
    const [imageLoading, setImageLoading] = useState<boolean>(false);
    const [predictionLoading, setPredictionLoading] = useState<boolean>(false);

    

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
          setFile(e.target.files[0]);
        }
      };

            //Initialize Firebase app with configuration
            const app = initializeApp(firebaseConfig);
      
            //Get a Firestore instance
            const db = getFirestore(app);
            
            //Retrive data from firestore collection and display it in the console
            async function getData(docId: String) {
              // const querySnapshot = await getDocs(collection(db, "Predictions"));
              // querySnapshot.forEach((doc) => {
              //   console.log(`${doc.id} => ${doc.data()}`);
              // });
              const docRef = collection(db, "Predictions");
              const q = query(docRef, where('__name__', '==' , docId));
              const unsubscribe = onSnapshot(q, (querySnapshot) => {
                querySnapshot.forEach((doc) => {
                  console.log(doc.id, " => ", doc.data());
                  setDocumentData(doc.data());
                  setPredictionLoading(true);
                });
              });
              // const querySnapshot = await getDocs(q);
              // querySnapshot.forEach((doc) => {
              // // doc.data() is never undefined for query doc snapshots
              //   console.log(doc.id, " => ", doc.data());
              //   setDocumentData(doc.data());
              // });
            }


      const handleUploadClick = async () => {
        if (!file) {
          return;
        }

        setImageLoading(true);
        setPredictionLoading(true);

        
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
        
        const response = await fetch("http://127.0.0.1:8080/detect_img", requestOptions)
        const data:any = await response.json()
        setResponseData(data)
        getData(data.documentID)
        setImageLoading(false);
        // setResponseData(jsonresponse);
        // getData(jsonresponse.documentID);
        
      };

      


      return (
        <div className='text-black dark:text-white'>
          <div className='flex justify-center'>
            <div>Upload Your Prescription Here: </div>
            <div><input type="file" onChange={handleFileChange} /></div>  
          </div>
          
          <div>{file && `${file.name} - ${file.type}`}</div>
          <div className='flex justify-center'>
            <button onClick={handleUploadClick}>Upload</button>
          </div>
          <div className='flex'>
            <div className='flex w-4/5 justify-center'>
              {responseData ? (
                <div>
                  <img src={responseData.imageURL} alt="Prediction" />
                </div>
              ) : (
                <>{imageLoading && !responseData && <Loader2 className='animate-spin h-10 w-10 dark:text-slate-200' />}</>
              )}
            </div>
            <div className='flex w-1/5'>
              <ul>
                {documentData ? (
                  documentData.DETECT_LIST.map((value: string, index: number) => (
                    <li key={index}>
                      {value}
                    </li>
                  ))
                ) : (
                  <>{predictionLoading && !documentData && <Loader2 className='animate-spin h-10 w-10 dark:text-slate-200' />}</>
                )}
              </ul>
            </div> 
          </div>       
        </div>
      );
      
}



export default page
