let nomor = 1;

let daftarIbu = [];

function tambahIbu(){

let nama = document.getElementById("nama").value;

let nik = document.getElementById("nik").value;

let umur = document.getElementById("umur").value;

let hp = document.getElementById("hp").value;

let alamat = document.getElementById("alamat").value;

let usiaKehamilan = document.getElementById("usiaKehamilan").value;

let jumlahKehamilan = document.getElementById("jumlahKehamilan").value;

let beratBadan = document.getElementById("beratBadan").value;

let tinggiBadan = document.getElementById("tinggiBadan").value;

let lila = document.getElementById("lila").value;

if(nama=="" || nik==""){

alert("Data belum lengkap.");

return;

}

daftarIbu.push({

nama,

nik,

umur,

hp,

alamat

});

tampilkanData();

document.getElementById("formIbu").reset();

}

function tampilkanData(){

let tbody=document.querySelector("#tabelIbu tbody");

tbody.innerHTML="";

nomor=1;

daftarIbu.forEach(function(ibu){

let row=tbody.insertRow();

row.insertCell(0).innerHTML=nomor++;

row.insertCell(1).innerHTML=ibu.nama;

row.insertCell(2).innerHTML=ibu.nik;

row.insertCell(3).innerHTML=ibu.umur;

row.insertCell(4).innerHTML=ibu.hp;

row.insertCell(5).innerHTML="<button>Lihat</button>";

});

}