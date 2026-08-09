/* =========================================
   SIAGA BUMIL
   skrining.js
   ========================================= */


/* =========================================
   VARIABEL GLOBAL
========================================= */

let skor = 0;
let status = "";
let warna = "";

let faktorRisiko = [];
let earlyWarning = [];
let rekomendasi = [];


/* =========================================
   DATA PEMERIKSAAN
========================================= */

let dataPemeriksaan = {
    nama: "",
    umur: 0,
    usiaKehamilan: 0,
    jumlahKehamilan: 0,

    beratBadan: 0,
    tinggiBadan: 0,
    lila: 0,
    imt: 0,

    sistol: 0,
    diastol: 0,

    hipertensi: "Tidak",
    diabetes: "Tidak",
    perdarahan: "Tidak"
};


/* =========================================
   HALAMAN DIBUKA
========================================= */

window.onload = function(){

    console.log("✅ Halaman Skrining Dibuka");

};


/* =========================================
   FUNGSI TAMPILKAN PROFIL
   Profil sekarang dimuat oleh
   skrining-firebase.js
========================================= */

function tampilkanProfil(){

    // Profil dimuat oleh skrining-firebase.js

}


/* =========================================
   RESET DATA
========================================= */

function resetData(){

    skor = 0;

    status = "";

    warna = "";

    faktorRisiko = [];

    earlyWarning = [];

    rekomendasi = [];

}


/* =========================================
   RADIO BUTTON
========================================= */

function ambilRadio(namaRadio){

    const radio = document.querySelector(
        'input[name="' + namaRadio + '"]:checked'
    );

    if(radio){

        return radio.value;

    }

    return "Tidak";

}


/* =========================================
   HITUNG IMT
========================================= */

function hitungIMT(beratBadan, tinggiBadan){

    if(
        !beratBadan ||
        !tinggiBadan ||
        tinggiBadan <= 0
    ){

        return 0;

    }

    const tinggiMeter = tinggiBadan / 100;

    return beratBadan /
        Math.pow(tinggiMeter, 2);

}


/* =========================================
   KATEGORI IMT
========================================= */

function kategoriIMT(imt){

    if(!imt || imt <= 0){

        return "Tidak dapat dihitung";

    }

    if(imt < 18.5){

        return "IMT rendah";

    }

    if(imt < 25){

        return "IMT normal";

    }

    if(imt < 30){

        return "IMT berlebih";

    }

    return "Obesitas";

}


/* =========================================
   TOMBOL HITUNG RISIKO
========================================= */

function ambilData(){

    resetData();


    /* =====================================
       AMBIL DATA PROFIL
    ===================================== */

    const namaElement =
        document.getElementById("nama");

    const umurElement =
        document.getElementById("umur");

    const usiaKehamilanElement =
        document.getElementById("usiaKehamilan");

    const jumlahKehamilanElement =
        document.getElementById("jumlahKehamilan");

    const beratBadanElement =
        document.getElementById("beratBadan");

    const tinggiBadanElement =
        document.getElementById("tinggiBadan");

    const lilaElement =
        document.getElementById("lila");


    const nama =
        namaElement ? namaElement.value.trim() : "";

    const umur =
        umurElement
        ? Number(umurElement.value)
        : 0;

    const usiaKehamilan =
        usiaKehamilanElement
        ? Number(usiaKehamilanElement.value)
        : 0;

    const jumlahKehamilan =
        jumlahKehamilanElement
        ? Number(jumlahKehamilanElement.value)
        : 0;


    const beratBadan =
        beratBadanElement
        ? Number(beratBadanElement.value)
        : 0;

    const tinggiBadan =
        tinggiBadanElement
        ? Number(tinggiBadanElement.value)
        : 0;

    const lila =
        lilaElement
        ? Number(lilaElement.value)
        : 0;


    /* =====================================
       HITUNG IMT
    ===================================== */

    const imt =
        hitungIMT(
            beratBadan,
            tinggiBadan
        );


    /* =====================================
       TEKANAN DARAH
    ===================================== */

    const sistolElement =
        document.getElementById("sistol");

    const diastolElement =
        document.getElementById("diastol");


    const sistol =
        sistolElement
        ? Number(sistolElement.value)
        : 0;

    const diastol =
        diastolElement
        ? Number(diastolElement.value)
        : 0;


    /* =====================================
       RIWAYAT PENYAKIT
    ===================================== */

    const hipertensi =
        ambilRadio("hipertensi");

    const diabetes =
        ambilRadio("diabetes");

    const perdarahan =
        ambilRadio("perdarahan");


    /* =====================================
       SIMPAN DATA KE VARIABEL GLOBAL
    ===================================== */

    dataPemeriksaan = {

        nama: nama,

        umur: umur,

        usiaKehamilan:
            usiaKehamilan,

        jumlahKehamilan:
            jumlahKehamilan,

        beratBadan:
            beratBadan,

        tinggiBadan:
            tinggiBadan,

        lila:
            lila,

        imt:
            imt,

        sistol:
            sistol,

        diastol:
            diastol,

        hipertensi:
            hipertensi,

        diabetes:
            diabetes,

        perdarahan:
            perdarahan

    };


    /* =====================================
       VALIDASI
    ===================================== */

    if(nama === ""){

        alert(
            "Nama ibu belum tersedia. Silakan lengkapi profil."
        );

        return;

    }


    if(
        !umur ||
        umur <= 0
    ){

        alert(
            "Umur ibu belum tersedia."
        );

        return;

    }


    if(
        !sistol ||
        !diastol ||
        sistol <= 0 ||
        diastol <= 0
    ){

        alert(
            "Masukkan tekanan darah sistol dan diastol."
        );

        return;

    }


    /* =====================================
       HITUNG SKOR
    ===================================== */

    hitungSkor(
        umur,
        sistol,
        diastol,
        hipertensi,
        diabetes,
        perdarahan,
        jumlahKehamilan,
        lila,
        imt
    );


    /* =====================================
       TENTUKAN STATUS
    ===================================== */

    tentukanStatus();


    /* =====================================
       TAMPILKAN HASIL
    ===================================== */

    tampilkanHasil();


}


/* =========================================
   HITUNG SKOR RISIKO
========================================= */

function hitungSkor(

    umur,
    sistol,
    diastol,
    hipertensi,
    diabetes,
    perdarahan,
    jumlahKehamilan,
    lila,
    imt

){


    /* =====================================
       1. USIA IBU
    ===================================== */

    if(umur < 20){

        skor += 2;

        faktorRisiko.push(
            "Usia ibu kurang dari 20 tahun."
        );

    }


    if(umur > 35){

        skor += 2;

        faktorRisiko.push(
            "Usia ibu lebih dari 35 tahun."
        );

    }


    /* =====================================
       2. JUMLAH KEHAMILAN
    ===================================== */

    if(jumlahKehamilan >= 5){

        skor += 2;

        faktorRisiko.push(
            "Riwayat kehamilan 5 kali atau lebih."
        );

    }


    /* =====================================
       3. RIWAYAT HIPERTENSI
    ===================================== */

    if(hipertensi === "Ya"){

        skor += 2;

        faktorRisiko.push(
            "Memiliki riwayat hipertensi/darah tinggi."
        );

    }


    /* =====================================
       4. RIWAYAT DIABETES
    ===================================== */

    if(diabetes === "Ya"){

        skor += 2;

        faktorRisiko.push(
            "Memiliki riwayat diabetes/penyakit gula."
        );

    }


    /* =====================================
       5. PERDARAHAN
    ===================================== */

    if(perdarahan === "Ya"){

        skor += 3;

        faktorRisiko.push(
            "Mengalami atau memiliki keluhan perdarahan."
        );

        earlyWarning.push(
            "🚨 Perdarahan saat kehamilan memerlukan pemeriksaan segera di fasilitas kesehatan."
        );

    }


    /* =====================================
       6. TEKANAN DARAH
    ===================================== */

    if(
        sistol >= 140 ||
        diastol >= 90
    ){

        skor += 2;

        faktorRisiko.push(
            "Tekanan darah tinggi (≥140/90 mmHg)."
        );

    }


    /* =====================================
       7. HIPERTENSI BERAT
    ===================================== */

    if(
        sistol >= 160 ||
        diastol >= 110
    ){

        skor += 4;

        earlyWarning.push(
            "🚨 Tekanan darah sangat tinggi (≥160/110 mmHg). Segera menuju fasilitas kesehatan."
        );

    }


    /* =====================================
       8. TEKANAN DARAH RENDAH
    ===================================== */

    if(
        sistol < 90 ||
        diastol < 60
    ){

        skor += 1;

        faktorRisiko.push(
            "Tekanan darah rendah (<90/60 mmHg)."
        );

        earlyWarning.push(
            "⚠ Tekanan darah rendah perlu diperhatikan terutama bila disertai pusing, lemas atau perdarahan."
        );

    }


    /* =====================================
       9. LILA / KEK
    ===================================== */

    if(lila > 0){

        if(lila < 23.5){

            skor += 2;

            faktorRisiko.push(
                "LILA kurang dari 23,5 cm, mengarah pada risiko KEK."
            );

        }

    }


    /* =====================================
       10. IMT
    ===================================== */

    /*
       IMT tetap dihitung dan disimpan sebagai
       informasi antropometri.

       Namun IMT tidak otomatis menambah skor
       risiko selama kehamilan karena berat badan
       ibu berubah sesuai usia kehamilan.
    */

    if(imt > 0){

        const kategori =
            kategoriIMT(imt);

        if(imt < 18.5){

            faktorRisiko.push(
                "IMT sebelum/awal kehamilan dapat berada pada kategori rendah (" +
                imt.toFixed(1) +
                ")."
            );

        }

        else if(imt >= 25){

            faktorRisiko.push(
                "IMT sebelum/awal kehamilan dapat berada pada kategori " +
                kategori +
                " (" +
                imt.toFixed(1) +
                ")."
            );

        }

    }


    /* =====================================
       11. TANDA BAHAYA
    ===================================== */

    const nyeriKepala =
        document.getElementById(
            "nyeriKepala"
        );

    const pandanganKabur =
        document.getElementById(
            "pandanganKabur"
        );

    const kejang =
        document.getElementById(
            "kejang"
        );

    const gerakJanin =
        document.getElementById(
            "gerakJanin"
        );

    const sesak =
        document.getElementById(
            "sesak"
        );

    const demam =
        document.getElementById(
            "demam"
        );


    /* =====================================
       NYERI KEPALA
    ===================================== */

    if(
        nyeriKepala &&
        nyeriKepala.checked
    ){

        skor += 2;

        faktorRisiko.push(
            "Nyeri kepala hebat."
        );

        earlyWarning.push(
            "⚠ Nyeri kepala hebat pada kehamilan memerlukan pemeriksaan segera, terutama bila disertai tekanan darah tinggi."
        );

    }


    /* =====================================
       PANDANGAN KABUR
    ===================================== */

    if(
        pandanganKabur &&
        pandanganKabur.checked
    ){

        skor += 2;

        faktorRisiko.push(
            "Pandangan kabur."
        );

        earlyWarning.push(
            "⚠ Pandangan kabur perlu segera diperiksa."
        );

    }


    /* =====================================
       KEJANG
    ===================================== */

    if(
        kejang &&
        kejang.checked
    ){

        skor += 5;

        faktorRisiko.push(
            "Kejang."
        );

        earlyWarning.push(
            "🚨 Kejang merupakan keadaan gawat darurat. Segera menuju fasilitas kesehatan."
        );

    }


    /* =====================================
       GERAKAN JANIN BERKURANG
    ===================================== */

    if(
        gerakJanin &&
        gerakJanin.checked
    ){

        skor += 3;

        faktorRisiko.push(
            "Gerakan janin berkurang."
        );

        earlyWarning.push(
            "🚨 Gerakan janin berkurang memerlukan pemeriksaan segera."
        );

    }


    /* =====================================
       SESAK NAPAS
    ===================================== */

    if(
        sesak &&
        sesak.checked
    ){

        skor += 3;

        faktorRisiko.push(
            "Sesak napas."
        );

        earlyWarning.push(
            "🚨 Sesak napas yang berat atau memburuk memerlukan pemeriksaan segera."
        );

    }


    /* =====================================
       DEMAM
    ===================================== */

    if(
        demam &&
        demam.checked
    ){

        skor += 2;

        faktorRisiko.push(
            "Demam tinggi."
        );

        earlyWarning.push(
            "⚠ Demam tinggi saat kehamilan perlu diperiksa oleh tenaga kesehatan."
        );

    }

}


/* =========================================
   TENTUKAN STATUS
========================================= */

function tentukanStatus(){


    /*
       EARLY WARNING / KONDISI DARURAT
       diprioritaskan dibanding skor.
    */

    if(earlyWarning.length > 0){

        status = "🔴 Risiko Tinggi";

        warna = "#F44336";

        rekomendasi = [

            "Segera lakukan pemeriksaan oleh tenaga kesehatan.",

            "Jika terdapat tanda kegawatan, segera menuju fasilitas kesehatan atau Rumah Sakit.",

            "Jangan menunda pemeriksaan.",

            "Bawa buku KIA dan informasi hasil pemeriksaan bila tersedia."

        ];

        return;

    }


    /* =====================================
       RISIKO BERDASARKAN SKOR
    ===================================== */

    if(skor <= 2){

        status = "🟢 Risiko Rendah";

        warna = "#4CAF50";

        rekomendasi = [

            "Lanjutkan pemeriksaan kehamilan sesuai jadwal.",

            "Minum Tablet Tambah Darah sesuai anjuran.",

            "Konsumsi makanan bergizi seimbang.",

            "Istirahat yang cukup.",

            "Tetap pantau keluhan selama kehamilan."

        ];

    }

    else if(skor <= 6){

        status = "🟡 Risiko Sedang";

        warna = "#FFC107";

        rekomendasi = [

            "Lakukan konsultasi dengan bidan atau tenaga kesehatan.",

            "Pantau tekanan darah secara berkala.",

            "Jangan melewatkan pemeriksaan kehamilan.",

            "Perhatikan tanda bahaya kehamilan.",

            "Segera periksa jika muncul keluhan yang memburuk."

        ];

    }

    else{

        status = "🔴 Risiko Tinggi";

        warna = "#F44336";

        rekomendasi = [

            "Segera konsultasikan kondisi kepada bidan atau dokter.",

            "Jangan menunda pemeriksaan.",

            "Pertimbangkan pemeriksaan di fasilitas kesehatan sesuai arahan tenaga kesehatan.",

            "Datang bersama suami atau pendamping jika memungkinkan.",

            "Ikuti seluruh anjuran tenaga kesehatan."

        ];

    }

}


/* =========================================
   TAMPILKAN HASIL
========================================= */

function tampilkanHasil(){


    const nama =
        dataPemeriksaan.nama;

    const umur =
        dataPemeriksaan.umur;

    const usiaKehamilan =
        dataPemeriksaan.usiaKehamilan;

    const jumlahKehamilan =
        dataPemeriksaan.jumlahKehamilan;

    const beratBadan =
        dataPemeriksaan.beratBadan;

    const tinggiBadan =
        dataPemeriksaan.tinggiBadan;

    const lila =
        dataPemeriksaan.lila;

    const imt =
        dataPemeriksaan.imt;

    const sistol =
        dataPemeriksaan.sistol;

    const diastol =
        dataPemeriksaan.diastol;


    /* =====================================
       FAKTOR RISIKO
    ===================================== */

    let daftarFaktor = "";

    if(faktorRisiko.length > 0){

        daftarFaktor = "<ul>";

        faktorRisiko.forEach(
            function(item){

                daftarFaktor +=
                    "<li>" +
                    item +
                    "</li>";

            }
        );

        daftarFaktor += "</ul>";

    }

    else{

        daftarFaktor =
            "Tidak ditemukan faktor risiko berdasarkan data yang dimasukkan.";

    }


    /* =====================================
       EARLY WARNING
    ===================================== */

    let daftarWarning = "";

    if(earlyWarning.length > 0){

        daftarWarning = "<ul>";

        earlyWarning.forEach(
            function(item){

                daftarWarning +=
                    "<li>" +
                    item +
                    "</li>";

            }
        );

        daftarWarning += "</ul>";

    }

    else{

        daftarWarning =
            "Tidak ada tanda bahaya yang terdeteksi dari data pemeriksaan.";

    }


    /* =====================================
       REKOMENDASI
    ===================================== */

    let daftarRekomendasi = "<ul>";

    rekomendasi.forEach(
        function(item){

            daftarRekomendasi +=
                "<li>" +
                item +
                "</li>";

        }
    );

    daftarRekomendasi += "</ul>";


    /* =====================================
       FORMAT IMT
    ===================================== */

    let tampilanIMT = "-";

    if(imt > 0){

        tampilanIMT =
            imt.toFixed(1) +
            " (" +
            kategoriIMT(imt) +
            ")";

    }


    /* =====================================
       HASIL KE HTML
    ===================================== */

    const hasilElement =
        document.getElementById("hasil");


    if(!hasilElement){

        console.error(
            "Element #hasil tidak ditemukan."
        );

        return;

    }


    hasilElement.innerHTML = `

        <h2>HASIL SKRINING</h2>

        <hr>

        <b>Nama :</b>
        ${nama}

        <br>

        <b>Umur :</b>
        ${umur} Tahun

        <br>

        <b>Usia Kehamilan :</b>
        ${usiaKehamilan} Minggu

        <br>

        <b>Jumlah Kehamilan :</b>
        ${jumlahKehamilan} kali

        <br>

        <b>Berat Badan :</b>
        ${beratBadan || "-"} kg

        <br>

        <b>Tinggi Badan :</b>
        ${tinggiBadan || "-"} cm

        <br>

        <b>LILA :</b>
        ${lila || "-"} cm

        <br>

        <b>IMT :</b>
        ${tampilanIMT}

        <br>

        <b>Tekanan Darah :</b>
        ${sistol}/${diastol} mmHg

        <br>

        <b>Skor :</b>
        ${skor}

        <br><br>

        <h3 style="color:${warna}">
            ${status}
        </h3>

        <hr>

        <h3>
            ⚠ Faktor Risiko
        </h3>

        ${daftarFaktor}

        <hr>

        <h3>
            🚨 Early Warning
        </h3>

        ${daftarWarning}

        <hr>

        <h3>
            📋 Rekomendasi
        </h3>

        ${daftarRekomendasi}

        <br>

        <button
            type="button"
            onclick="simpanRiwayat()"
        >
            💾 Simpan Riwayat
        </button>

    `;


    /* =====================================
       SIMPAN KE FIREBASE
    ===================================== */

    if(
        typeof window.simpanHasilSkrining ===
        "function"
    ){

        window.simpanHasilSkrining({

            nama:
                nama,

            umur:
                umur,

            usiaKehamilan:
                usiaKehamilan,

            jumlahKehamilan:
                jumlahKehamilan,

            beratBadan:
                beratBadan,

            tinggiBadan:
                tinggiBadan,

            lila:
                lila,

            imt:
                imt,

            sistol:
                sistol,

            diastol:
                diastol,

            hipertensi:
                dataPemeriksaan.hipertensi,

            diabetes:
                dataPemeriksaan.diabetes,

            perdarahan:
                dataPemeriksaan.perdarahan,

            skor:
                skor,

            status:
                status,

            faktorRisiko:
                faktorRisiko,

            earlyWarning:
                earlyWarning,

            rekomendasi:
                rekomendasi

        });

    }

    else{

        console.error(
            "simpanHasilSkrining tidak ditemukan."
        );

    }

}


/* =========================================
   SIMPAN RIWAYAT
========================================= */

function simpanRiwayat(){

    alert(
        "Data skrining sudah otomatis disimpan ke database."
    );

}


/* =========================================
   PENTING
   Agar onclick="ambilData()"
   pada HTML tetap bekerja.
========================================= */

window.ambilData =
    ambilData;

window.simpanRiwayat =
    simpanRiwayat;