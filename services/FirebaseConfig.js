// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth , initializeAuth , getReactNativePersistence } from "firebase/auth";

import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDL_7-tXMLtwvNKEzgRINPZsj4iwufVM_8",
  authDomain: "plannerapp-40d82.firebaseapp.com",
  projectId: "plannerapp-40d82",
  storageBucket: "plannerapp-40d82.appspot.com",
  messagingSenderId: "863549919004",
  appId: "1:863549919004:web:444215d3090270a2e234d9",
  databaseURL: "https://plannerapp-40d82-default-rtdb.firebaseio.com/",
  measurementId: "G-32QRQWFKVK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const database = getFirestore(app);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

export default app;