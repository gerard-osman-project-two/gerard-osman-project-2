// Import the functions you need from the SDKs you need
import {initializeApp} from 'https://www.gstatic.com/firebasejs/9.20.0/firebase-app.js';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration

const firebaseConfig = {
  apiKey: 'AIzaSyDvS5HhFa5Aice3rWu_msbHRgXhMby1XIY',
  authDomain: 'juno-project-2.firebaseapp.com',
  databaseURL: 'https://juno-project-2-default-rtdb.firebaseio.com',
  projectId: 'juno-project-2',
  storageBucket: 'juno-project-2.appspot.com',
  messagingSenderId: '117598051344',
  appId: '1:117598051344:web:49198e86f86009ca79fe95',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export default app;
