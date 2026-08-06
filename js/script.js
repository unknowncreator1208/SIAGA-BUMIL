function login(){

    let username = document.getElementById("username").value;

    let password = document.getElementById("password").value;

    if(username == "admin" && password == "12345"){

        alert("Login Berhasil");

        window.location.href = "dashboard.html";

    }else{

        alert("Username atau Password Salah");

    }

}
