function simpanProfil(){

    const profil = {

        nama: document.getElementById("nama").value,
        umur: document.getElementById("umur").value,
        nik: document.getElementById("nik").value,
        tanggalLahir: document.getElementById("tanggalLahir").value,
        usiaKehamilan: document.getElementById("usiaKehamilan").value,
        golonganDarah : document.getElementById("golonganDarah").value,
        nomorHP: document.getElementById("nomorHP").value,
        alamat: document.getElementById("alamat").value,
        hpl: document.getElementById("hpl").value

    };

    Storage.simpan(
        "profilIbu",
        profil
    );

    alert("Profil berhasil disimpan.");


}

window.onload = function(){

    let profil = Storage.ambil("profilIbu");

    if(profil){

        document.getElementById("nama").value = profil.nama;
        document.getElementById("umur").value = profil.umur;
        document.getElementById("nik").value = profil.nik;
        document.getElementById("tanggalLahir").value = profil.tanggalLahir;
        document.getElementById("usiaKehamilan").value = profil.usiaKehamilan;
        document.getElementById("golonganDarah").value = profil.golonganDarah;
        document.getElementById("nomorHP").value = profil.nomorHP;
        document.getElementById("alamat").value = profil.alamat;
        document.getElementById("hpl").value = profil.hpl;

    }

}
