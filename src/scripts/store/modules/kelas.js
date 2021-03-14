export default {
    namespaced: true,
    state: {
        all_kelas:{},
        materi:{},
        single_kelas:{},
        exam_content:[]
    },

    mutations: {
        SET_ALL_KELAS(state, value) {
            state.all_kelas = value
        },
        SET_SINGLE_KELAS(state,value){
            state.single_kelas = value
        },
        SET_MATERI(state,value){
            state.materi = value
        },
        SET_EXAM_CONTENT(state,value){
            state.exam_content = value
        }
    },

    getters: {
        getAllKelas: (state) => state.all_kelas,
        getSingleKelas: (state) => state.single_kelas,
        getMateri: (state) => state.materi,
        getExamContent: (state) => state.exam_content
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
                    commit('SET_MATERI',response.data)
                    resolve(response)
                }).catch(error => {
                    resolve(error.response)
                    // console.log(error)
                })
            })
        },
        setMateri({commit}, value){
            commit('SET_MATERI',value)
        },
        setExamContent({commit}, value){
            commit('SET_EXAM_CONTENT',value)
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
        },
        fetchExam({commit},params){
            var token = this.state.global.token
            return new Promise(function(resolve, reject) {
                axios.get(env.base_url+'pelatihan/exam?id_pelatihan='+params.id_pelatihan+'&jenis_exam='+params.jenis_exam,{
                    headers: {
                        'Authorization':'Bearer '+token
                    }
                }).then(response => {
                    commit('SET_EXAM_CONTENT',response.data)
                    resolve(response)
                }).catch(error => {
                    resolve(error.response)
                    // console.log(error)
                })
            })
        },
        fetchSession(state,params){
            var token = this.state.global.token
            return new Promise(function(resolve, reject) {
                var formData = new FormData;
                formData.append('id_pelatihan',params.id_pelatihan)
                formData.append('jenis_exam',params.jenis_exam)
                axios.post(env.base_url+'pelatihan/get-session',formData,{
                    headers: {
                        'Content-type':'multipart/form-data',
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
        setSession(state,params){
            var token = this.state.global.token
            return new Promise(function(resolve, reject) {
                axios.post(env.base_url+'pelatihan/set-session',params,{
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
        setSessionFinish(state,params){
            var token = this.state.global.token
            return new Promise(function(resolve, reject) {
                axios.post(env.base_url+'pelatihan/set-session',params,{
                    headers: {
                        'Content-type':'multipart/form-data',
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