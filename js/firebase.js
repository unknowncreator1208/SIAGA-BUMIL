// ===============================
// Firebase Configuration
// ===============================

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js";

import {
    getAuth
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

    updateDoc

} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

const firebaseConfig = {

    apiKey: "AIzaSyAzhHN2lhhiHGZ_qSgaKi96LFox8B5gTvA",

    authDomain: "siaga-bumil.firebaseapp.com",

    projectId: "siaga-bumil",

    storageBucket: "siaga-bumil.firebasestorage.app",

    messagingSenderId: "835713144095",

    appId: "1:835713144095:web:de658f8c2345650a744c2a"

};

// Inisialisasi Firebase

const app = initializeApp(firebaseConfig);

// Authentication

const auth = getAuth(app);

// Firestore

const db = getFirestore(app);

console.log("✅ Firebase Connected");

export {

    auth,

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

    updateDoc

};