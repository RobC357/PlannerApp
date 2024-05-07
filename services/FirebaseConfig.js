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

  apiKey: "AIzaSyDUyEO4ZuZ7OHNPofdzfh9XZHdIVkpnzxc",

  authDomain: "plannerapp-new.firebaseapp.com",

  projectId: "plannerapp-new",

  storageBucket: "plannerapp-new.appspot.com",

  messagingSenderId: "99386510019",

  appId: "1:99386510019:web:bce905d433efc980b8f076",

  measurementId: "G-B7LM2F4SZ6"

};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const database = getFirestore(app);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

export default app;