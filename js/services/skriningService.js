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

}

from "../firebase.js";

class SkriningService{

    // =====================================
    // Simpan Skrining
    // =====================================

    static async simpanSkrining(uid,data){

        // Simpan ke riwayat skrining

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

        // Update ringkasan user

        await updateDoc(

            doc(

                db,

                "users",

                uid

            ),

            {

                statusRisikoTerakhir: data.status,

                skorTerakhir: data.skor,

                tanggalSkriningTerakhir: new Date(),

                usiaKehamilan: data.usiaKehamilan

            }

        );

    }

    // =====================================
    // Ambil Riwayat
    // =====================================

    static async getRiwayat(uid){

        const q = query(

            collection(

                db,

                "users",

                uid,

                "skrining"

            ),

            orderBy("createdAt","desc")

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