// ======================================
// SIAGA BUMIL
// KELOLA AKUN PETUGAS
// ======================================


import {

    auth,

    secondaryAuth,

    createUserWithEmailAndPassword

} from "./firebase.js";


import {

    onAuthStateChanged,

    signOut

} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";


import PetugasService

from "./services/petugasServices.js";


// ======================================
// VARIABEL
// ======================================

let semuaPetugas = [];


// ======================================
// ELEMENT
// ======================================

const namaInput =
    document.getElementById("nama");


const emailInput =
    document.getElementById("email");


const passwordInput =
    document.getElementById("password");


const roleInput =
    document.getElementById("role");


// ======================================
// CEK LOGIN
// ======================================

onAuthStateChanged(

    auth,

    async function(user) {


        if (!user) {

            window.location.href =
                "../login.html";

            return;

        }


        console.log(
            "Nakes login:",
            user.email
        );


        await loadPetugas();

    }

);


// ======================================
// LOAD PETUGAS
// ======================================

async function loadPetugas() {

    try {


        semuaPetugas =

            await PetugasService
                .getSemuaPetugas();


        tampilkanPetugas(
            semuaPetugas
        );


    }

    catch (error) {


        console.error(
            "Gagal mengambil data petugas:",
            error
        );


        alert(
            "Gagal mengambil daftar petugas."
        );

    }

}


// ======================================
// TAMPILKAN PETUGAS
// ======================================

function tampilkanPetugas(data) {


    const tbody =

        document.querySelector(
            "#tabelPetugas tbody"
        );


    if (!tbody) {

        console.error(
            "Tabel petugas tidak ditemukan."
        );

        return;

    }


    tbody.innerHTML = "";


    // ==================================
    // BELUM ADA DATA
    // ==================================

    if (data.length === 0) {


        tbody.innerHTML = `

            <tr>

                <td
                    colspan="5"
                    style="text-align:center;"
                >

                    Belum ada data petugas.

                </td>

            </tr>

        `;


        return;

    }


    // ==================================
    // TAMPILKAN DATA
    // ==================================

    data.forEach(

        function(petugas, index) {


            const nama =

                petugas.nama ||

                petugas.profil?.nama ||

                "-";


            const email =

                petugas.email ||

                "-";


            const role =

                petugas.role ||

                "-";


            const roleText =

                role === "bidan"

                    ? "Bidan"

                    : "Kader";


            const row =

                document.createElement(
                    "tr"
                );


            row.innerHTML = `

                <td>
                    ${index + 1}
                </td>

                <td>
                    ${nama}
                </td>

                <td>
                    ${email}
                </td>

                <td>
                    ${roleText}
                </td>

                <td>

                    <button

                        type="button"

                        onclick="
                            hapusPetugas(
                                '${petugas.uid}'
                            )
                        "

                        style="
                            background:#E53935;
                            color:white;
                            border:none;
                            padding:8px 12px;
                            border-radius:8px;
                            cursor:pointer;
                        "
                    >

                        🗑 Hapus

                    </button>

                </td>

            `;


            tbody.appendChild(row);

        }

    );

}


// ======================================
// TAMBAH PETUGAS
// ======================================

window.tambahPetugas =

    async function () {


        // ==================================
        // AMBIL DATA
        // ==================================

        const nama =

            namaInput.value.trim();


        const email =

            emailInput.value.trim();


        const password =

            passwordInput.value;


        const role =

            roleInput.value;


        // ==================================
        // VALIDASI NAMA
        // ==================================

        if (!nama) {

            alert(
                "Nama petugas wajib diisi."
            );

            return;

        }


        // ==================================
        // VALIDASI EMAIL
        // ==================================

        if (!email) {

            alert(
                "Email petugas wajib diisi."
            );

            return;

        }


        // ==================================
        // VALIDASI PASSWORD
        // ==================================

        if (!password) {

            alert(
                "Password wajib diisi."
            );

            return;

        }


        if (password.length < 6) {

            alert(
                "Password minimal 6 karakter."
            );

            return;

        }


        // ==================================
        // VALIDASI ROLE
        // ==================================

        if (

            role !== "bidan" &&

            role !== "kader"

        ) {

            alert(
                "Role petugas tidak valid."
            );

            return;

        }


        // ==================================
        // KONFIRMASI
        // ==================================

        const konfirmasi =

            confirm(

                "Buat akun " +

                role +

                " dengan email:\n\n" +

                email +

                "?"

            );


        if (!konfirmasi) {

            return;

        }


        // ==================================
        // TOMBOL
        // ==================================

        const tombol =

            document.querySelector(

                'button[onclick="tambahPetugas()"]'

            );


        if (tombol) {

            tombol.disabled = true;

            tombol.innerText =
                "Membuat akun...";

        }


        try {


            // ==================================
            // BUAT FIREBASE AUTH
            // MENGGUNAKAN SECONDARY AUTH
            // ==================================

            const credential =

                await createUserWithEmailAndPassword(

                    secondaryAuth,

                    email,

                    password

                );


            const userBaru =

                credential.user;


            console.log(

                "✅ Authentication berhasil:",

                userBaru.uid

            );


            // ==================================
            // SIMPAN DATA PETUGAS
            // ==================================

            await PetugasService
                .simpanPetugas(

                    userBaru.uid,

                    {

                        nama:
                            nama,

                        email:
                            email,

                        role:
                            role,

                        createdAt:
                            new Date()
                            .toISOString()

                    }

                );


            // ==================================
            // BERHASIL
            // ==================================

            alert(

                "✅ Akun berhasil dibuat!\n\n" +

                "Nama: " +

                nama +

                "\n" +

                "Email: " +

                email +

                "\n" +

                "Role: " +

                role

            );


            // ==================================
            // RESET FORM
            // ==================================

            namaInput.value = "";

            emailInput.value = "";

            passwordInput.value = "";

            roleInput.value = "bidan";


            // ==================================
            // UPDATE TABEL
            // ==================================

            await loadPetugas();


        }

        catch (error) {


            console.error(

                "Gagal membuat akun:",

                error

            );


            let pesan =

                "Gagal membuat akun.";


            // ==================================
            // ERROR FIREBASE
            // ==================================

            if (

                error.code ===

                "auth/email-already-in-use"

            ) {

                pesan =

                    "Email tersebut sudah digunakan.";

            }


            else if (

                error.code ===

                "auth/invalid-email"

            ) {

                pesan =

                    "Format email tidak valid.";

            }


            else if (

                error.code ===

                "auth/weak-password"

            ) {

                pesan =

                    "Password terlalu lemah. Minimal 6 karakter.";

            }


            else if (

                error.code ===

                "auth/operation-not-allowed"

            ) {

                pesan =

                    "Login Email/Password belum diaktifkan di Firebase Authentication.";

            }


            else if (

                error.message

            ) {

                pesan =

                    error.message;

            }


            alert(pesan);

        }


        finally {


            if (tombol) {

                tombol.disabled = false;

                tombol.innerText =
                    "➕ Tambah Akun";

            }

        }

    };


// ======================================
// HAPUS PETUGAS
// ======================================

window.hapusPetugas =

    async function (uid) {


        if (!uid) {

            alert(
                "UID petugas tidak ditemukan."
            );

            return;

        }


        const konfirmasi =

            confirm(

                "Apakah Anda yakin ingin menghapus " +

                "data petugas ini dari SIAGA BUMIL?"

            );


        if (!konfirmasi) {

            return;

        }


        try {


            await PetugasService
                .hapusPetugas(uid);


            alert(

                "Data petugas berhasil dihapus."

            );


            await loadPetugas();


        }

        catch (error) {


            console.error(

                "Gagal menghapus petugas:",

                error

            );


            alert(

                "Gagal menghapus petugas:\n" +

                error.message

            );

        }

    };


// ======================================
// LOAD AWAL
// ======================================

console.log(
    "✅ kelola-akun.js berhasil dimuat"
);