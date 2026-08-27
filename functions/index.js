const {
    onCall,
    HttpsError
} = require("firebase-functions/v2/https");

const {
    getAuth
} = require("firebase-admin/auth");

const {
    getFirestore,
    FieldValue
} = require("firebase-admin/firestore");

const {
    initializeApp
} = require("firebase-admin/app");


initializeApp();


const db = getFirestore();


// ======================================
// BUAT AKUN BIDAN / KADER
// ======================================

exports.tambahPetugas = onCall(

    async (request) => {

        // ==================================
        // CEK LOGIN
        // ==================================

        if (!request.auth) {

            throw new HttpsError(
                "unauthenticated",
                "Anda harus login terlebih dahulu."
            );

        }


        // ==================================
        // CEK DATA PEMBUAT
        // ==================================

        const pembuatUID =
            request.auth.uid;


        const pembuatSnapshot =
            await db
                .collection("users")
                .doc(pembuatUID)
                .get();


        if (!pembuatSnapshot.exists) {

            throw new HttpsError(
                "permission-denied",
                "Data akun Nakes tidak ditemukan."
            );

        }


        const pembuatData =
            pembuatSnapshot.data();


        // ==================================
        // HANYA NAKES YANG BOLEH
        // ==================================

        const rolePembuat =
            pembuatData.role;


        if (
            rolePembuat !== "nakes" &&
            rolePembuat !== "bidan" &&
            rolePembuat !== "admin"
        ) {

            throw new HttpsError(
                "permission-denied",
                "Anda tidak memiliki izin membuat akun petugas."
            );

        }


        // ==================================
        // AMBIL DATA
        // ==================================

        const {
            nama,
            email,
            password,
            role
        } = request.data;


        // ==================================
        // VALIDASI
        // ==================================

        if (!nama || !nama.trim()) {

            throw new HttpsError(
                "invalid-argument",
                "Nama wajib diisi."
            );

        }


        if (!email || !email.trim()) {

            throw new HttpsError(
                "invalid-argument",
                "Email wajib diisi."
            );

        }


        if (!password) {

            throw new HttpsError(
                "invalid-argument",
                "Password wajib diisi."
            );

        }


        if (password.length < 6) {

            throw new HttpsError(
                "invalid-argument",
                "Password minimal 6 karakter."
            );

        }


        if (
            role !== "bidan" &&
            role !== "kader"
        ) {

            throw new HttpsError(
                "invalid-argument",
                "Role hanya boleh bidan atau kader."
            );

        }


        // ==================================
        // BUAT FIREBASE AUTH
        // ==================================

        let userRecord;


        try {

            userRecord =
                await getAuth()
                    .createUser({

                        email:
                            email.trim(),

                        password:
                            password,

                        displayName:
                            nama.trim()

                    });

        }

        catch (error) {

            console.error(
                "Gagal membuat Authentication:",
                error
            );


            if (
                error.code ===
                "auth/email-already-exists"
            ) {

                throw new HttpsError(
                    "already-exists",
                    "Email tersebut sudah digunakan."
                );

            }


            throw new HttpsError(
                "internal",
                error.message
            );

        }


        // ==================================
        // SIMPAN PROFIL PETUGAS
        // ==================================

        try {

            await db
                .collection("users")
                .doc(userRecord.uid)
                .set({

                    nama:
                        nama.trim(),

                    email:
                        email.trim(),

                    role:
                        role,

                    statusAkun:
                        "aktif",

                    createdAt:
                        FieldValue.serverTimestamp(),

                    createdBy:
                        pembuatUID

                });

        }

        catch (error) {

            // ==================================
            // ROLLBACK AUTH JIKA FIRESTORE GAGAL
            // ==================================

            try {

                await getAuth()
                    .deleteUser(
                        userRecord.uid
                    );

            }

            catch (rollbackError) {

                console.error(
                    "Rollback gagal:",
                    rollbackError
                );

            }


            console.error(
                "Gagal menyimpan Firestore:",
                error
            );


            throw new HttpsError(
                "internal",
                "Akun berhasil dibuat tetapi data petugas gagal disimpan."
            );

        }


        // ==================================
        // HASIL
        // ==================================

        return {

            success: true,

            uid:
                userRecord.uid,

            nama:
                nama.trim(),

            email:
                email.trim(),

            role:
                role

        };

    }

);