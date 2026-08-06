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

        document.getElementById("profil").innerHTML =

        `

        <table border="1" width="100%">

        <tr>

        <td><b>Nama</b></td>

        <td>${profil.nama ?? "-"}</td>

        </tr>

        <tr>

        <td><b>Umur</b></td>

        <td>${profil.umur ?? "-"}</td>

        </tr>

        <tr>

        <td><b>Usia Kehamilan</b></td>

        <td>${profil.usiaKehamilan ?? "-"} Minggu</td>

        </tr>

        <tr>

        <td><b>No HP</b></td>

        <td>${profil.nomorHP ?? "-"}</td>

        </tr>

        <tr>

        <td><b>Alamat</b></td>

        <td>${profil.alamat ?? "-"}</td>

        </tr>

        </table>

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

            orderBy("createdAt","desc"),

            limit(1)

        );

        const snapshot = await getDocs(q);

        if(snapshot.empty){

            document.getElementById("skrining").innerHTML =

            "<p>Belum ada data skrining.</p>";

            return;

        }

        const data = snapshot.docs[0].data();

        document.getElementById("skrining").innerHTML =

        `

        <table border="1" width="100%">

            <tr>

                <td><b>Status Risiko</b></td>

                <td>${data.status ?? "-"}</td>

            </tr>

            <tr>

                <td><b>Skor</b></td>

                <td>${data.skor ?? "-"}</td>

            </tr>

            <tr>

                <td><b>Tekanan Darah</b></td>

                <td>${data.sistol}/${data.diastol} mmHg</td>

            </tr>

            <tr>

                <td><b>Faktor Risiko</b></td>

                <td>${(data.faktorRisiko || []).join("<br>")}</td>

            </tr>

            <tr>

                <td><b>Early Warning</b></td>

                <td>${(data.earlyWarning || []).join("<br>")}</td>

            </tr>

            <tr>

                <td><b>Rekomendasi</b></td>

                <td>${(data.rekomendasi || []).join("<br>")}</td>

            </tr>

        </table>

        `;

    }

    catch(error){

        console.error(error);

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