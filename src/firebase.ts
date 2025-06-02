import { initializeApp } from 'firebase/app';
import { getAuth }       from 'firebase/auth/web-extension';
import { getFirestore }  from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyBXsuFqkw65oK9VPQuBIQOMHuzWah9tKgo",
    authDomain: "extension-a04e7.firebaseapp.com",
    projectId: "extension-a04e7",
    storageBucket: "extension-a04e7.firebasestorage.app",
    messagingSenderId: "192486774122",
    appId: "1:192486774122:web:860a3e47704e761c8ec113",
    measurementId: "G-V3866BPDSR",
};

const app  = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);