import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCDmddLA1gb6PV5y2HrzDVLWv5kgzoRFB4",
  authDomain: "surveywei-1b1e0.firebaseapp.com",
  projectId: "surveywei-1b1e0",
  storageBucket: "surveywei-1b1e0.appspot.com",
  messagingSenderId: "351828706228",
  appId: "1:351828706228:web:91dbf699afd8bab51e28e1",
};
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
