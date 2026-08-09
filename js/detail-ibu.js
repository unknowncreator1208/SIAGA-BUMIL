// ======================================
// Detail Ibu Hamil
// ======================================

import {

    auth,
    db,
    doc,
    getDoc,
    collection,
    getDocs,
    query,
    orderBy,
    limit

}

from "./firebase.js";

import {

    onAuthStateChanged

}

from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";

import PersalinanService

from "./services/persalinanService.js";

const TARGET_TABLET = 180;

const params = new URLSearchParams(window.location.search);

const uid = params.get("uid");

onAuthStateChanged(auth, async function(user){

    if(!user){

        window.location.href="../login.html";

        return;

    }

    if(!uid){

        alert("UID tidak ditemukan.");

        return;

    }

    loadProfil();

});

async function loadProfil(){

    try{

        const snapshot = await getDoc(

            doc(

                db,

                "users",

                uid

            )

        );

        if(!snapshot.exists()){

            document.getElementById("profil").innerHTML =

            "Data tidak ditemukan.";

            return;

        }

        const data = snapshot.data();

        const profil = data.profil || {};

        const pendamping = profil.pendamping || {};

       document.getElementById("profil").innerHTML = `

<div class="profil-detail-card">

    <h3>👩 Identitas Ibu</h3>

    <table>

        <tr>
            <td><b>Nama</b></td>
            <td>${profil.nama ?? "-"}</td>
        </tr>

        <tr>
            <td><b>NIK</b></td>
            <td>${profil.nik ?? "-"}</td>
        </tr>

        <tr>
            <td><b>Umur</b></td>
            <td>${profil.umur ?? "-"} tahun</td>
        </tr>

        <tr>
            <td><b>Tanggal Lahir</b></td>
            <td>${profil.tanggalLahir ?? "-"}</td>
        </tr>

        <tr>
            <td><b>Usia Kehamilan</b></td>
            <td>${profil.usiaKehamilan ?? "-"} minggu</td>
        </tr>

        <tr>
            <td><b>Jumlah Kehamilan</b></td>
            <td>${profil.jumlahKehamilan ?? "-"} kali</td>
        </tr>

        <tr>
            <td><b>Berat Badan</b></td>
            <td>${profil.beratBadan ?? "-"} kg</td>
        </tr>

        <tr>
            <td><b>Tinggi Badan</b></td>
            <td>${profil.tinggiBadan ?? "-"} cm</td>
        </tr>

        <tr>
            <td><b>LILA</b></td>
            <td>${profil.lila ?? "-"} cm</td>
        </tr>

        <tr>
            <td><b>Golongan Darah</b></td>
            <td>${profil.golonganDarah ?? "-"}</td>
        </tr>

        <tr>
            <td><b>No. HP</b></td>
            <td>${profil.nomorHP ?? "-"}</td>
        </tr>

        <tr>
            <td><b>Alamat</b></td>
            <td>${profil.alamat ?? "-"}</td>
        </tr>

        <tr>
            <td><b>HPL</b></td>
            <td>${profil.hpl ?? "-"}</td>
        </tr>

    </table>


    <h3>👨 Identitas Suami / Pendamping</h3>

    <table>

        <tr>
            <td><b>Nama</b></td>
            <td>${pendamping.nama ?? "-"}</td>
        </tr>

        <tr>
            <td><b>Hubungan</b></td>
            <td>${pendamping.hubungan ?? "-"}</td>
        </tr>

        <tr>
            <td><b>No. HP</b></td>
            <td>${pendamping.nomorHP ?? "-"}</td>
        </tr>

        <tr>
            <td><b>Alamat</b></td>
            <td>${pendamping.alamat ?? "-"}</td>
        </tr>

    </table>

</div>

`;

        await loadSkriningTerakhir();

        await loadMonitoringTTD();

        await loadRiwayatSkrining();

    }

    catch(error){

        console.error(error);

    }

}
async function loadSkriningTerakhir(){

    try{

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
            ),

            limit(1)

        );

        const snapshot = await getDocs(q);

        if(snapshot.empty){

            document.getElementById("skrining").innerHTML =

            "<p>Belum ada data skrining.</p>";

            return;

        }

        const data = snapshot.docs[0].data();


        // ======================================
        // FORMAT DATA
        // ======================================

        const sistol = data.sistol ?? "-";

        const diastol = data.diastol ?? "-";

        const beratBadan =
            data.beratBadan ?? "-";

        const tinggiBadan =
            data.tinggiBadan ?? "-";

        const lila =
            data.lila ?? "-";

        const imt =
            data.imt != null
            ? Number(data.imt).toFixed(1)
            : "-";

        const jumlahKehamilan =
            data.jumlahKehamilan ?? "-";


        // ======================================
        // TANGGAL SKRINING
        // ======================================

        let tanggal = "-";

        if(data.createdAt){

            try{

                tanggal = data.createdAt
                    .toDate()
                    .toLocaleDateString("id-ID");

            }

            catch(error){

                tanggal = "-";

            }

        }


        // ======================================
        // FAKTOR RISIKO
        // ======================================

        let faktorRisiko =

            data.faktorRisiko || [];

        let htmlFaktor = "";

        if(faktorRisiko.length > 0){

            htmlFaktor = "<ul>";

            faktorRisiko.forEach(function(faktor){

                htmlFaktor +=

                    "<li>" +
                    faktor +
                    "</li>";

            });

            htmlFaktor += "</ul>";

        }
        else{

            htmlFaktor =
                "<span>Tidak ditemukan faktor risiko.</span>";

        }


        // ======================================
        // EARLY WARNING
        // ======================================

        let earlyWarning =

            data.earlyWarning || [];

        let htmlWarning = "";

        if(earlyWarning.length > 0){

            htmlWarning = "<ul>";

            earlyWarning.forEach(function(warning){

                htmlWarning +=

                    "<li>" +
                    warning +
                    "</li>";

            });

            htmlWarning += "</ul>";

        }
        else{

            htmlWarning =
                "<span>Tidak ada tanda bahaya.</span>";

        }


        // ======================================
        // REKOMENDASI
        // ======================================

        let rekomendasi =

            data.rekomendasi || [];

        let htmlRekomendasi = "";

        if(rekomendasi.length > 0){

            htmlRekomendasi = "<ul>";

            rekomendasi.forEach(function(item){

                htmlRekomendasi +=

                    "<li>" +
                    item +
                    "</li>";

            });

            htmlRekomendasi += "</ul>";

        }
        else{

            htmlRekomendasi =
                "<span>-</span>";

        }


        // ======================================
        // TAMPILKAN DATA
        // ======================================

        document.getElementById("skrining").innerHTML =

        `

        <div class="skrining-detail-card">


            <!-- STATUS -->

            <div class="status-skrining">

                <h3>Status Risiko</h3>

                <div class="status-value">

                    ${data.status ?? "-"}

                </div>

                <p>

                    Skor Risiko :
                    <b>${data.skor ?? "-"}</b>

                </p>

            </div>


            <!-- INFORMASI PEMERIKSAAN -->

            <h3>🩺 Data Pemeriksaan</h3>

            <table>

                <tr>

                    <td>
                        <b>Tanggal Skrining</b>
                    </td>

                    <td>
                        ${tanggal}
                    </td>

                </tr>


                <tr>

                    <td>
                        <b>Tekanan Darah</b>
                    </td>

                    <td>

                        ${sistol}/${diastol} mmHg

                    </td>

                </tr>


                <tr>

                    <td>
                        <b>Berat Badan</b>
                    </td>

                    <td>

                        ${beratBadan} kg

                    </td>

                </tr>


                <tr>

                    <td>
                        <b>Tinggi Badan</b>
                    </td>

                    <td>

                        ${tinggiBadan} cm

                    </td>

                </tr>


                <tr>

                    <td>
                        <b>LILA</b>
                    </td>

                    <td>

                        ${lila} cm

                    </td>

                </tr>


                <tr>

                    <td>
                        <b>IMT</b>
                    </td>

                    <td>

                        ${imt}

                    </td>

                </tr>


                <tr>

                    <td>
                        <b>Jumlah Kehamilan</b>
                    </td>

                    <td>

                        ${jumlahKehamilan} kali

                    </td>

                </tr>

            </table>


            <!-- FAKTOR RISIKO -->

            <h3>⚠ Faktor Risiko</h3>

            <div class="faktor-risiko">

                ${htmlFaktor}

            </div>


            <!-- EARLY WARNING -->

            <h3>🚨 Early Warning</h3>

            <div class="early-warning">

                ${htmlWarning}

            </div>


            <!-- REKOMENDASI -->

            <h3>📋 Rekomendasi</h3>

            <div class="rekomendasi">

                ${htmlRekomendasi}

            </div>


        </div>

        `;

    }

    catch(error){

        console.error(
            "Gagal memuat skrining terakhir:",
            error
        );

    }

}

async function loadMonitoringTTD(){

    try{

        const q = query(

            collection(
                db,
                "users",
                uid,
                "monitoringTTD"
            ),

            orderBy(
                "createdAt",
                "desc"
            )

        );

        const snapshot = await getDocs(q);

        let sudah = 0;

        snapshot.forEach((doc)=>{

            const data = doc.data();

            if(data.status == "Sudah"){

                sudah++;

            }

        });

        let persen = (sudah / TARGET_TABLET) * 100;

        if(persen > 100){

            persen = 100;

        }

        let sisa = TARGET_TABLET - sudah;

        if(sisa < 0){

            sisa = 0;

        }

        let html = `

        <div class="ttd-card">

            <h3>💊 Monitoring Tablet Tambah Darah</h3>

            <div class="ttd-number">

                ${sudah}
                <span>/ ${TARGET_TABLET} Tablet</span>

            </div>

            <div class="ttd-progress">

    <div class="ttd-progress-bar"

        style="width:${persen}%">

    </div>

</div>

            <p>
                Target Nasional :
                <b>${TARGET_TABLET} Tablet</b>
            </p>

            <p>
                Sisa Tablet :
                <b>${sisa}</b>
            </p>

        </div>

        `;

        document.getElementById("ttd").innerHTML = html;

    }

    catch(error){

        console.log(error);

    }

}

async function loadRiwayatSkrining(){

    try{

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

        let html =

        "<table border='1' width='100%'>";

        html +=

        "<tr>"+

        "<th>Tanggal</th>"+

        "<th>Skor</th>"+

        "<th>Status</th>"+

        "</tr>";

        snapshot.forEach((doc)=>{

            const data = doc.data();

            let tanggal="-";

            if(data.createdAt){

                tanggal=

                data.createdAt

                .toDate()

                .toLocaleDateString(

                    "id-ID"

                );

            }

            html +=

            "<tr>"+

            "<td>"+tanggal+"</td>"+

            "<td>"+data.skor+"</td>"+

            "<td>"+data.status+"</td>"+

            "</tr>";

        });

        html +=

        "</table>";

        document.getElementById(

            "riwayat"

        ).innerHTML=

        html;

    }

    catch(error){

        console.log(error);

    }

}

document

.getElementById(

"btnCetak"

)

.addEventListener(

"click",

function(){

window.print();

});

// ======================================
// SELESAI PERSALINAN
// ======================================

document

.getElementById(

    "btnSelesaiPersalinan"

)

.addEventListener(

    "click",

    function(){

        const container =

        document.getElementById(

            "formPersalinan"

        );


        container.innerHTML = `

            <div class="form-persalinan">

                <h3>
                    🏥 Data Persalinan
                </h3>

                <label>
                    Tanggal Persalinan
                </label>

                <input
                    type="date"
                    id="tanggalPersalinan"
                >


                <label>
                    Keterangan Persalinan
                </label>

                <textarea
                    id="keteranganPersalinan"
                    placeholder="Contoh: Persalinan normal, bayi lahir sehat"
                ></textarea>


                <button
                    id="btnKonfirmasiPersalinan"
                    class="btn-konfirmasi-persalinan">

                    ✓ Konfirmasi Selesai Persalinan

                </button>

            </div>

        `;


        document

        .getElementById(

            "btnKonfirmasiPersalinan"

        )

        .addEventListener(

            "click",

            konfirmasiPersalinan

        );

    }

);

async function konfirmasiPersalinan(){

    const tanggal =

    document.getElementById(

        "tanggalPersalinan"

    ).value;


    const keterangan =

    document.getElementById(

        "keteranganPersalinan"

    ).value;


    if(!tanggal){

        alert(

            "Tanggal persalinan wajib diisi."

        );

        return;

    }


    const konfirmasi = confirm(

        "Apakah ibu ini sudah selesai persalinan?"

    );


    if(!konfirmasi){

        return;

    }


    try{

        await PersalinanService.selesaiPersalinan(

            uid,

            tanggal,

            keterangan

        );


        alert(

            "Data persalinan berhasil disimpan."

        );


        // Kembali ke dashboard nakes

        window.location.href =

            "dashboard-nakes.html";

    }

    catch(error){

        console.error(error);

        alert(

            "Gagal menyimpan data persalinan: "

            + error.message

        );

    }

}