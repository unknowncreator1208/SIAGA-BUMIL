// =====================================
// SIAGA BUMIL
// auth.js
// =====================================

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


// =====================================
// REGISTER
// =====================================

window.register = async function () {

    try {

        const nama =
            document.getElementById("nama").value.trim();

        const email =
            document.getElementById("email").value.trim();

        const password =
            document.getElementById("password").value;

        const konfirmasi =
            document.getElementById("konfirmasi").value;


        // =====================================
        // VALIDASI
        // =====================================

        if (
            nama === "" ||
            email === "" ||
            password === ""
        ) {

            alert("Semua data harus diisi.");

            return;
        }


        if (password !== konfirmasi) {

            alert("Konfirmasi password tidak sama.");

            return;
        }


        // =====================================
        // BUAT AKUN FIREBASE AUTH
        // =====================================

        const userCredential =
            await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );


        const user =
            userCredential.user;


        // =====================================
        // SIMPAN DATA USER KE FIRESTORE
        // =====================================

        await setDoc(

            doc(
                db,
                "users",
                user.uid
            ),

            {

                uid: user.uid,

                nama: nama,

                email: email,

                role: "ibu",

                createdAt: new Date()

            }

        );


        alert("Registrasi berhasil.");

        window.location.href = "login.html";


    }

    catch (error) {

        console.error(
            "❌ Error registrasi:",
            error
        );

        alert(
            "Registrasi gagal: " +
            error.message
        );

    }

};


// =====================================
// LOGIN
// =====================================

async function login() {

    try {

        // =====================================
        // AMBIL INPUT
        // =====================================

        const email =
            document
                .getElementById("email")
                .value
                .trim();


        const password =
            document
                .getElementById("password")
                .value;


        // =====================================
        // VALIDASI
        // =====================================

        if (
            email === "" ||
            password === ""
        ) {

            alert(
                "Email dan password harus diisi."
            );

            return;
        }


        // =====================================
        // LOGIN FIREBASE AUTHENTICATION
        // =====================================

        console.log(
            "🔐 Mencoba login:",
            email
        );


        const userCredential =
            await signInWithEmailAndPassword(

                auth,

                email,

                password

            );


        const user =
            userCredential.user;


        console.log(
            "✅ Authentication berhasil:",
            user.uid
        );


        // =====================================
        // AMBIL DATA USER FIRESTORE
        // =====================================

        const userRef =
            doc(
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


        const data =
            snapshot.data();


        console.log(
            "✅ Data user:",
            data
        );


        // =====================================
        // CEK ROLE USER
        // =====================================

        if (data.role === "ibu") {

            // =================================
            // AKUN IBU HAMIL
            // =================================

            alert(
                "Login ibu hamil berhasil."
            );


            window.location.href =
                "dashboard/dashboard.html";


            return;
        }


        if (
            data.role === "kader" ||
            data.role === "bidan"
        ) {

            // =================================
            // AKUN NAKES / KADER
            // =================================

            alert(
                "Login nakes/kader berhasil."
            );


            window.location.href =
                "dashboard/dashboard-nakes.html";


            return;
        }


        // =====================================
        // ROLE TIDAK DIKENALI
        // =====================================

        alert(
            "Role akun tidak dikenali."
        );


    }

    catch (error) {

        console.error(
            "❌ Error login:",
            error
        );


        // =====================================
        // PESAN ERROR FIREBASE
        // =====================================

        if (
            error.code ===
            "auth/invalid-credential"
        ) {

            alert(
                "Email atau password salah."
            );

        }

        else if (
            error.code ===
            "auth/user-not-found"
        ) {

            alert(
                "Akun dengan email tersebut tidak ditemukan."
            );

        }

        else if (
            error.code ===
            "auth/wrong-password"
        ) {

            alert(
                "Password salah."
            );

        }

        else {

            alert(
                "Login gagal: " +
                error.message
            );

        }

    }

}


// =====================================
// TOMBOL LOGIN
// =====================================

const loginButton =
    document.getElementById(
        "loginButton"
    );


if (loginButton) {

    loginButton.addEventListener(
        "click",
        login
    );

}