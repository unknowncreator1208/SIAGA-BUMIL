import UserService from "./services/userService.js";

// ======================================
// SIAGA BUMIL
// RIWAYAT PERSALINAN
// ======================================

import UserService
    from "./services/userService.js";


// ======================================
// DATA GLOBAL
// ======================================

let semuaData = [];


// ======================================
// LOAD DATA
// ======================================

async function loadRiwayat() {

    try {

        semuaData =
            await UserService
                .getRiwayatPersalinan();


        tampilkanData(
            semuaData
        );

    }

    catch (error) {

        console.error(
            "Gagal mengambil riwayat:",
            error
        );

        alert(
            "Gagal mengambil data riwayat persalinan."
        );

    }

}


// ======================================
// TAMPILKAN DATA
// ======================================

function tampilkanData(data) {

    const tbody =
        document.querySelector(
            "#tabelPersalinan tbody"
        );


    if (!tbody) {

        console.error(
            "tbody tabelPersalinan tidak ditemukan."
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
                    colspan="7"
                    style="text-align:center;"
                >

                    📋 Belum ada
                    riwayat persalinan.

                </td>

            </tr>

        `;

        return;

    }


    // ==================================
    // TAMPILKAN DATA
    // ==================================

    data.forEach(
        function(item, index) {

            const profil =
                item.profil || {};


            const row =
                tbody.insertRow();


            // ==========================
            // NO
            // ==========================

            row.insertCell(0).innerHTML =
                index + 1;


            // ==========================
            // NAMA
            // ==========================

            row.insertCell(1).innerHTML =
                profil.nama || "-";


            // ==========================
            // UMUR
            // ==========================

            row.insertCell(2).innerHTML =
                profil.umur
                    ? profil.umur + " Tahun"
                    : "-";


            // ==========================
            // USIA KEHAMILAN
            // ==========================

            row.insertCell(3).innerHTML =

                profil.usiaKehamilan

                    ?

                    profil.usiaKehamilan
                    + " Minggu"

                    :

                    "-";


            // ==========================
            // TANGGAL PERSALINAN
            // ==========================

            let tanggal =
                item.tanggalSelesaiPersalinan
                || "-";


            if (
                item.tanggalSelesaiPersalinan
                instanceof Date
            ) {

                tanggal =
                    item.tanggalSelesaiPersalinan
                        .toLocaleDateString(
                            "id-ID"
                        );

            }


            row.insertCell(4).innerHTML =
                tanggal;


            // ==========================
            // KETERANGAN
            // ==========================

            row.insertCell(5).innerHTML =
                item.keteranganPersalinan
                || "-";


            // ==========================
            // AKSI
            // ==========================

            row.insertCell(6).innerHTML = `

                <button
                    class="detail-btn"
                    onclick="lihatDetail('${item.uid}')"
                >

                    Detail

                </button>

            `;

        }
    );

}


// ======================================
// SEARCH
// ======================================

const search =
    document.getElementById(
        "searchPersalinan"
    );


if (search) {

    search.addEventListener(
        "input",
        function() {

            const keyword =
                this.value
                    .toLowerCase()
                    .trim();


            const hasil =
                semuaData.filter(
                    function(item) {

                        const profil =
                            item.profil || {};


                        const nama =
                            (
                                profil.nama
                                || ""
                            )
                            .toLowerCase();


                        return nama.includes(
                            keyword
                        );

                    }
                );


            tampilkanData(
                hasil
            );

        }
    );

}


// ======================================
// DETAIL
// ======================================

window.lihatDetail =
    function(uid) {

        if (!uid) {

            alert(
                "UID ibu tidak ditemukan."
            );

            return;

        }


        window.location.href =
            "detail-ibu.html?uid="
            + encodeURIComponent(uid);

    };


// ======================================
// LOGOUT
// ======================================

const btnLogout =
    document.getElementById(
        "btnLogout"
    );


if (btnLogout) {

    btnLogout.addEventListener(
        "click",
        async function() {

            try {

                const {
                    auth
                } = await import(
                    "./firebase.js"
                );


                const {
                    signOut
                } = await import(
                    "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js"
                );


                await signOut(auth);


                window.location.href =
                    "../login.html";

            }

            catch (error) {

                console.error(error);

                alert(
                    "Gagal logout."
                );

            }

        }
    );

}


// ======================================
// MULAI
// ======================================

loadRiwayat();