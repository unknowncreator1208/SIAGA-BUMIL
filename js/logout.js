import {

    auth

}

from "./firebase.js";

import {

    signOut

}

from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";

const tombol = document.getElementById("btnLogout");

if(tombol){

    tombol.addEventListener("click", async function(){

        const yakin = confirm(

            "Apakah Anda yakin ingin logout?"

        );

        if(!yakin){

            return;

        }

        try{

            await signOut(auth);

            window.location.href="../login.html";

        }

        catch(error){

            alert(error.message);

        }

    });

}