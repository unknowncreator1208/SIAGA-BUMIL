import { auth, db } from "./firebase.js";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword
}
from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";

import {

    doc,

    setDoc,

    getDoc

}

from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";


// ===================================
// REGISTER
// ===================================

window.register = async function(){

    try{

        const nama =
        document.getElementById("nama").value;

        const email =
        document.getElementById("email").value;

        const password =
        document.getElementById("password").value;

        const konfirmasi =
        document.getElementById("konfirmasi").value;


        if(

            nama=="" ||

            email=="" ||

            password==""

        ){

            alert("Semua data harus diisi.");

            return;

        }


        if(password != konfirmasi){

            alert("Konfirmasi password tidak sama.");

            return;

        }


        const userCredential =

        await createUserWithEmailAndPassword(

            auth,

            email,

            password

        );


        const user = userCredential.user;


        await setDoc(

            doc(

                db,

                "users",

                user.uid

            ),

            {

                uid : user.uid,

                nama : nama,

                email : email,

                role : "ibu",

                createdAt : new Date()

            }

        );


        alert("Registrasi berhasil.");

        window.location.href="login.html";

    }

    catch(error){

        alert(error.message);

    }

}

// =====================================
// LOGIN
// =====================================

async function login() {

    try {

        const email =
            document.getElementById("email").value.trim();

        const password =
            document.getElementById("password").value;

        // Validasi input
        if (email === "" || password === "") {

            alert("Email dan password harus diisi.");

            return;

        }

        // =====================================
        // LOGIN KE FIREBASE AUTHENTICATION
        // =====================================

        const userCredential =
            await signInWithEmailAndPassword(
                auth,
                email,
                password
            );

        const user = userCredential.user;

        console.log("✅ Authentication berhasil:", user.uid);


        // =====================================
        // AMBIL DATA USER DARI FIRESTORE
        // =====================================

        const userRef = doc(
            db,
            "users",
            user.uid
        );

        const snapshot =
            await getDoc(userRef);


        // =====================================
        // CEK DATA USER
        // =====================================

        if (!snapshot.exists()) {

            alert(
                "Login berhasil, tetapi data pengguna tidak ditemukan di Firestore."
            );

            return;

        }


        const data = snapshot.data();

        console.log("✅ Data user:", data);


        // =====================================
        // CEK ROLE
        // =====================================

        if (
            data.role === "bidan" ||
            data.role === "kader"
        ) {

            alert("Login kader/bidan berhasil.");

            window.location.href =
                "dashboard/dashboard-nakes.html";

        }

        else if (data.role === "ibu") {

            alert(
                "Akun ini adalah akun ibu hamil. Silakan gunakan Login Ibu Hamil."
            );

        }

        else {

            alert(
                "Role pengguna tidak dikenali."
            );

        }

    }

    catch (error) {

        console.error(
            "❌ Error login:",
            error
        );

        alert(
            "Login gagal: " +
            error.message
        );

    }

}


// =====================================
// EVENT BUTTON LOGIN
// =====================================

const loginButton =
    document.getElementById("loginButton");


if (loginButton) {

    loginButton.addEventListener(
        "click",
        login
    );

}