// ======================================
// SIAGA BUMIL
// skrining-firebase.js
// ======================================

import {

    auth,
    db,
    doc,
    getDoc

} from "./firebase.js";


import SkriningService
    from "./services/skriningService.js";


import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";


let currentUser = null;


// ======================================
// AUTH
// ======================================

onAuthStateChanged(
    auth,
    async function(user){

        if(!user){

            window.location.href =
                "../login.html";

            return;

        }

        currentUser = user;

        await loadProfil();

    }
);


// ======================================
// LOAD PROFIL
// ======================================

async function loadProfil(){

    try{

        if(!currentUser){

            return;

        }


        const snapshot =
            await getDoc(

                doc(
                    db,
                    "users",
                    currentUser.uid
                )

            );


        if(!snapshot.exists()){

            console.log(
                "Data user tidak ditemukan."
            );

            return;

        }


        const data =
            snapshot.data();


        const profil =
            data.profil || {};


        // ==================================
        // FUNGSI AMAN
        // ==================================

        function isiInput(
            id,
            value
        ){

            const element =
                document.getElementById(id);


            if(element){

                element.value =
                    value ?? "";

            }

        }


        // ==================================
        // IDENTITAS IBU
        // ==================================

        isiInput(
            "nama",
            profil.nama
        );


        isiInput(
            "umur",
            profil.umur
        );


        isiInput(
            "usiaKehamilan",
            profil.usiaKehamilan
        );


        // ==================================
        // DATA KEHAMILAN
        // ==================================

        isiInput(
            "jumlahKehamilan",
            profil.jumlahKehamilan
        );


        // ==================================
        // ANTROPOMETRI
        // ==================================

        isiInput(
            "beratBadan",
            profil.beratBadan
        );


        isiInput(
            "tinggiBadan",
            profil.tinggiBadan
        );


        isiInput(
            "lila",
            profil.lila
        );


        // ==================================
        // HITUNG IMT
        // ==================================

        const berat =
            Number(
                profil.beratBadan
            );


        const tinggi =
            Number(
                profil.tinggiBadan
            );


        let imt = "";


        if(
            berat > 0 &&
            tinggi > 0
        ){

            imt = (

                berat /
                Math.pow(
                    tinggi / 100,
                    2
                )

            ).toFixed(1);

        }


        isiInput(
            "imt",
            imt
        );


        console.log(
            "✅ Profil berhasil dimuat ke skrining."
        );

    }

    catch(error){

        console.error(
            "Gagal memuat profil:",
            error
        );

    }

}


// ======================================
// SIMPAN HASIL SKRINING
// ======================================

window.simpanHasilSkrining =
async function(data){

    if(!currentUser){

        alert(
            "User belum login."
        );

        return;

    }


    try{

        await
            SkriningService.simpanSkrining(

                currentUser.uid,
                data

            );


        console.log(
            "✅ Skrining berhasil disimpan"
        );

    }

    catch(error){

        console.error(error);

        alert(
            error.message
        );

    }

};