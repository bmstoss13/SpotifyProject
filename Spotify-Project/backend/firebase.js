import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";


import serviceAccount from "./permissions.json";


const app = initializeApp(serviceAccount);
const db = getFirestore(app);


export default {db, app};