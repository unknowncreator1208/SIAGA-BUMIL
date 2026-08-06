import {

db,

collection,

getDocs,

query,
where

}

from "../firebase.js";

class PetugasService{

static async getSemuaPetugas(){

const q = query(

collection(db,"users"),

where("role","in",["bidan","kader"])

);

const snapshot = await getDocs(q);

const hasil = [];

snapshot.forEach((doc)=>{

hasil.push({

id:doc.id,

...doc.data()

});

});

return hasil;

}

}

export default PetugasService;