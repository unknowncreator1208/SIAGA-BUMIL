// ======================================
// SIAGA BUMIL
// FIREBASE CONFIGURATION
// ======================================

import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js";


import {
    getAuth,
    createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";


import {

    getFirestore,

    collection,

    addDoc,

    getDocs,

    getDoc,

    query,

    where,

    orderBy,

    limit,

    serverTimestamp,

    doc,

    setDoc,

    updateDoc,

    deleteDoc

} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";


// ======================================
// FIREBASE CONFIG
// ======================================

const firebaseConfig = {

    apiKey:
        "AIzaSyAzhHN2lhhiHGZ_qSgaKi96LFox8B5gTvA",

    authDomain:
        "siaga-bumil.firebaseapp.com",

    projectId:
        "siaga-bumil",

    storageBucket:
        "siaga-bumil.firebasestorage.app",

    messagingSenderId:
        "835713144095",

    appId:
        "1:835713144095:web:de658f8c2345650a744c2a"

};


// ======================================
// PRIMARY APP
// ======================================

const app =
    initializeApp(firebaseConfig);


// Authentication utama
const auth =
    getAuth(app);


// Firestore
const db =
    getFirestore(app);


// ======================================
// SECONDARY APP
// ======================================
//
// Digunakan khusus untuk membuat akun
// petugas tanpa mengeluarkan akun nakes
// yang sedang login.
//
// ======================================

const secondaryApp =
    initializeApp(

        firebaseConfig,

        "secondaryApp"

    );


const secondaryAuth =
    getAuth(secondaryApp);


// ======================================
// LOG
// ======================================

console.log(
    "✅ Firebase Connected"
);


// ======================================
// EXPORT
// ======================================

export {

    // Authentication
    auth,

    secondaryAuth,

    createUserWithEmailAndPassword,


    // Firestore
    db,

    collection,

    addDoc,

    getDocs,

    getDoc,

    query,

    where,

    orderBy,

    limit,

    serverTimestamp,

    doc,

    setDoc,

    updateDoc,

    deleteDoc

};