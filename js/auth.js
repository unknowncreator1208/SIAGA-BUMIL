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

window.login = async function(){

    try{

        const email =
        document.getElementById("email").value;

        const password =
        document.getElementById("password").value;

        // Login ke Firebase Authentication
        const userCredential = await signInWithEmailAndPassword(

            auth,

            email,

            password

        );

        const user = userCredential.user;

        // Ambil data user dari Firestore
        const snapshot = await getDoc(

            doc(

                db,

                "users",

                user.uid

            )

        );

        if(!snapshot.exists()){

            alert("Data pengguna tidak ditemukan.");

            return;

        }

        const data = snapshot.data();

        alert("Login berhasil.");

        // Arahkan sesuai role 
        if(

            data.role == "bidan" ||

            data.role == "kader"

        ){

            window.location.href = "dashboard/dashboard-nakes.html";

        }

        else{

            window.location.href = "dashboard/dashboard.html";

        }

    }

    catch(error){

        alert("Login gagal");

        alert(error.message);

    }

}