// firebase.ts
// Standard modular SDK imports for Firebase v9+
// Using named exports as required by the modular SDK (v9+)
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore/lite';

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyA1eiKWzC9WqZUHnmRZPlUj8bQj6qZ9W2s",
  authDomain: "passae-app-b3cc5.firebaseapp.com",
  projectId: "passae-app-b3cc5",
  storageBucket: "passae-app-b3cc5.firebasestorage.app",
  messagingSenderId: "175116595782",
  appId: "1:175116595782:web:a1b40163721b5d8bad5047",
};

// Inicializa o app Firebase
// Standard initialization using the modular SDK syntax
const app = initializeApp(firebaseConfig);

// Exporta o Firestore (BANCO DE DADOS)
// Use the lite entry point for better performance in simple data retrieval tasks
export const db = getFirestore(app);