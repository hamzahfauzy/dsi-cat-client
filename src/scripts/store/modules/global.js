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
            return axios.post(env.base_url+'login', payload, {
                headers: { "Content-Type": "multipart/form-data" }
            })
        },
        validateToken(state, payload){
            return axios.post(env.base_url+'validate-token', payload, {
                headers: { 
                    "Content-Type": "multipart/form-data",
                    "Authorization": payload.get('token')
                }
            })
        },
        logout(){
            window.localStorage.removeItem('token')
        }
    },
};