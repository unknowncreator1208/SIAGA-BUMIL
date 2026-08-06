// ======================================
// SIAGA BUMIL
// riwayat-skrining.js
// ======================================

import {

    auth,

    db,

    collection,

    getDocs,

    query,

    orderBy

} from "./firebase.js";

import {

    onAuthStateChanged

} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";

let currentUser = null;


// ======================================
// AUTH
// ======================================

onAuthStateChanged(auth, async function(user){

    if(user){

        currentUser = user;

        loadRiwayat();

    }

    else{

        window.location.href = "../login.html";

    }

});


// ======================================
// LOAD RIWAYAT
// ======================================

async function loadRiwayat(){

    try{

        const q = query(

            collection(

                db,

                "users",

                currentUser.uid,

                "skrining"

            ),

            orderBy("createdAt","desc")

        );

        const snapshot = await getDocs(q);

        const tbody = document.querySelector("#tabelRiwayat tbody");

        tbody.innerHTML = "";

        let nomor = 1;

        snapshot.forEach(function(docItem){

            const data = docItem.data();

            let tanggal = "-";

            if(data.createdAt){

                tanggal = data.createdAt.toDate().toLocaleString("id-ID");

            }

            const row = tbody.insertRow();

            row.insertCell(0).innerHTML = nomor++;

            row.insertCell(1).innerHTML = tanggal;

            row.insertCell(2).innerHTML = data.skor;

            row.insertCell(3).innerHTML = data.status;

            row.insertCell(4).innerHTML =

            "<button onclick='lihatDetail(\""+docItem.id+"\")'>Lihat</button>";

        });

        if(snapshot.empty){

            tbody.innerHTML =

            "<tr><td colspan='5'>Belum ada riwayat skrining.</td></tr>";

        }

    }

    catch(error){

        console.error(error);

        alert(error.message);

    }

}


// ======================================
// DETAIL
// ======================================

window.lihatDetail = function(id){

    window.location.href =

    "../pages/detail-skrining.html?id=" + id;

}