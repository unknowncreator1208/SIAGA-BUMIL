// ======================================
// Dashboard Nakes
// ======================================

import { auth } from "./firebase.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";

import UserService from "./services/UserService.js";


// ======================================
// VARIABLE
// ======================================

let semuaDataIbu = [];

let chartRisiko = null;


// ======================================
// CEK LOGIN
// ======================================

onAuthStateChanged(auth, async (user) => {

    if (!user) {

        window.location.href = "../login.html";

        return;

    }

    await tampilkanData();

});


// ======================================
// TAMPILKAN DATA
// ======================================

async function tampilkanData() {

    try {

        // Ambil semua data ibu hamil
        semuaDataIbu = await UserService.getSemuaIbu();

        console.log(
    "DATA LENGKAP IBU HAMIL:",
    JSON.stringify(semuaDataIbu, null, 2)
);


        // ==================================
        // SORTIR BERDASARKAN RISIKO
        // ==================================

        semuaDataIbu.sort((a, b) => {

            const urutan = {

                "🔴 Risiko Tinggi": 0,

                "🟡 Risiko Sedang": 1,

                "🟢 Risiko Rendah": 2,

                "-": 3

            };

            return (
                urutan[a.statusRisikoTerakhir] ?? 3
            ) -
            (
                urutan[b.statusRisikoTerakhir] ?? 3
            );

        });


        // ==================================
        // TAMPILKAN TABEL
        // ==================================

        renderTabel(semuaDataIbu);


        // ==================================
        // TAMPILKAN PRIORITAS
        // ==================================

        tampilkanPrioritas(semuaDataIbu);


    }

    catch (error) {

        console.error(
            "Gagal mengambil data ibu:",
            error
        );

        alert(
            "Gagal mengambil data ibu hamil."
        );

    }

}


// ======================================
// DETAIL IBU
// ======================================

window.detailIbu = function(uid) {

    window.location.href =
        "../pages/detail-ibu.html?uid=" + uid;

};


// ======================================
// BUAT GRAFIK RISIKO
// ======================================

function buatGrafik(
    rendah,
    sedang,
    tinggi
) {

    const canvas =
        document.getElementById(
            "grafikRisiko"
        );


    // Jika canvas tidak ditemukan
    if (!canvas) {

        console.warn(
            "Element grafikRisiko tidak ditemukan."
        );

        return;

    }


    // Hapus grafik lama
    if (chartRisiko) {

        chartRisiko.destroy();

    }


    chartRisiko = new Chart(
        canvas,
        {

            type: "doughnut",

            data: {

                labels: [

                    "Risiko Rendah",

                    "Risiko Sedang",

                    "Risiko Tinggi"

                ],

                datasets: [{

                    data: [

                        rendah,

                        sedang,

                        tinggi

                    ],

                    backgroundColor: [

                        "#4CAF50",

                        "#FFC107",

                        "#F44336"

                    ]

                }]

            },

            options: {

                responsive: true,

                plugins: {

                    legend: {

                        position: "bottom"

                    }

                }

            }

        }

    );

}


// ======================================
// RENDER TABEL
// ======================================

function renderTabel(data) {

    const tbody =
        document.querySelector(
            "#tabelIbu tbody"
        );


    if (!tbody) {

        console.error(
            "Element #tabelIbu tbody tidak ditemukan."
        );

        return;

    }


    tbody.innerHTML = "";


    let rendah = 0;

    let sedang = 0;

    let tinggi = 0;


    // ==================================
    // JIKA TIDAK ADA DATA
    // ==================================

    if (!data || data.length === 0) {

        tbody.innerHTML = `

            <tr>

                <td
                    colspan="6"
                    style="text-align:center;"
                >

                    Belum ada data ibu hamil.

                </td>

            </tr>

        `;


        document.getElementById(
            "totalIbu"
        ).innerHTML = "0";


        document.getElementById(
            "rendah"
        ).innerHTML = "0";


        document.getElementById(
            "sedang"
        ).innerHTML = "0";


        document.getElementById(
            "tinggi"
        ).innerHTML = "0";


        buatGrafik(0, 0, 0);

        return;

    }


    // ==================================
    // TAMPILKAN DATA
    // ==================================

    data.forEach((ibu, index) => {

        if (
            ibu.statusRisikoTerakhir ===
            "🟢 Risiko Rendah"
        ) {

            rendah++;

        }

        else if (
            ibu.statusRisikoTerakhir ===
            "🟡 Risiko Sedang"
        ) {

            sedang++;

        }

        else if (
            ibu.statusRisikoTerakhir ===
            "🔴 Risiko Tinggi"
        ) {

            tinggi++;

        }


        tbody.innerHTML += `

            <tr>

                <td>
                    ${index + 1}
                </td>

                <td>
                    ${ibu.nama ?? "-"}
                </td>

                <td>
                    ${ibu.usiaKehamilan ?? "-"} Minggu
                </td>

                <td>
                    ${ibu.statusRisikoTerakhir ?? "-"}
                </td>

                <td>
                    ${ibu.tanggalSkrining ?? "-"}
                </td>

                <td>

                    <button
                        onclick="detailIbu('${ibu.uid}')"
                    >

                        Detail

                    </button>

                </td>

            </tr>

        `;

    });


    // ==================================
    // UPDATE STATISTIK
    // ==================================

    document.getElementById(
        "totalIbu"
    ).innerHTML = data.length;


    document.getElementById(
        "rendah"
    ).innerHTML = rendah;


    document.getElementById(
        "sedang"
    ).innerHTML = sedang;


    document.getElementById(
        "tinggi"
    ).innerHTML = tinggi;


    // ==================================
    // UPDATE GRAFIK
    // ==================================

    buatGrafik(
        rendah,
        sedang,
        tinggi
    );

}


// ======================================
// SEARCH NAMA
// ======================================

const searchNama =
    document.getElementById(
        "searchNama"
    );


if (searchNama) {

    searchNama.addEventListener(
        "keyup",
        filterData
    );

}


// ======================================
// FILTER RISIKO
// ======================================

const filterRisiko =
    document.getElementById(
        "filterRisiko"
    );


if (filterRisiko) {

    filterRisiko.addEventListener(
        "change",
        filterData
    );

}


// ======================================
// FILTER DATA
// ======================================

function filterData() {

    const keyword =
        document
            .getElementById("searchNama")
            .value
            .toLowerCase();


    const risiko =
        document
            .getElementById("filterRisiko")
            .value;


    const hasil =
        semuaDataIbu.filter((ibu) => {

            const cocokNama =

                (ibu.nama || "")
                    .toLowerCase()
                    .includes(keyword);


            const cocokRisiko =

                risiko === "Semua" ||

                ibu.statusRisikoTerakhir ===
                    risiko;


            return (
                cocokNama &&
                cocokRisiko
            );

        });


    renderTabel(hasil);

}


// ======================================
// PRIORITAS KUNJUNGAN
// ======================================

function tampilkanPrioritas(data) {

    const div =
        document.getElementById(
            "prioritasKunjungan"
        );


    if (!div) {

        return;

    }


    const risikoTinggi =
        data.filter(
            (item) =>

                item.statusRisikoTerakhir ===
                "🔴 Risiko Tinggi"
        );


    // ==================================
    // TIDAK ADA RISIKO TINGGI
    // ==================================

    if (risikoTinggi.length === 0) {

        div.innerHTML =

            "<p>✅ Tidak ada ibu hamil dengan risiko tinggi.</p>";

        return;

    }


    // ==================================
    // ADA RISIKO TINGGI
    // ==================================

    let html = "<ul>";


    risikoTinggi.forEach((item) => {

        html += `

            <li>

                <b>
                    ${item.nama}
                </b>

                (${item.usiaKehamilan ?? "-"} minggu)

            </li>

        `;

    });


    html += "</ul>";


    div.innerHTML = html;

}