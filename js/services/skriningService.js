// =====================================
// SIAGA BUMIL
// Skrining Service
// =====================================

import {

    db,
    collection,
    addDoc,
    getDocs,
    query,
    orderBy,
    serverTimestamp,
    doc,
    updateDoc

} from "../firebase.js";


class SkriningService{


    // =====================================
    // SIMPAN SKRINING
    // =====================================

    static async simpanSkrining(uid, data){

        // ---------------------------------
        // Simpan ke riwayat skrining
        // ---------------------------------

        await addDoc(

            collection(

                db,
                "users",
                uid,
                "skrining"

            ),

            {

                ...data,

                createdAt: serverTimestamp()

            }

        );


        // ---------------------------------
        // Update ringkasan user
        // ---------------------------------

        await updateDoc(

            doc(

                db,
                "users",
                uid

            ),

            {

                statusRisikoTerakhir:
                    data.status || "-",

                skorTerakhir:
                    data.skor ?? 0,

                tanggalSkriningTerakhir:
                    serverTimestamp(),

                usiaKehamilan:
                    data.usiaKehamilan ?? null,

                jumlahKehamilan:
                    data.jumlahKehamilan ?? null,

                beratBadan:
                    data.beratBadan ?? null,

                tinggiBadan:
                    data.tinggiBadan ?? null,

                lila:
                    data.lila ?? null,

                imt:
                    data.imt ?? null

            }

        );

    }


    // =====================================
    // AMBIL RIWAYAT
    // =====================================

    static async getRiwayat(uid){

        const q = query(

            collection(

                db,
                "users",
                uid,
                "skrining"

            ),

            orderBy(
                "createdAt",
                "desc"
            )

        );


        const snapshot = await getDocs(q);

        const hasil = [];


        snapshot.forEach((docItem)=>{

            hasil.push({

                id: docItem.id,

                ...docItem.data()

            });

        });


        return hasil;

    }

}


export default SkriningService;