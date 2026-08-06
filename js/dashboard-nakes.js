// ======================================
// Dashboard Nakes
// ======================================

import { auth } from "./firebase.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";

import UserService from "./services/userService.js";

let semuaDataIbu = [];

let chartRisiko = null;

onAuthStateChanged(auth, async (user) => {

    if (!user) {

        window.location.href = "../login.html";
        return;

    }

    tampilkanData();

});

async function tampilkanData() {

    semuaDataIbu = await UserService.getSemuaIbu();

    semuaDataIbu.sort((a,b)=>{

    const urutan = {

        "🔴 Risiko Tinggi":0,

        "🟡 Risiko Sedang":1,

        "🟢 Risiko Rendah":2,

        "-":3

    };

    return (
        urutan[a.statusRisikoTerakhir] ?? 3
    ) - (
        urutan[b.statusRisikoTerakhir] ?? 3
    );

});
    
    renderTabel(semuaDataIbu);

    tampilkanPrioritas(semuaDataIbu);

    document.getElementById("totalIbu").innerHTML =
        daftarIbu.length;

    let rendah = 0;
    let sedang = 0;
    let tinggi = 0;

    const tbody =
        document.querySelector("#tabelIbu tbody");

    tbody.innerHTML = "";

    daftarIbu.forEach((ibu, index) => {

        if (ibu.statusRisikoTerakhir == "🟢 Risiko Rendah") {

            rendah++;

        }
        else if (ibu.statusRisikoTerakhir == "🟡 Risiko Sedang") {

            sedang++;

        }
        else {

            tinggi++;

        }

        tbody.innerHTML += `

        <tr>

            <td>${index + 1}</td>

            <td>${ibu.nama ?? "-"}</td>

            <td>${ibu.usiaKehamilan ?? "-"} Minggu</td>

            <td>${ibu.statusRisikoTerakhir ?? "-"}</td>

            <td>

                <button
                onclick="detailIbu('${ibu.uid}')">

                Detail

                </button>

            </td>

        </tr>

        `;

    });

    document.getElementById("rendah").innerHTML = rendah;
    document.getElementById("sedang").innerHTML = sedang;
    document.getElementById("tinggi").innerHTML = tinggi;

}

buatGrafik(

    rendah,

    sedang,

    tinggi

);

window.detailIbu = function(uid){

    window.location.href =
    "../pages/detail-ibu.html?uid=" + uid;

}

function buatGrafik(

    rendah,

    sedang,

    tinggi

){

    const ctx = document
    .getElementById("grafikRisiko");

    if(chartRisiko){

        chartRisiko.destroy();

    }

    chartRisiko = new Chart(ctx,{

        type:"doughnut",

        data:{

            labels:[

                "Risiko Rendah",

                "Risiko Sedang",

                "Risiko Tinggi"

            ],

            datasets:[{

                data:[

                    rendah,

                    sedang,

                    tinggi

                ],

                backgroundColor:[

                    "#4CAF50",

                    "#FFC107",

                    "#F44336"

                ]

            }]

        },

        options:{

            responsive:true,

            plugins:{

                legend:{

                    position:"bottom"

                }

            }

        }

    });

}

function renderTabel(data){

    const tbody =
    document.querySelector("#tabelIbu tbody");

    tbody.innerHTML = "";

    let rendah = 0;
    let sedang = 0;
    let tinggi = 0;

    data.forEach((ibu,index)=>{

        let warna = "";

        if(ibu.statusRisikoTerakhir=="🟢 Risiko Rendah"){

            rendah++;

            warna="#4CAF50";

        }

        else if(ibu.statusRisikoTerakhir=="🟡 Risiko Sedang"){

            sedang++;

            warna="#FFC107";

        }

        else if(ibu.statusRisikoTerakhir=="🔴 Risiko Tinggi"){

            tinggi++;

            warna="#F44336";

        }

        tbody.innerHTML += `
        <tr>
            <td>${index+1}</td>
            <td>${ibu.nama ?? "-"}</td>
            <td>${ibu.usiaKehamilan ?? "-"} Minggu</td>
            <td>${ibu.statusRisikoTerakhir ?? "-"}</td>
            <td>${ibu.tanggalSkrining ?? "-"}</td>
            <td>
                <button onclick="detailIbu('${ibu.uid}')">
                    Detail
                </button>
            </td>
        </tr>
        `;
    });

    document.getElementById("totalIbu").innerHTML=data.length;
    document.getElementById("rendah").innerHTML=rendah;
    document.getElementById("sedang").innerHTML=sedang;
    document.getElementById("tinggi").innerHTML=tinggi;

    buatGrafik(rendah,sedang,tinggi);
}

document
.getElementById("searchNama")
.addEventListener("keyup",filterData);

document
.getElementById("filterRisiko")
.addEventListener("change",filterData);

function filterData(){

    const keyword =
    document
    .getElementById("searchNama")
    .value
    .toLowerCase();

    const risiko =
    document
    .getElementById("filterRisiko")
    .value;

    const hasil =
    semuaDataIbu.filter((ibu)=>{

        const cocokNama =
        (ibu.nama || "")
        .toLowerCase()
        .includes(keyword);

        const cocokRisiko =
        risiko=="Semua" ||
        ibu.statusRisikoTerakhir==risiko;

        return cocokNama && cocokRisiko;

    });

    renderTabel(hasil);

}

function tampilkanPrioritas(data){

    const div =
    document.getElementById(
        "prioritasKunjungan"
    );

    const risikoTinggi =
    data.filter(item =>

        item.statusRisikoTerakhir ==
        "🔴 Risiko Tinggi"

    );

    if(risikoTinggi.length==0){

        div.innerHTML=
        "<p>✅ Tidak ada ibu hamil dengan risiko tinggi.</p>";

        return;

    }

    let html="<ul>";

    risikoTinggi.forEach(item=>{

        html+=`

        <li>

        <b>${item.nama}</b>

        (${item.usiaKehamilan ?? "-"} minggu)

        </li>

        `;

    });

    html+="</ul>";

    div.innerHTML=html;

}