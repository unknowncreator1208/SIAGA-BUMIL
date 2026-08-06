// ======================================
// SIAGA BUMIL
// skrining-firebase.js
// ======================================
import {

    auth,

    db,

    doc,

    getDoc

}

from "./firebase.js";

import SkriningService from "./services/skriningService.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";

let currentUser = null;

// ======================================
// AUTH
// ======================================

onAuthStateChanged(auth, async (user) => {

    if (!user) {

        window.location.href = "../login.html";
        return;

    }

    currentUser = user;

    await loadProfil();

});

async function loadProfil(){

    try{

        const snapshot = await getDoc(

            doc(

                db,

                "users",

                currentUser.uid

            )

        );

        if(!snapshot.exists()) return;

        const data = snapshot.data();

        if(!data.profil) return;

        document.getElementById("nama").value =

        data.profil.nama || "";

        document.getElementById("umur").value =

        data.profil.umur || "";

        document.getElementById("usiaKehamilan").value =

        data.profil.usiaKehamilan || "";

        document.getElementById("nomorHP").value =

        data.profil.nomorHP || "";

        document.getElementById("alamat").value =

        data.profil.alamat || "";

    }

    catch(error){

        console.error(error);

    }

}

// ======================================
// SIMPAN HASIL SKRINING
// ======================================

window.simpanHasilSkrining = async function (data) {

    if (!currentUser) {

        alert("User belum login.");
        return;

    }

    try {

        await SkriningService.simpanSkrining(

            currentUser.uid,
            data

        );

        console.log("✅ Skrining berhasil disimpan");

    }

    catch (error) {

        console.error(error);

        alert(error.message);

    }

}