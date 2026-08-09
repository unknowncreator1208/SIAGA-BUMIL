// ======================================
// SIAGA BUMIL
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


class UserService {

    // ======================================
    // SEMUA IBU HAMIL AKTIF
    // ======================================

    static async getSemuaIbu() {

        const snapshot = await getDocs(
            collection(db, "users")
        );

        const hasil = [];

        for (const userDoc of snapshot.docs) {

            const data = userDoc.data();

            // ==================================
            // HANYA AKUN IBU HAMIL
            // ==================================

            if (
                data.role !== "ibu" &&
                data.role !== "ibuHamil"
            ) {
                continue;
            }


            // ==================================
            // JIKA SUDAH SELESAI PERSALINAN
            // JANGAN MASUK KE IBU AKTIF
            // ==================================

            if (
                data.statusAkun ===
                "selesaiPersalinan"
            ) {
                continue;
            }


            // ==================================
            // STATUS RISIKO TERAKHIR
            // ==================================

            let statusRisiko = "-";
            let skor = "-";
            let tanggalSkrining = "-";


            // ==================================
            // AMBIL SKRINING TERAKHIR
            // ==================================

            try {

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


                if (!skrining.empty) {

                    const terakhir =
                        skrining.docs[0].data();


                    statusRisiko =
                        terakhir.status || "-";


                    skor =
                        terakhir.skor ?? "-";


                    if (terakhir.createdAt) {

                        const tanggal =
                            terakhir.createdAt
                                .toDate();

                        tanggalSkrining =
                            tanggal.toLocaleDateString(
                                "id-ID"
                            );

                    }

                }

            }

            catch (error) {

                console.error(
                    "Gagal mengambil skrining:",
                    error
                );

            }


            // ==================================
            // MASUKKAN DATA IBU AKTIF
            // ==================================

            hasil.push({

                uid: userDoc.id,

                ...data,

                statusAkun:
                    data.statusAkun ||
                    "aktif",

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

    static async getRiwayatPersalinan() {

        const snapshot = await getDocs(

            collection(
                db,
                "users"
            )

        );


        const hasil = [];


        snapshot.forEach(function(userDoc) {

            const data =
                userDoc.data();


            // ==================================
            // HANYA YANG SELESAI PERSALINAN
            // ==================================

            if (
                data.statusAkun ===
                "selesaiPersalinan"
            ) {

                hasil.push({

                    uid: userDoc.id,

                    ...data

                });

            }

        });


        // ==================================
        // URUTKAN DARI TERBARU
        // ==================================

        hasil.sort(function(a, b) {

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