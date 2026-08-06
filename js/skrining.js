/* =====================================
   SIAGA BUMIL
   skrining.js
===================================== */


/* ==========================
   VARIABEL GLOBAL
========================== */

let skor = 0;
let status = "";
let rekomendasi = [];
let warna = "";
let faktorRisiko = [];
let earlyWarning = [];


/* ==========================
   HALAMAN DIBUKA
========================== */

window.onload = function(){

    console.log("Halaman Skrining Dibuka");

};


/* ==========================
   MENAMPILKAN DATA PROFIL
========================== */

function tampilkanProfil(){

    // Profil sekarang diambil oleh skrining-firebase.js
    // Fungsi ini sengaja dikosongkan.

}



/* ==========================
   RESET DATA
========================== */

function resetData(){

    skor = 0;

    status = "";

    rekomendasi = [];

    warna = "";

    faktorRisiko = [];

    earlyWarning = [];

}



/* ==========================
   MENGAMBIL RADIO BUTTON
========================== */

function ambilRadio(namaRadio){

    let radio = document.querySelector(

        'input[name="'+namaRadio+'"]:checked'

    );

    if(radio){

        return radio.value;

    }

    return "Tidak";

}



/* ==========================
   TOMBOL HITUNG RISIKO
========================== */

function ambilData(){

    resetData();

    //----------------------------------
    // Identitas
    //----------------------------------

    let nama = document.getElementById("nama").value;

    let umur = Number(document.getElementById("umur").value);

    let usiaKehamilan = Number(document.getElementById("usiaKehamilan").value);

    let nomorHP = document.getElementById("nomorHP").value;

    let alamat = document.getElementById("alamat").value;

    //----------------------------------
    // Pemeriksaan
    //----------------------------------

    let sistol = Number(

        document.getElementById("sistol").value

    );

    let diastol = Number(

        document.getElementById("diastol").value

    );

    let hipertensi = ambilRadio("hipertensi");

    let diabetes = ambilRadio("diabetes");

    let perdarahan = ambilRadio("perdarahan");

    let jumlahKehamilan = Number(

        document.getElementById("jumlahKehamilan").value

    );



    //----------------------------------
    // Validasi
    //----------------------------------

    if(nama==""){

        alert("Nama belum tersedia.");

        return;

    }

    if(isNaN(sistol) || isNaN(diastol)){

        alert("Masukkan tekanan darah.");

        return;

    }

    //----------------------------------
    // Hitung Skor
    //----------------------------------

    hitungSkor(

    umur,
    sistol,
    diastol,
    hipertensi,
    diabetes,
    perdarahan,
    jumlahKehamilan

);

// Tentukan Status
tentukanStatus();

// Tampilkan Hasil
tampilkanHasil(

    nama,
    umur,
    usiaKehamilan,
    sistol,
    diastol

);

}

/* ==========================
   TAMPILKAN HASIL
========================== */

function tampilkanHasil(

    nama,
    umur,
    usiaKehamilan,
    sistol,
    diastol

){

    let daftarFaktor = "";

    if(faktorRisiko.length > 0){

        daftarFaktor = "<ul>";

        faktorRisiko.forEach(function(item){

            daftarFaktor += "<li>" + item + "</li>";

        });

        daftarFaktor += "</ul>";

    }else{

        daftarFaktor = "Tidak ditemukan faktor risiko.";

    }



    let daftarWarning = "";

    if(earlyWarning.length > 0){

        daftarWarning = "<ul>";

        earlyWarning.forEach(function(item){

            daftarWarning += "<li>" + item + "</li>";

        });

        daftarWarning += "</ul>";

    }else{

        daftarWarning = "Tidak ada tanda bahaya.";

    }



    let daftarRekomendasi = "<ul>";

    rekomendasi.forEach(function(item){

        daftarRekomendasi += "<li>" + item + "</li>";

    });

    daftarRekomendasi += "</ul>";



    document.getElementById("hasil").innerHTML =

    "<h2>HASIL SKRINING</h2>" +

    "<hr>" +

    "<b>Nama :</b> " + nama +

    "<br><b>Umur :</b> " + umur + " Tahun" +

    "<br><b>Usia Kehamilan :</b> " + usiaKehamilan + " Minggu" +

    "<br><b>Tekanan Darah :</b> " +

    sistol + "/" + diastol + " mmHg" +

    "<br><b>Skor :</b> " + skor +

    "<br><br><h3 style='color:" + warna + "'>" +

    status +

    "</h3>" +

    "<hr>" +

    "<h3>⚠ Faktor Risiko</h3>" +

    daftarFaktor +

    "<hr>" +

    "<h3>🚨 Early Warning</h3>" +

    daftarWarning +

    "<hr>" +

    "<h3>📋 Rekomendasi</h3>" +

    daftarRekomendasi +

    "<br>" +

    "<button type='button' onclick='simpanRiwayat()'>" +

    "💾 Simpan Riwayat" +

    "</button>";

    if(typeof simpanHasilSkrining==="function"){

    simpanHasilSkrining({

        nama:nama,

        umur:umur,

        usiaKehamilan:usiaKehamilan,

        sistol:sistol,

        diastol:diastol,

        skor:skor,

        status:status,

        faktorRisiko:faktorRisiko,

        earlyWarning:earlyWarning,

        rekomendasi:rekomendasi

    });

}

}

/* ==========================
   SIMPAN RIWAYAT
========================== */

function simpanRiwayat(){

    alert("Data sudah otomatis tersimpan ke database.");

}

/* ==========================
   HITUNG SKOR RISIKO
========================== */

function hitungSkor(

    umur,
    sistol,
    diastol,
    hipertensi,
    diabetes,
    perdarahan,
    jumlahKehamilan

){

    // ======================
    // Umur
    // ======================

    if(umur < 20){

        skor += 2;

        faktorRisiko.push("Usia ibu kurang dari 20 tahun");

    }

    if(umur > 35){

        skor += 2;

        faktorRisiko.push("Usia ibu lebih dari 35 tahun");

    }


    // ======================
    // Hipertensi dari riwayat
    // ======================

    if(hipertensi == "Ya"){

        skor += 2;

        faktorRisiko.push("Memiliki riwayat hipertensi");

    }


    // ======================
    // Diabetes
    // ======================

    if(diabetes == "Ya"){

        skor += 2;

        faktorRisiko.push("Memiliki riwayat diabetes");

    }


    // ======================
    // Perdarahan
    // ======================

    if(perdarahan == "Ya"){

        skor += 3;

        faktorRisiko.push("Mengalami perdarahan");

        earlyWarning.push(

            "🚨 Perdarahan saat hamil merupakan keadaan darurat. Segera menuju fasilitas kesehatan."

        );

    }


    // ======================
    // Jumlah Kehamilan
    // ======================

    if(jumlahKehamilan >= 5){

        skor += 2;

        faktorRisiko.push("Kehamilan lebih dari 4 kali");

    }


    // ======================
    // Hipertensi
    // ======================

    if(sistol >= 140 || diastol >= 90){

        skor += 2;

        faktorRisiko.push("Tekanan darah tinggi");

    }


    // Hipertensi Berat

    if(sistol >= 160 || diastol >= 110){

        skor += 4;

        earlyWarning.push(

            "🚨 Hipertensi berat. Segera ke Rumah Sakit."

        );

    }


    // ======================
    // Hipotensi
    // ======================

    if(sistol < 90 || diastol < 60){

        skor += 2;

        faktorRisiko.push("Tekanan darah rendah");

        earlyWarning.push(

            "⚠ Tekanan darah rendah. Bila disertai pusing, lemas atau perdarahan segera ke fasilitas kesehatan."

        );

    }


    // ======================
    // Tanda Bahaya
    // ======================

    if(document.getElementById("nyeriKepala").checked){

        skor += 2;

        faktorRisiko.push("Nyeri kepala hebat");

        earlyWarning.push(

            "⚠ Nyeri kepala hebat dapat menjadi tanda preeklamsia."

        );

    }


    if(document.getElementById("pandanganKabur").checked){

        skor += 2;

        faktorRisiko.push("Pandangan kabur");

        earlyWarning.push(

            "⚠ Pandangan kabur perlu segera diperiksa."

        );

    }


    if(document.getElementById("kejang").checked){

        skor += 5;

        faktorRisiko.push("Kejang");

        earlyWarning.push(

            "🚨 Kejang merupakan keadaan gawat darurat."

        );

    }


    if(document.getElementById("gerakJanin").checked){

        skor += 3;

        faktorRisiko.push("Gerakan janin berkurang");

        earlyWarning.push(

            "🚨 Gerakan janin berkurang. Segera ke fasilitas kesehatan."

        );

    }


    if(document.getElementById("sesak").checked){

        skor += 3;

        faktorRisiko.push("Sesak napas");

        earlyWarning.push(

            "🚨 Sesak napas saat hamil memerlukan pemeriksaan segera."

        );

    }


    if(document.getElementById("demam").checked){

        skor += 2;

        faktorRisiko.push("Demam tinggi");

        earlyWarning.push(

            "⚠ Demam tinggi saat hamil harus diperiksa."

        );

    }

}



/* ==========================
   STATUS RISIKO
========================== */

function tentukanStatus(){

    if(skor <= 2){

        status = "🟢 Risiko Rendah";

        warna = "#4CAF50";

        rekomendasi = [

            "Lanjutkan ANC sesuai jadwal.",

            "Minum Tablet Tambah Darah setiap hari.",

            "Konsumsi makanan bergizi.",

            "Istirahat yang cukup."

        ];

    }

    else if(skor <= 6){

        status = "🟡 Risiko Sedang";

        warna = "#FFC107";

        rekomendasi = [

            "Periksa ke Puskesmas dalam waktu dekat.",

            "Pantau tekanan darah.",

            "Jangan melewatkan ANC.",

            "Segera datang bila muncul keluhan."

        ];

    }

    else{

        status = "🔴 Risiko Tinggi";

        warna = "#F44336";

        rekomendasi = [

            "Segera ke Bidan atau Rumah Sakit.",

            "Jangan menunda pemeriksaan.",

            "Datang bersama keluarga.",

            "Ikuti semua anjuran tenaga kesehatan."

        ];

    }
}