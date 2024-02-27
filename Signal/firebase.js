import { initializeApp } from "firebase/app";
import { initializeAuth } from "firebase/auth";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { getReactNativePersistence } from "firebase/auth";
import {
  indexedDBLocalPersistence,
  browserLocalPersistence,
} from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyCCSohAL9JnRkPj4cxZZxu2vH-YMHHuznk",
  authDomain: "signal-a7eee.firebaseapp.com",
  projectId: "signal-a7eee",
  storageBucket: "signal-a7eee.appspot.com",
  messagingSenderId: "802388513104",
  appId: "1:802388513104:web:e7c12f4c0520386fe75c55",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app); // Para entrar no copmutador
/*const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});*/ //Para entrar no mobile e continur logado

export { db, auth };
