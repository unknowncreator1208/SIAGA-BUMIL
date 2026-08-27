// ======================================
// SIAGA BUMIL
// PETUGAS SERVICE
// ======================================

import {

    db,

    collection,

    getDocs,

    query,

    where,

    doc,

    setDoc,

    deleteDoc

} from "../firebase.js";


class PetugasService {


    // ==================================
    // AMBIL SEMUA PETUGAS
    // ==================================

    static async getSemuaPetugas() {


        const q = query(

            collection(db, "users"),

            where(

                "role",

                "in",

                [

                    "bidan",

                    "kader"

                ]

            )

        );


        const snapshot =

            await getDocs(q);


        const hasil = [];


        snapshot.forEach(

            function(item) {


                hasil.push({

                    uid:
                        item.id,

                    ...item.data()

                });

            }

        );


        return hasil;

    }


    // ==================================
    // SIMPAN PETUGAS
    // ==================================

    static async simpanPetugas(

        uid,

        data

    ) {


        if (!uid) {

            throw new Error(
                "UID petugas tidak ditemukan."
            );

        }


        await setDoc(

            doc(

                db,

                "users",

                uid

            ),

            {

                nama:
                    data.nama,

                email:
                    data.email,

                role:
                    data.role,

                createdAt:
                    data.createdAt ||

                    new Date()
                        .toISOString()

            },

            {

                merge:
                    true

            }

        );

    }


    // ==================================
    // HAPUS PETUGAS
    // ==================================

    static async hapusPetugas(uid) {


        if (!uid) {

            throw new Error(
                "UID petugas tidak ditemukan."
            );

        }


        await deleteDoc(

            doc(

                db,

                "users",

                uid

            )

        );

    }

}


export default PetugasService;