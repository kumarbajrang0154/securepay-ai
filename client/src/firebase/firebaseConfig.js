import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCad3F5lvH4mN4eZvbt59FRYUPCu5wav8Q",
  authDomain: "pay-ai-4c670.firebaseapp.com",
  projectId: "pay-ai-4c670",
  storageBucket: "pay-ai-4c670.firebasestorage.app",
  messagingSenderId: "1040118098011",
  appId: "1:1040118098011:web:c34f48e32513c6e526777e"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);