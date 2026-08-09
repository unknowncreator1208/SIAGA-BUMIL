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

            // =====================================
            // IDENTITAS IBU
            // =====================================

            nama:
                document.getElementById("nama").value,

            nik:
                document.getElementById("nik").value,

            umur:
                Number(
                    document.getElementById("umur").value
                ),

            tanggalLahir:
                document.getElementById("tanggalLahir").value,

            usiaKehamilan:
                Number(
                    document.getElementById("usiaKehamilan").value
                ),

            jumlahKehamilan:
                Number(
                    document.getElementById("jumlahKehamilan").value
                ),

            beratBadan:
                Number(
                    document.getElementById("beratBadan").value
                ),

            tinggiBadan:
                Number(
                    document.getElementById("tinggiBadan").value
                ),

            lila:
                document.getElementById("lila").value,

            golonganDarah:
                document.getElementById("golonganDarah").value,

            nomorHP:
                document.getElementById("nomorHP").value,

            alamat:
                document.getElementById("alamat").value,

            hpl:
                document.getElementById("hpl").value,


            // =====================================
            // IDENTITAS SUAMI / PENDAMPING
            // =====================================

            pendamping: {

                nama:
                    document.getElementById(
                        "namaPendamping"
                    ).value,

                hubungan:
                    document.getElementById(
                        "hubunganPendamping"
                    ).value,

                nomorHP:
                    document.getElementById(
                        "nomorHPPendamping"
                    ).value,

                alamat:
                    document.getElementById(
                        "alamatPendamping"
                    ).value

            }

        };


        // =====================================
        // SIMPAN KE FIRESTORE
        // =====================================

        await setDoc(

            doc(
                db,
                "users",
                currentUser.uid
            ),

            {

                nama: profil.nama,

                email: currentUser.email,

                role: "ibuHamil",

                createdAt:
                    new Date().toISOString(),

                profil: profil

            },

            {
                merge: true
            }

        );


        alert("Profil berhasil disimpan.");

    }

    catch(error){

        console.error(
            "Gagal menyimpan profil:",
            error
        );

        alert(
            "Gagal menyimpan profil: " +
            error.message
        );

    }

};

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

            document.getElementById("jumlahKehamilan").value =
            data.profil.jumlahKehamilan || "";

            document.getElementById("beratBadan").value =
            data.profil.beratBadan || "";
            
            document.getElementById("tinggiBadan").value =
            data.profil.tinggiBadan || "";

            document.getElementById("lila").value =
            data.profil.lila || "";

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

            const pendamping = data.profil.pendamping || {};

document.getElementById("namaPendamping").value =
pendamping.nama || "";

document.getElementById("hubunganPendamping").value =
pendamping.hubungan || "";

document.getElementById("nomorHPPendamping").value =
pendamping.nomorHP || "";

document.getElementById("alamatPendamping").value =
pendamping.alamat || "";

        }

    }

}