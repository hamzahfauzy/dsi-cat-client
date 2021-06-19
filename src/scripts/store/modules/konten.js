export default {
    namespaced: true,
    state: {
        data:[],
        active_konten_id:0
    },

    mutations: {
        SET_DATA(state, value) {
            state.data = value
        },
        SET_ACTIVE_KONTEN_ID(state, value) {
            state.active_konten_id = value
        },
    },

    getters: {
        get: (state) => state.data,
        getActiveKontenId: (state) => state.active_konten_id
    },

    actions: {
        setActiveKontenId({commit},id){
            commit('SET_ACTIVE_KONTEN_ID',id)
        },
        get({commit},id){
            var token = this.state.global.token
            return new Promise(function(resolve, reject) {
                axios.get(env.base_url+'konten/index?id_pelatihan='+id,{
                    headers: {'Authorization':'Bearer '+token}
                }).then(response => {
                    commit('SET_DATA',response.data)
                    resolve(response)
                }).catch(error => {
                    resolve(error.response)
                    // console.log(error)
                })
            })
        },
        create({commit},data){
            var token = this.state.global.token
            return new Promise(function(resolve, reject) {
                var formData = new FormData;
                formData.append('nm_konten',data.nm_konten)
                axios.post(env.base_url+'konten/create?id_pelatihan='+data.id,formData,{
                    headers: {'Authorization':'Bearer '+token},
                }).then(response => {
                    resolve(response)
                }).catch(error => {
                    resolve(error.response)
                    // console.log(error)
                })
            })
        },
        update({commit},data){
            var token = this.state.global.token
            return new Promise(function(resolve, reject) {
                var formData = new FormData;
                formData.append('nm_konten',data.nm_konten)
                axios.post(env.base_url+'update/create?id_pelatihan='+data.id+'&id_konten='+data.id_konten,formData,{
                    headers: {'Authorization':'Bearer '+token},
                }).then(response => {
                    resolve(response)
                }).catch(error => {
                    resolve(error.response)
                    // console.log(error)
                })
            })
        },
        hapus({commit},data){
            var token = this.state.global.token
            return new Promise(function(resolve, reject) {
                axios.get(env.base_url+'konten/delete?id_pelatihan='+data.id+'&id_konten='+data.id_konten,{
                    headers: {'Authorization':'Bearer '+token},
                }).then(response => {
                    resolve(response)
                }).catch(error => {
                    resolve(error.response)
                    // console.log(error)
                })
            })
        },
        createMateri({commit},data){
            var token = this.state.global.token
            return new Promise(function(resolve, reject) {
                var formData = new FormData;
                formData.append('id_konten',data.id_konten)
                formData.append('nm_materi',data.nm_materi)
                formData.append('jenis_materi',data.jenis_materi)
                formData.append('ket_materi',data.ket_materi)
                formData.append('file_url',data.file_url)
                axios.post(env.base_url+'konten/create-materi?id_pelatihan='+data.id+'&id_konten='+data.id_konten,formData,{
                    headers: {'Authorization':'Bearer '+token},
                }).then(response => {
                    resolve(response)
                }).catch(error => {
                    resolve(error.response)
                    // console.log(error)
                })
            })
        },
    },
};