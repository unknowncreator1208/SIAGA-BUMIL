// ======================================
// User Service
// ======================================

import {

    db,
    collection,
    getDocs,
    query,
    orderBy,
    limit

}

from "../firebase.js";

class UserService{

    static async getSemuaIbu(){

        const snapshot = await getDocs(

            collection(db,"users")

        );

        const hasil = [];

        for(const userDoc of snapshot.docs){

            const data = userDoc.data();

            if(

                data.role != "ibu" &&

                data.role != "ibuHamil"

            ){

                continue;

            }

            let statusRisiko = "-";
            let skor = "-";
            let tanggalSkrining = "-";

            try{

                const q = query(

                    collection(

                        db,

                        "users",

                        userDoc.id,

                        "skrining"

                    ),

                    orderBy("createdAt","desc"),

                    limit(1)

                );

                const skrining = await getDocs(q);

                if(!skrining.empty){
                    
                    const terakhir = skrining.docs[0].data();
                    
                    statusRisiko = terakhir.status;
                    
                    skor = terakhir.skor;
                    
                    if(terakhir.createdAt){
                        
                        tanggalSkrining =
                        terakhir.createdAt
                        .toDate()
                        .toLocaleDateString("id-ID");
                    }
                }

            }

            catch(error){

                console.log(error);

            }

            hasil.push({

                uid: userDoc.id,

                ...data,

                statusRisikoTerakhir: statusRisiko,

                skorTerakhir: skor,

                 tanggalSkrining: tanggalSkrining

            });

        }

        return hasil;

    }

} 

export default UserService;