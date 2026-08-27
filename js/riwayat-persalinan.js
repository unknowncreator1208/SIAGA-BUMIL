// ======================================
// RIWAYAT PERSALINAN
// ======================================

import UserService

from "./services/UserService.js";


let semuaData = [];


// ======================================
// LOAD DATA
// ======================================

async function loadRiwayat(){

    try{

        semuaData =

        await UserService

        .getRiwayatPersalinan();


        tampilkanData(

            semuaData

        );

    }

    catch(error){

        console.error(error);

        alert(

            "Gagal mengambil data riwayat persalinan."

        );

    }

}


// ======================================
// TAMPILKAN DATA
// ======================================

function tampilkanData(data){

    const tbody =

    document.querySelector(

        "#tabelPersalinan tbody"

    );


    tbody.innerHTML = "";


    if(data.length === 0){

        tbody.innerHTML = `

            <tr>

                <td colspan="7">

                    Belum ada riwayat persalinan.

                </td>

            </tr>

        `;

        return;

    }


    data.forEach(function(item,index){

        const profil =

            item.profil || {};


        const row =

            tbody.insertRow();


        row.insertCell(0).innerHTML =

            index + 1;


        row.insertCell(1).innerHTML =

            profil.nama || "-";


        row.insertCell(2).innerHTML =

            profil.umur || "-";


        row.insertCell(3).innerHTML =

            profil.usiaKehamilan

            ?

            profil.usiaKehamilan + " Minggu"

            :

            "-";


        row.insertCell(4).innerHTML =

            item.tanggalSelesaiPersalinan

            || "-";


        row.insertCell(5).innerHTML =

            item.keteranganPersalinan

            || "-";


        row.insertCell(6).innerHTML = `

            <button

                onclick="lihatDetail('${item.uid}')">

                Detail

            </button>

        `;

    });

}


// ======================================
// SEARCH
// ======================================

document

.getElementById(

    "searchPersalinan"

)

.addEventListener(

    "input",

    function(){

        const keyword =

        this.value

        .toLowerCase();


        const hasil =

        semuaData.filter(function(item){

            const nama =

            (

                item.profil?.nama

                || ""

            )

            .toLowerCase();


            return nama.includes(keyword);

        });


        tampilkanData(hasil);

    }

);


// ======================================
// DETAIL
// ======================================

window.lihatDetail = function(uid){

    window.location.href =

        "detail-ibu.html?uid="

        + uid;

};


// ======================================
// LOAD
// ======================================

loadRiwayat();