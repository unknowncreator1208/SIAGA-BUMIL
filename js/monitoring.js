/*=========================================
MONITORING TABLET TAMBAH DARAH
=========================================*/

const TARGET_TABLET = 180;



window.onload = function(){

    tampilkanProfil();

    tampilkanRiwayat();

};



/*=========================================
TAMPILKAN PROFIL
=========================================*/

function tampilkanProfil(){

    let profil = Storage.ambil("profilIbu");

    if(profil){

        document.getElementById("nama").value =
        profil.nama || "";

        document.getElementById("usiaKehamilan").value =
        profil.usiaKehamilan || "";

        document.getElementById("nomorHP").value =
        profil.nomorHP || "";

    }

}



/*=========================================
SIMPAN MONITORING
=========================================*/

function simpanTTD(){

    let tanggal =
    document.getElementById("tanggal").value;

    let status =
    document.getElementById("status").value;



    if(tanggal==""){

        alert("Silakan pilih tanggal.");

        return;

    }



    if(status==""){

        alert("Silakan pilih status.");

        return;

    }



    let data =
    Storage.ambil("monitoringTTD") || [];



    // Cek apakah tanggal sudah ada

    let sudahAda =
    data.find(function(item){

        return item.tanggal==tanggal;

    });



    if(sudahAda){

        alert("Data tanggal tersebut sudah pernah disimpan.");

        return;

    }



    data.push({

        nama:
        document.getElementById("nama").value,

        tanggal:tanggal,

        status:status

    });



    Storage.simpan(

        "monitoringTTD",

        data

    );



    alert("Data berhasil disimpan.");



    document.getElementById("tanggal").value="";

    document.getElementById("status").value="";



    tampilkanRiwayat();

}



/*=========================================
TAMPILKAN RIWAYAT
=========================================*/

function tampilkanRiwayat(){

    let data =
    Storage.ambil("monitoringTTD") || [];



    let tbody =
    document.querySelector("#tabelTTD tbody");



    tbody.innerHTML="";



    let jumlahMinum=0;



    data.forEach(function(item,index){

        let row=
        tbody.insertRow();

        row.insertCell(0).innerHTML=index+1;

        row.insertCell(1).innerHTML=item.tanggal;

        row.insertCell(2).innerHTML=item.status;



        if(item.status=="Sudah"){

            jumlahMinum++;

        }

    });



    let persen=
    (jumlahMinum/TARGET_TABLET)*100;

    if(persen>100){

        persen=100;

    }



    document.getElementById("bar").style.width=

    persen+"%";



    document.getElementById("persentase").innerHTML=

    jumlahMinum+

    " / "+

    TARGET_TABLET+

    " Tablet ("+

    persen.toFixed(1)+

    "%)";

}