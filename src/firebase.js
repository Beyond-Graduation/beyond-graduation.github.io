import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAU2CTmhE5eA6jg-en-nnNTGSpLcSzwqt8",
  authDomain: "beyond-graduation.firebaseapp.com",
  projectId: "beyond-graduation",
  storageBucket: "beyond-graduation.appspot.com",
  messagingSenderId: "542226015267",
  appId: "1:542226015267:web:a6f97bca7a60b679a4bd96",
  measurementId: "G-SD755X2KEW"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app, process.env.REACT_APP_BUCKET_URL);
export default storage;
