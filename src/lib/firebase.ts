
// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For more information on how to get this, see:
// https://firebase.google.com/docs/web/setup#get-config
const firebaseConfig = {
  apiKey: "AIzaSyCMsUzRSOG5kd751dnPl61Y5PEGY6T2mvs",
  authDomain: "eng-dairy-web.firebaseapp.com",
  projectId: "eng-dairy-web",
  storageBucket: "eng-dairy-web.firebasestorage.app",
  messagingSenderId: "405984057973",
  appId: "1:405984057973:web:775d04563523e024e7763c",
  measurementId: "G-2TMRRBX2V9"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export { app };
