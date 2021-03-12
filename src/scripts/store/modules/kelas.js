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
                    headers: {
                        'Authorization' : token
                    }
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
                axios.get(env.base_url+'single-kelas&id='+id,{
                    headers: {
                        'Authorization' : token
                    }
                }).then(response => {
                    commit('SET_SINGLE_KELAS',response.data)
                    resolve(response)
                }).catch(error => {
                    resolve(error.response)
                    // console.log(error)
                })
            })
        }
    },
};