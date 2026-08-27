// ======================================
// User Service
// ======================================

import {

    db,
    collection,
    getDocs,
    query,
    orderBy,
    limit

} from "../firebase.js";


class UserService{

    // ======================================
    // SEMUA IBU HAMIL AKTIF
    // ======================================

    static async getSemuaIbu(){

        const snapshot = await getDocs(

            collection(db,"users")

        );

        const hasil = [];

        for(const userDoc of snapshot.docs){

            const data = userDoc.data();

            // Hanya ibu hamil
            if(

                data.role != "ibu" &&

                data.role != "ibuHamil"

            ){

                continue;

            }


            // ==================================
            // JANGAN TAMPILKAN YANG SUDAH
            // SELESAI PERSALINAN
            // ==================================

            if(

                data.statusAkun ==

                "selesaiPersalinan"

            ){

                continue;

            }


            let statusRisiko = "-";

            let skor = "-";

            let tanggalSkrining = "-";


            // ==================================
            // AMBIL SKRINING TERAKHIR
            // ==================================

            try{

                const q = query(

                    collection(

                        db,

                        "users",

                        userDoc.id,

                        "skrining"

                    ),

                    orderBy(

                        "createdAt",

                        "desc"

                    ),

                    limit(1)

                );


                const skrining =

                await getDocs(q);


                console.log(
    "UID:",
    userDoc.id,
    "Jumlah skrining:",
    skrining.size
);

                if(!skrining.empty){

                    const terakhir =

                    skrining.docs[0].data();


                    statusRisiko =

                    terakhir.status || "-";


                    skor =

                    terakhir.skor ?? "-";


                    if(terakhir.createdAt){

                        tanggalSkrining =

                        terakhir.createdAt

                        .toDate()

                        .toLocaleDateString(

                            "id-ID"

                        );

                    }

                }

            }

            catch(error){

                console.log(

                    "Gagal mengambil skrining:",

                    error

                );

            }


            // ==================================
            // MASUKKAN DATA
            // ==================================

            hasil.push({

                uid: userDoc.id,

                ...data,

                statusRisikoTerakhir:

                    statusRisiko,

                skorTerakhir:

                    skor,

                tanggalSkrining:

                    tanggalSkrining

            });

        }


        return hasil;

    }


    // ======================================
    // AMBIL SEMUA RIWAYAT PERSALINAN
    // ======================================

    static async getRiwayatPersalinan(){

        const snapshot = await getDocs(

            collection(db,"users")

        );


        const hasil = [];


        snapshot.forEach((userDoc)=>{

            const data = userDoc.data();


            if(

                data.statusAkun ==

                "selesaiPersalinan"

            ){

                hasil.push({

                    uid: userDoc.id,

                    ...data

                });

            }

        });


        // Urutkan terbaru
        hasil.sort(function(a,b){

            return (

                new Date(

                    b.tanggalSelesaiPersalinan || 0

                )

                -

                new Date(

                    a.tanggalSelesaiPersalinan || 0

                )

            );

        });


        return hasil;

    }

}


export default UserService;