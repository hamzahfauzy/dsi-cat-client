export default {
    namespaced: true,
    state: {
        auth_data:{},
        token:'',
        header_aktif:'',
    },

    mutations: {
        SET_AUTH_DATA(state, value) {
            state.auth_data = value
        },
        SET_TOKEN(state, value) {
            state.token = value
        },
        SET_HEADER_AKTIF(state, value) {
            state.header_aktif = value
        },
    },

    getters: {
        getAuthData: (state) => state.auth_data,
        getHeaderAktif: (state) => state.header_aktif,
    },

    actions: {
        setHeader({commit},value){
            commit('SET_HEADER_AKTIF',value)
        },
        fetchGeneralData({commit}){
            var token = window.localStorage.getItem('token')
            commit("SET_TOKEN", token);
            return token
            // return axios.get(ADMIN.endpoint + "/general/data")
            // .then(response => {
            //     commit("SET_AUTH_DATA", response.data);
            // });
        },
        login(state, payload){
            return new Promise(function(resolve, reject) {
                axios.post(env.base_url+'site/login', payload, {
                    headers: { "Content-Type": "multipart/form-data" }
                }).then(response => {
                    // commit('SET_SINGLE_KELAS',response.data)
                    resolve(response)
                }).catch(error => {
                    resolve(error.response)
                    // console.log(error)
                })
            })
        },
        validateToken(state, payload){
            return axios.get(env.base_url+'site/index', {
                headers: { 
                    "Authorization": "Bearer "+payload.get('token')
                }
            })
        },
        logout(){
            window.localStorage.removeItem('token')
        }
    },
};