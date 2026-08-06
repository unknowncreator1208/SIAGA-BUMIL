// ======================================
// SIAGA BUMIL
// monitoring-firebase.js
// ======================================

import {

    auth,

    db,

    doc,

    getDoc

}

from "./firebase.js";

import MonitoringService from "./services/monitoringService.js";

import {

    onAuthStateChanged

}

from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";

let currentUser = null;

const TARGET_TABLET = 180;


// ======================================
// AUTH
// ======================================

onAuthStateChanged(auth, async function(user){

    if(!user){

        window.location.href="../login.html";

        return;

    }

    currentUser = user;

    await loadProfil();

    await loadMonitoring();

});


// ======================================
// LOAD PROFIL
// ======================================

async function loadProfil(){

    try{

        const snapshot = await getDoc(

            doc(db,"users",currentUser.uid)

        );

        if(!snapshot.exists()) return;

        const data = snapshot.data();

        if(!data.profil) return;

        document.getElementById("nama").value =
        data.profil.nama || "";

        document.getElementById("usiaKehamilan").value =
        data.profil.usiaKehamilan || "";

        document.getElementById("nomorHP").value =
        data.profil.nomorHP || "";

    }

    catch(error){

        console.error(error);

    }

}


// ======================================
// LOAD MONITORING
// ======================================

async function loadMonitoring(){

    try{

        const data = await MonitoringService.getMonitoring(

            currentUser.uid

        );

        const tbody = document.querySelector(

            "#tabelTTD tbody"

        );

        tbody.innerHTML="";

        let nomor=1;

        data.forEach(function(item){

            const row=tbody.insertRow();

            row.insertCell(0).innerHTML=nomor++;

            row.insertCell(1).innerHTML=item.tanggal;

            row.insertCell(2).innerHTML=item.status;

        });

        const progress=

        MonitoringService.hitungProgress(

            data,

            TARGET_TABLET

        );

        document.getElementById("bar").style.width=

        progress.persen+"%";

        document.getElementById("persentase").innerHTML=

        progress.jumlah+

        " / "+

        TARGET_TABLET+

        " Tablet ("+

        progress.persen.toFixed(1)+

        "%)";

    }

    catch(error){

        console.error(error);

    }

}


// ======================================
// SIMPAN MONITORING
// ======================================

window.simpanTTD = async function(){

    if(currentUser==null){

        alert("User belum login.");

        return;

    }

    const tanggal=

    document.getElementById("tanggal").value;

    const status=

    document.getElementById("status").value;

    if(tanggal==""){

        alert("Pilih tanggal.");

        return;

    }

    if(status==""){

        alert("Pilih status.");

        return;

    }

    try{

        await MonitoringService.simpanMonitoring(

            currentUser.uid,

            tanggal,

            status

        );

        document.getElementById("tanggal").value="";

        document.getElementById("status").value="";

        await loadMonitoring();

        alert("Monitoring berhasil disimpan.");

    }

    catch(error){

        console.error(error);

        alert(error.message);

    }

}