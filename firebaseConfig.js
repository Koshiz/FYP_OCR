import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import { getAnalytics } from "firebase/analytics"
import { collection, doc, getDoc } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBGfL9IZfV57ptBVE03l5qEL2dnld7Col0",
    authDomain: "fyp-ocr-2023.firebaseapp.com",
    projectId: "fyp-ocr-2023",
    storageBucket: "fyp-ocr-2023.appspot.com",
    messagingSenderId: "440456338540",
    appId: "1:440456338540:web:1a4fb704621808c9518c49",
    measurementId: "G-2Q733R6XGP"
  }
  
  //Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app)
  