/* =====================================
   SIAGA BUMIL
   skrining.js
===================================== */


/* =====================================
   VARIABEL GLOBAL
===================================== */

let skor = 0;
let status = "";
let rekomendasi = [];
let warna = "";
let faktorRisiko = [];
let earlyWarning = [];


/* =====================================
   RESET DATA
===================================== */

function resetData(){

    skor = 0;
    status = "";
    rekomendasi = [];
    warna = "";
    faktorRisiko = [];
    earlyWarning = [];

}


/* =====================================
   AMBIL RADIO BUTTON
===================================== */

function ambilRadio(namaRadio){

    const radio = document.querySelector(
        'input[name="' + namaRadio + '"]:checked'
    );

    if(radio){

        return radio.value;

    }

    return "Tidak";

}


/* =====================================
   HITUNG RISIKO
===================================== */

function ambilData(){

    resetData();


    /* ================================
       IDENTITAS
    ================================= */

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
        namaElement ? namaElement.value : "";

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


    /* ================================
       ANTROPOMETRI
    ================================= */

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


    /* ================================
       HITUNG IMT
    ================================= */

    let imt = 0;

    if(
        beratBadan > 0 &&
        tinggiBadan > 0
    ){

        imt =
            beratBadan /
            Math.pow(
                tinggiBadan / 100,
                2
            );

    }


    /* ================================
       TAMPILKAN IMT
    ================================= */

    const imtElement =
        document.getElementById("imt");

    if(imtElement){

        imtElement.value =
            imt > 0
            ? imt.toFixed(1)
            : "";

    }


    /* ================================
       TEKANAN DARAH
    ================================= */

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


    /* ================================
       FAKTOR RISIKO
    ================================= */

    const hipertensi =
        ambilRadio("hipertensi");

    const diabetes =
        ambilRadio("diabetes");

    const perdarahan =
        ambilRadio("perdarahan");


    /* ================================
       VALIDASI
    ================================= */

    if(nama === ""){

        alert("Nama belum tersedia.");

        return;

    }


    if(
        !sistol ||
        !diastol
    ){

        alert(
            "Masukkan tekanan darah sistol dan diastol."
        );

        return;

    }


    /* ================================
       HITUNG SKOR
    ================================= */

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


    /* ================================
       STATUS
    ================================= */

    tentukanStatus();


    /* ================================
       TAMPILKAN HASIL
    ================================= */

    tampilkanHasil({

        nama,
        umur,
        usiaKehamilan,
        jumlahKehamilan,
        beratBadan,
        tinggiBadan,
        lila,
        imt,
        sistol,
        diastol

    });

}


/* =====================================
   TAMPILKAN HASIL
===================================== */

function tampilkanHasil(data){

    const {

        nama,
        umur,
        usiaKehamilan,
        jumlahKehamilan,
        beratBadan,
        tinggiBadan,
        lila,
        imt,
        sistol,
        diastol

    } = data;


    /* ================================
       FAKTOR RISIKO
    ================================= */

    let daftarFaktor = "";

    if(faktorRisiko.length > 0){

        daftarFaktor = "<ul>";

        faktorRisiko.forEach(function(item){

            daftarFaktor +=
                "<li>" + item + "</li>";

        });

        daftarFaktor += "</ul>";

    }
    else{

        daftarFaktor =
            "Tidak ditemukan faktor risiko.";

    }


    /* ================================
       EARLY WARNING
    ================================= */

    let daftarWarning = "";

    if(earlyWarning.length > 0){

        daftarWarning = "<ul>";

        earlyWarning.forEach(function(item){

            daftarWarning +=
                "<li>" + item + "</li>";

        });

        daftarWarning += "</ul>";

    }
    else{

        daftarWarning =
            "Tidak ada tanda bahaya.";

    }


    /* ================================
       REKOMENDASI
    ================================= */

    let daftarRekomendasi = "<ul>";

    rekomendasi.forEach(function(item){

        daftarRekomendasi +=
            "<li>" + item + "</li>";

    });

    daftarRekomendasi += "</ul>";


    /* ================================
       HASIL
    ================================= */

    const hasil =
        document.getElementById("hasil");


    if(!hasil){

        console.error(
            "Element #hasil tidak ditemukan."
        );

        return;

    }


    hasil.innerHTML = `

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
        ${imt ? imt.toFixed(1) : "-"} kg/m²

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

        <h3>⚠ Faktor Risiko</h3>

        ${daftarFaktor}

        <hr>

        <h3>🚨 Early Warning</h3>

        ${daftarWarning}

        <hr>

        <h3>📋 Rekomendasi</h3>

        ${daftarRekomendasi}

        <br>

        <button
            type="button"
            onclick="simpanRiwayat()"
        >
            💾 Simpan Riwayat
        </button>

    `;


    /* ================================
       SIMPAN KE FIREBASE
    ================================= */

    if(
        typeof window.simpanHasilSkrining ===
        "function"
    ){

        window.simpanHasilSkrining({

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

}


/* =====================================
   SIMPAN RIWAYAT
===================================== */

function simpanRiwayat(){

    alert(
        "Data sudah otomatis tersimpan ke database."
    );

}


/* =====================================
   HITUNG SKOR
===================================== */

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

    /* ================================
       UMUR
    ================================= */

    if(umur < 20){

        skor += 2;

        faktorRisiko.push(
            "Usia ibu kurang dari 20 tahun"
        );

    }


    if(umur > 35){

        skor += 2;

        faktorRisiko.push(
            "Usia ibu lebih dari 35 tahun"
        );

    }


    /* ================================
       HIPERTENSI / DARAH TINGGI
    ================================= */

    if(hipertensi === "Ya"){

        skor += 2;

        faktorRisiko.push(
            "Memiliki riwayat hipertensi / darah tinggi"
        );

    }


    /* ================================
       DIABETES / PENYAKIT GULA
    ================================= */

    if(diabetes === "Ya"){

        skor += 2;

        faktorRisiko.push(
            "Memiliki riwayat diabetes / penyakit gula"
        );

    }


    /* ================================
       PERDARAHAN
    ================================= */

    if(perdarahan === "Ya"){

        skor += 3;

        faktorRisiko.push(
            "Mengalami perdarahan"
        );

        earlyWarning.push(
            "🚨 Perdarahan saat hamil merupakan keadaan darurat. Segera menuju fasilitas kesehatan."
        );

    }


    /* ================================
       JUMLAH KEHAMILAN
    ================================= */

    if(jumlahKehamilan >= 5){

        skor += 2;

        faktorRisiko.push(
            "Kehamilan 5 kali atau lebih"
        );

    }


    /* ================================
       TEKANAN DARAH
    ================================= */

    if(
        sistol >= 140 ||
        diastol >= 90
    ){

        skor += 2;

        faktorRisiko.push(
            "Tekanan darah tinggi"
        );

    }


    /* ================================
       HIPERTENSI BERAT
    ================================= */

    if(
        sistol >= 160 ||
        diastol >= 110
    ){

        skor += 4;

        earlyWarning.push(
            "🚨 Hipertensi berat. Segera ke Rumah Sakit."
        );

    }


    /* ================================
       HIPOTENSI
    ================================= */

    if(
        sistol < 90 ||
        diastol < 60
    ){

        skor += 2;

        faktorRisiko.push(
            "Tekanan darah rendah"
        );

        earlyWarning.push(
            "⚠ Tekanan darah rendah. Bila disertai pusing, lemas atau perdarahan segera ke fasilitas kesehatan."
        );

    }


    /* ================================
       LILA
    ================================= */

    if(
        lila > 0 &&
        lila < 23.5
    ){

        skor += 2;

        faktorRisiko.push(
            "LILA kurang dari 23,5 cm (risiko KEK)"
        );

    }


    /* ================================
       IMT
    ================================= */

    if(imt > 0){

        if(imt < 18.5){

            skor += 2;

            faktorRisiko.push(
                "IMT kurang (kurus)"
            );

        }

        else if(
            imt >= 25 &&
            imt < 30
        ){

            skor += 1;

            faktorRisiko.push(
                "IMT berlebih"
            );

        }

        else if(imt >= 30){

            skor += 2;

            faktorRisiko.push(
                "Obesitas"
            );

        }

    }


    /* ================================
       TANDA BAHAYA
    ================================= */

    const nyeriKepala =
        document.getElementById(
            "nyeriKepala"
        );

    if(
        nyeriKepala &&
        nyeriKepala.checked
    ){

        skor += 2;

        faktorRisiko.push(
            "Nyeri kepala hebat"
        );

        earlyWarning.push(
            "⚠ Nyeri kepala hebat dapat menjadi tanda preeklamsia."
        );

    }


    const pandanganKabur =
        document.getElementById(
            "pandanganKabur"
        );

    if(
        pandanganKabur &&
        pandanganKabur.checked
    ){

        skor += 2;

        faktorRisiko.push(
            "Pandangan kabur"
        );

        earlyWarning.push(
            "⚠ Pandangan kabur perlu segera diperiksa."
        );

    }


    const kejang =
        document.getElementById("kejang");

    if(
        kejang &&
        kejang.checked
    ){

        skor += 5;

        faktorRisiko.push(
            "Kejang"
        );

        earlyWarning.push(
            "🚨 Kejang merupakan keadaan gawat darurat."
        );

    }


    const gerakJanin =
        document.getElementById(
            "gerakJanin"
        );

    if(
        gerakJanin &&
        gerakJanin.checked
    ){

        skor += 3;

        faktorRisiko.push(
            "Gerakan janin berkurang"
        );

        earlyWarning.push(
            "🚨 Gerakan janin berkurang. Segera ke fasilitas kesehatan."
        );

    }


    const sesak =
        document.getElementById("sesak");

    if(
        sesak &&
        sesak.checked
    ){

        skor += 3;

        faktorRisiko.push(
            "Sesak napas"
        );

        earlyWarning.push(
            "🚨 Sesak napas saat hamil memerlukan pemeriksaan segera."
        );

    }


    const demam =
        document.getElementById("demam");

    if(
        demam &&
        demam.checked
    ){

        skor += 2;

        faktorRisiko.push(
            "Demam tinggi"
        );

        earlyWarning.push(
            "⚠ Demam tinggi saat hamil harus diperiksa."
        );

    }

}


/* =====================================
   STATUS RISIKO
===================================== */

function tentukanStatus(){

    if(skor <= 2){

        status =
            "🟢 Risiko Rendah";

        warna =
            "#4CAF50";

        rekomendasi = [

            "Lanjutkan ANC sesuai jadwal.",

            "Minum Tablet Tambah Darah setiap hari.",

            "Konsumsi makanan bergizi.",

            "Istirahat yang cukup."

        ];

    }

    else if(skor <= 6){

        status =
            "🟡 Risiko Sedang";

        warna =
            "#FFC107";

        rekomendasi = [

            "Periksa ke Puskesmas dalam waktu dekat.",

            "Pantau tekanan darah.",

            "Jangan melewatkan ANC.",

            "Segera datang bila muncul keluhan."

        ];

    }

    else{

        status =
            "🔴 Risiko Tinggi";

        warna =
            "#F44336";

        rekomendasi = [

            "Segera ke Bidan atau Rumah Sakit.",

            "Jangan menunda pemeriksaan.",

            "Datang bersama keluarga.",

            "Ikuti semua anjuran tenaga kesehatan."

        ];

    }

}


/* =====================================
   AGAR onclick="ambilData()" BEKERJA
===================================== */

window.ambilData = ambilData;

window.simpanRiwayat = simpanRiwayat;