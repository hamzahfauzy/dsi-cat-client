export default {
    namespaced: true,
    state: {
        all_kelas:{},
        single_kelas:{},
    },

    mutations: {
        SET_ALL_KELAS(state, value) {
            state.all_kelas = value
        },
        SET_SINGLE_KELAS(state,value){
            state.single_kelas = value
        }
    },

    getters: {
        getAllKelas: (state) => state.all_kelas,
        getSingleKelas: (state) => state.single_kelas
    },

    actions: {
        fetchAllKelas(state, endpoint){
            var token = this.state.global.token
            return new Promise(function(resolve, reject) {
                axios.get(env.base_url+endpoint,{
                    headers: {'Authorization':'Bearer '+token}
                }).then(response => {
                    resolve(response)
                }).catch(error => {
                    resolve(error.response)
                    // console.log(error)
                })
            })
        },
        fetchSingleKelas({commit}, id){
            var token = this.state.global.token
            return new Promise(function(resolve, reject) {
                axios.get(env.base_url+'site/single-kelas?id_pelatihan='+id,{
                    headers: {
                        'Authorization':'Bearer '+token
                    }
                }).then(response => {
                    commit('SET_SINGLE_KELAS',response.data)
                    resolve(response)
                }).catch(error => {
                    resolve(error.response)
                    // console.log(error)
                })
            })
        },
        fetchMateri({commit}, id){
            var token = this.state.global.token
            return new Promise(function(resolve, reject) {
                axios.get(env.base_url+'pelatihan/single-materi?id_materi='+id,{
                    headers: {
                        'Authorization':'Bearer '+token
                    }
                }).then(response => {
                    resolve(response)
                }).catch(error => {
                    resolve(error.response)
                    // console.log(error)
                })
            })
        },
        finishMateri({commit}, id){
            var token = this.state.global.token
            return new Promise(function(resolve, reject) {
                axios.get(env.base_url+'pelatihan/finish-materi?id_materi='+id,{
                    headers: {
                        'Authorization':'Bearer '+token
                    }
                }).then(response => {
                    resolve(response)
                }).catch(error => {
                    resolve(error.response)
                    // console.log(error)
                })
            })
        },
        fetchKelasSaya(){
            var token = this.state.global.token
            return new Promise(function(resolve) {
                axios.get(env.base_url+'pelatihan/index',{
                    headers: {'Authorization':'Bearer '+token}
                }).then(response => {
                    resolve(response)
                }).catch(error => {
                    resolve(error.response)
                    // console.log(error)
                })
            })
        },
        postIkuti({commit},id){
            var token = this.state.global.token
            return new Promise(function(resolve, reject) {
                var formData = new FormData;
                formData.append('id_pelatihan',id)
                axios.post(env.base_url+'pelatihan/insert',formData,{
                    headers: {
                        "Content-Type": "multipart/form-data",
                        'Authorization':'Bearer '+token
                    }
                }).then(response => {
                    resolve(response)
                }).catch(error => {
                    resolve(error.response)
                    // console.log(error)
                })
            })
        }
    },
};