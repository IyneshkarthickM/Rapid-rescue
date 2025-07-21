
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyB4aK8qeOBOYVEuai-g4L92FR7IM-IsBPI",
  authDomain: "medulance-26390.firebaseapp.com",
  databaseURL: "https://medulance-26390-default-rtdb.firebaseio.com",
  projectId: "medulance-26390",
  storageBucket: "medulance-26390.appspot.com",
  messagingSenderId: "961198033079",
  appId: "1:961198033079:web:079f0febff9ae4aa01a532",   
  measurementId: "G-JKF5TJF26Q",
};

const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);   
const auth = getAuth(app);
const storage = getStorage(app);
const database = getDatabase(app);

export { app, firestore, auth, storage, database };
