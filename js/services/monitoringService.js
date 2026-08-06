// =====================================
// SIAGA BUMIL
// Monitoring Service
// =====================================

import {

    db,

    collection,

    addDoc,

    getDocs,

    query,

    orderBy,

    serverTimestamp

}

from "../firebase.js";

class MonitoringService{

    // =====================================
    // Simpan Monitoring
    // =====================================

    static async simpanMonitoring(uid,tanggal,status){

        await addDoc(

            collection(

                db,

                "users",

                uid,

                "monitoringTTD"

            ),

            {

                tanggal,

                status,

                createdAt: serverTimestamp()

            }

        );

    }


    // =====================================
    // Ambil Semua Monitoring
    // =====================================

    static async getMonitoring(uid){

        const q = query(

            collection(

                db,

                "users",

                uid,

                "monitoringTTD"

            ),

            orderBy("createdAt","asc")

        );

        const snapshot = await getDocs(q);

        const data = [];

        snapshot.forEach((doc)=>{

            data.push({

                id:doc.id,

                ...doc.data()

            });

        });

        return data;

    }


    // =====================================
    // Hitung Progress
    // =====================================

    static hitungProgress(data,target=180){

        let jumlahMinum = 0;

        data.forEach((item)=>{

            if(item.status==="Sudah"){

                jumlahMinum++;

            }

        });

        return{

            jumlah:jumlahMinum,

            persen:(jumlahMinum/target)*100

        };

    }

}

export default MonitoringService;