
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyA1eiKWzC9WqZUHnmRZPlUj8bQj6qZ9W2s",
  authDomain: "passae-app-b3cc5.firebaseapp.com",
  projectId: "passae-app-b3cc5",
  storageBucket: "passae-app-b3cc5.firebasestorage.app",
  messagingSenderId: "175116595782",
  appId: "1:175116595782:web:a1b40163721b5d8bad5047",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
