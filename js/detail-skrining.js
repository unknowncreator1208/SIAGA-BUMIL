// ======================================
// SIAGA BUMIL
// detail-skrining.js
// ======================================

import {

    auth,

    db,

    doc,

    getDoc

}

from "./firebase.js";

import {

    onAuthStateChanged

}

from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";

let currentUser = null;


// ======================================
// Ambil ID dari URL
// ======================================

const params = new URLSearchParams(window.location.search);

const id = params.get("id");


// ======================================
// Cek Login
// ======================================

onAuthStateChanged(auth, async function(user){

    if(!user){

        window.location.href="../login.html";

        return;

    }

    currentUser = user;

    loadDetail();

});


// ======================================
// Load Detail
// ======================================

async function loadDetail(){

    try{

        const snapshot = await getDoc(

            doc(

                db,

                "users",

                currentUser.uid,

                "skrining",

                id

            )

        );

        if(!snapshot.exists()){

            document.getElementById("detailSkrining").innerHTML=

            "<h3>Data tidak ditemukan.</h3>";

            return;

        }

        const data = snapshot.data();

        tampilkan(data);

    }

    catch(error){

        console.error(error);

        alert(error.message);

    }

}


// ======================================
// Tampilkan Data
// ======================================

function tampilkan(data){

    let tanggal = "-";

    if(data.createdAt){

        tanggal =

        data.createdAt

        .toDate()

        .toLocaleString("id-ID");

    }

    const faktor =

    (data.faktorRisiko || [])

    .map(item=>"<li>"+item+"</li>")

    .join("");

    const warning =

    (data.earlyWarning || [])

    .map(item=>"<li>"+item+"</li>")

    .join("");

    const rekomendasi =

    (data.rekomendasi || [])

    .map(item=>"<li>"+item+"</li>")

    .join("");

    document.getElementById("detailSkrining").innerHTML=

    `

    <h2>HASIL SKRINING</h2>

    <hr>

    <p><b>Tanggal Pemeriksaan</b><br>${tanggal}</p>

    <p><b>Nama</b><br>${data.nama}</p>

    <p><b>Umur</b><br>${data.umur} Tahun</p>

    <p><b>Usia Kehamilan</b><br>${data.usiaKehamilan} Minggu</p>

    <p><b>Tekanan Darah</b><br>

    ${data.sistol}/${data.diastol} mmHg

    </p>

    <p><b>Skor</b><br>

    ${data.skor}

    </p>

    <h2>${data.status}</h2>

    <hr>

    <h3>⚠ Faktor Risiko</h3>

    <ul>

    ${faktor}

    </ul>

    <hr>

    <h3>🚨 Early Warning</h3>

    <ul>

    ${warning}

    </ul>

    <hr>

    <h3>📋 Rekomendasi</h3>

    <ul>

    ${rekomendasi}

    </ul>

    `;

}