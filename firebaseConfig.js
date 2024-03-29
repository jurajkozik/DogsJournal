import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { storage } from "firebase/storage";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

// Optionally import the services that you want to use
// import {...} from "firebase/auth";
// import {...} from "firebase/database";
// import {...} from "firebase/firestore";
// import {...} from "firebase/functions";
// import {...} from "firebase/storage";

//import * as firebase from "firebase";

// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBSKvXTTvo3q7tm-Fu3ZdchO0oJ3yVD8zs",
    authDomain: "dogtrainingapp-6370e.firebaseapp.com",
    projectId: "dogtrainingapp-6370e",
    storageBucket: "dogtrainingapp-6370e.appspot.com",
    messagingSenderId: "1006984340648",
    appId: "1:1006984340648:web:9bcf7ca3b7d1e380694e9d"
  };

//export const auth = app.auth();

const app = initializeApp(firebaseConfig);    //<--
//const auth = getAuth(app);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});
const db = getFirestore();
//const storageRef = storage(app);
export { app, auth, db }; 
//export const auth = app.auth();
//export default getFirestore();                //<--
// For more information on how to access Firebase in your project,
// see the Firebase documentation: https://firebase.google.com/docs/web/setup#access-firebase
