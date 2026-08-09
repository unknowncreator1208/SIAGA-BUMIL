window.onload = function(){

    let profil = Storage.ambil("profilIbu");

    if(profil){

        document.getElementById("nama").value = profil.nama;
        document.getElementById("umur").value = profil.umur;
        document.getElementById("nik").value = profil.nik;
        document.getElementById("tanggalLahir").value = profil.tanggalLahir;
        document.getElementById("usiaKehamilan").value = profil.usiaKehamilan;
        document.getElementById("jumlahKehamilan").value = profil.jumlahKehamilan;
        document.getElementById("beratBadan").value = profil.beratBadan;
        document.getElementById("tinggiBadan").value = profil.tinggiBadan;
        document.getElementById("lila").value = profil.lila;
        document.getElementById("golonganDarah").value = profil.golonganDarah;
        document.getElementById("nomorHP").value = profil.nomorHP;
        document.getElementById("alamat").value = profil.alamat;
        document.getElementById("hpl").value = profil.hpl;

    }

}
