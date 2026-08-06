// =====================================
// SIAGA BUMIL
// Profil Service
// =====================================

import {

    db,

    doc,

    getDoc,

    setDoc

}

from "../firebase.js";

class ProfilService{

    // ==========================
    // Ambil Profil
    // ==========================

    static async getProfil(uid){

        const snapshot = await getDoc(

            doc(db,"users",uid)

        );

        if(snapshot.exists()){

            return snapshot.data().profil;

        }

        return null;

    }

    // ==========================
    // Simpan Profil
    // ==========================

    static async simpanProfil(uid,data){

        await setDoc(

            doc(db,"users",uid),

            {

                profil:data

            },

            {

                merge:true

            }

        );

    }

}

export default ProfilService;
