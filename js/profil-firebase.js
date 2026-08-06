import {

    auth,

    db,

    doc,

    setDoc,

    getDoc

} from "./firebase.js";

import {

    onAuthStateChanged

}

from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";

let currentUser = null;

onAuthStateChanged(auth,function(user){

    if(user){

        currentUser = user;

        loadProfil();

    }

    else{

        window.location.href="../login.html";

    }

});

// ======================================
// Simpan Profil
// ======================================

window.simpanProfil = async function(){

    if(currentUser == null){

        alert("User belum login.");

        return;

    }

    try{

        const profil = {

            nama : document.getElementById("nama").value,

            nik : document.getElementById("nik").value,

            umur : Number(document.getElementById("umur").value),

            tanggalLahir : document.getElementById("tanggalLahir").value,

            usiaKehamilan : Number(document.getElementById("usiaKehamilan").value),

            golonganDarah : document.getElementById("golonganDarah").value,

            nomorHP : document.getElementById("nomorHP").value,

            alamat : document.getElementById("alamat").value,

            hpl : document.getElementById("hpl").value

        };

        await setDoc(
    doc(db, "users", currentUser.uid),
    {
        nama: profil.nama,
        email: currentUser.email,
        role: "ibuHamil",
        createdAt: new Date().toISOString(),
        profil: profil
    },
    {
        merge: true
    }
);

        alert("Profil berhasil disimpan.");

    }

    catch(error){

        console.error(error);

        alert(error.message);

    }

}

// ======================================
// Load Profil
// ======================================

async function loadProfil(){

    if(currentUser == null){

        return;

    }

    const snapshot = await getDoc(

        doc(db,"users",currentUser.uid)

    );

    if(snapshot.exists()){

        const data = snapshot.data();

        if(data.profil){

            document.getElementById("nama").value =
            data.profil.nama || "";

            document.getElementById("nik").value =
            data.profil.nik || "";

            document.getElementById("umur").value =
            data.profil.umur || "";

            document.getElementById("usiaKehamilan").value =
            data.profil.usiaKehamilan || "";

            document.getElementById("golonganDarah").value =
            data.profil.golonganDarah || "";

            document.getElementById("nomorHP").value =
            data.profil.nomorHP || "";

            document.getElementById("alamat").value =
            data.profil.alamat || "";

            document.getElementById("tanggalLahir").value =
            data.profil.tanggalLahir || "";

            document.getElementById("hpl").value =
            data.profil.hpl || "";

        }

    }

}