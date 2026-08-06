const Storage = {

    simpan(key, data){

        localStorage.setItem(

            key,

            JSON.stringify(data)

        );

    },

    ambil(key){

        let data = localStorage.getItem(key);

        if(data){

            return JSON.parse(data);

        }

        return null;

    },

    hapus(key){

        localStorage.removeItem(key);

    }

};

