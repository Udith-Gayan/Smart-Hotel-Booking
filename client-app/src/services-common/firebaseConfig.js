// Import the functions you need from the SDKs you need
import {initializeApp} from "firebase/app";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyA6FtdqXKZGctqInC8qdPaQ0jlQ_AQu3Y8",
    authDomain: "hotel-management-system-134e8.firebaseapp.com",
    projectId: "hotel-management-system-134e8",
    storageBucket: "hotel-management-system-134e8.appspot.com",
    messagingSenderId: "872239343591",
    appId: "1:872239343591:web:e030e787fc9581801f3f42",
    measurementId: "G-ELRGQXW7BQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
export default storage;
