import { initializeApp } from "firebase/app";
import firebase from "firebase/compat/app";
import "firebase/compat/storage";

const firebaseConfig = {
  apiKey: "AIzaSyB__eo5xUud6G7stgso8T0kWJRst0TL2AA",
  authDomain: "linkedin-6baa5.firebaseapp.com",
  projectId: "linkedin-6baa5",
  storageBucket: "linkedin-6baa5.appspot.com",
  messagingSenderId: "1048075782844",
  appId: "1:1048075782844:web:c366196c45b0e12af0deb9",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export { firebase };
