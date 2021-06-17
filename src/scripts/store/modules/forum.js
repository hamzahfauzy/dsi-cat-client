export default {
    namespaced: true,
    state: {
        forum_konten:[],
    },

    mutations: {
        SET_FORUM_KONTEN(state, value) {
            state.forum_konten = value
        }
    },

    getters: {
        getForumKonten: (state) => state.forum_konten
    },

    actions: {
        setForumKonten({commit},value){
            commit('SET_FORUM_KONTEN',value)
        },
        fetchForumKonten({commit},id){
            var token = this.state.global.token
            return new Promise(function(resolve, reject) {
                axios.get(env.base_url+'forum-diskusi/get-forum?id_pelatihan='+id,{
                    headers: {'Authorization':'Bearer '+token}
                }).then(response => {
                    commit('SET_FORUM_KONTEN',response.data)
                    resolve(response)
                }).catch(error => {
                    resolve(error.response)
                    // console.log(error)
                })
            })
        },
        postForumKonten({commit},data){
            var token = this.state.global.token
            return new Promise(function(resolve, reject) {
                axios.get(env.base_url+'forum-diskusi/send-message?id_pelatihan='+data.id+'&pesan='+data.pesan,{
                    headers: {'Authorization':'Bearer '+token}
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