export default {
    namespaced: true,
    state: {
        auth_data:{},
        token:'',
        header_aktif:'',
        nav_sidebar:0,
        profile:{}
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
        SET_PROFILE(state, value) {
            state.profile = value
        },
        SET_NAV_SIDEBAR(state, value){
            state.nav_sidebar = value
        }
    },

    getters: {
        getAuthData: (state) => state.auth_data,
        getHeaderAktif: (state) => state.header_aktif,
        getProfile: (state) => state.profile,
        getNavSidebar: (state) => state.nav_sidebar,
        getToken: (state) => state.token,
    },

    actions: {
        setHeader({commit},value){
            commit('SET_HEADER_AKTIF',value)
        },
        toggleNavSidebar({commit, getters}){
            var s = !getters.getNavSidebar
            commit('SET_NAV_SIDEBAR',s)
        },
        closeNavSidebar({commit}){
            commit('SET_NAV_SIDEBAR',0)
        },
        fetchGeneralData({commit}){
            var token = window.localStorage.getItem('token')
            if(token)
            return new Promise(function(resolve, reject) {
                axios.get(env.base_url+'site/validate-token?token='+token)
                .then(response => {
                    commit("SET_TOKEN", token);
                    commit('SET_AUTH_DATA',response.data)
                    resolve(response.data)
                }).catch(error => {
                    window.localStorage.removeItem('token')
                    resolve(error.response)
                })
            });
            return false
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
        validateToken(state, token){
            return new Promise(function(resolve, reject) {
                axios.get(env.base_url+'site/validate-token?token='+token)
                .then(response => {
                    resolve(response.data)
                }).catch(error => {
                    resolve(error.response)
                })
            });
        },
        fetchProfile({getters,commit}){
            var token = getters.getToken
            return new Promise(function(resolve, reject) {
                axios.get(env.base_url+'site/profile', {
                    headers: { 
                        "Authorization": "Bearer "+token
                    }
                }).then(response => {
                    commit('SET_PROFILE',response.data)
                    resolve(response)
                }).catch(error => {
                    resolve(error.response)
                })
            });
        },
        logout(){
            window.localStorage.removeItem('token')
        }
    },
};