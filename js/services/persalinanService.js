// ======================================
// SIAGA BUMIL
// Persalinan Service
// ======================================

import {
    db,
    doc,
    updateDoc
} from "../firebase.js";


class PersalinanService {


    // ======================================
    // TANDAI SELESAI PERSALINAN
    // ======================================

    static async selesaiPersalinan(
        uid,
        tanggalPersalinan,
        keterangan
    ) {

        if (!uid) {

            throw new Error(
                "UID ibu hamil tidak ditemukan."
            );

        }


        if (!tanggalPersalinan) {

            throw new Error(
                "Tanggal persalinan wajib diisi."
            );

        }


        await updateDoc(

            doc(
                db,
                "users",
                uid
            ),

            {

                statusAkun:
                    "selesaiPersalinan",

                tanggalSelesaiPersalinan:
                    tanggalPersalinan,

                keteranganPersalinan:
                    keterangan || "",

                updatedAt:
                    new Date().toISOString()

            }

        );

    }

}


export default PersalinanService;