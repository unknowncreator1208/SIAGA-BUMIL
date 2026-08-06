import {

    auth,

    db,

    doc,

    getDoc

}

from "./firebase.js";

import {

    onAuthStateChanged

}

from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";

onAuthStateChanged(auth, async function(user){

    if(!user){

        window.location.href="../login.html";

        return;

    }

    try{

        const snapshot = await getDoc(

            doc(

                db,

                "users",

                user.uid

            )

        );

        if(!snapshot.exists()){

            alert("Data pengguna tidak ditemukan.");

            return;

        }

        const data = snapshot.data();

        const nama = data.profil?.nama || data.nama || "-";
        
        document.getElementById("welcomeText").innerHTML =
        "Selamat Datang, " + nama;

        document.getElementById("roleText").innerHTML =
        "Role : " + (data.role || "-");

    }

    catch(error){

        console.error(error);

        alert(error.message);

    }

});
