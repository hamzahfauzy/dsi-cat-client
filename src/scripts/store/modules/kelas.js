export default {
    namespaced: true,
    state: {
        all_kelas:{},
        materi:{},
        single_kelas:{},
        session:{},
        all_session:[],
        pre_exam:{},
        post_exam:{},
        histories:[],
        exam_content:[]
    },

    mutations: {
        SET_HISTORIES(state, value) {
            state.histories = value
        },
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
        },
        SET_SESSION(state,value){
            state.session = value
        },
        SET_ALL_SESSION(state,value){
            state.all_session = value
        },
        SET_PRE_EXAM(state,value){
            state.pre_exam = value
        },
        SET_POST_EXAM(state,value){
            state.post_exam = value
        }
    },

    getters: {
        getAllKelas: (state) => state.all_kelas,
        getHistories: (state) => state.histories,
        getSingleKelas: (state) => state.single_kelas,
        getMateri: (state) => state.materi,
        getExamContent: (state) => state.exam_content,
        getSession: (state) => state.session,
        getAllSession: (state) => state.all_session,
        getPreExam: (state) => state.pre_exam,
        getPostExam: (state) => state.post_exam
    },

    actions: {
        fetchHistories({commit}, param){
            var token = this.state.global.token
            return new Promise(function(resolve, reject) {
                axios.get(env.base_url+'pelatihan/history?id_pelatihan='+param.id+'&jenis_exam='+param.jenis_exam,{
                    headers: {'Authorization':'Bearer '+token}
                }).then(response => {
                    commit('SET_HISTORIES',response.data)
                    resolve(response)
                }).catch(error => {
                    resolve(error.response)
                    // console.log(error)
                })
            })
        },
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
                axios.get(env.base_url+'pelatihan/single-kelas?id_pelatihan='+id,{
                    headers: {
                        'Authorization':'Bearer '+token
                    }
                }).then(response => {
                    commit('SET_SINGLE_KELAS',response.data.kelas)
                    var all_session = response.data.all_session
                    for(var i=0;i<all_session.length;i++)
                    {
                        all_session[i]['completed'] = false
                        if(all_session[i].finished_at)
                            all_session[i]['completed'] = true
                    }

                    commit('SET_ALL_SESSION',all_session)
                    commit('SET_PRE_EXAM',response.data.pre_exam)
                    commit('SET_POST_EXAM',response.data.post_exam)
                    resolve(response)
                }).catch(error => {
                    resolve(error.response)
                    // console.log(error)
                })
            })
        },
        setSingleKelas({commit},data){
            commit('SET_SINGLE_KELAS',data)
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
        fetchSession({commit},params){
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
                    commit('SET_SESSION',response.data)
                    resolve(response)
                }).catch(error => {
                    resolve(error.response)
                    // console.log(error)
                })
            })
        },
        fetchTryExam({commit},params){
            var token = this.state.global.token
            return new Promise(function(resolve, reject) {
                axios.get(env.base_url+'pelatihan/try-exam?id_pelatihan='+params.id_pelatihan+'&jenis_exam='+params.jenis_exam,{
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
        finishExam({commit},params){
            var token = this.state.global.token
            return new Promise(function(resolve, reject) {
                axios.get(env.base_url+'pelatihan/finish-exam?id_pelatihan='+params.id_pelatihan+'&jenis_exam='+params.jenis_exam,{
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
        fetchSession({commit},params){
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
                    commit('SET_SESSION',response.data)
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
        },
        setSessionNull({commit}){
            commit('SET_SESSION',{})
        },
        setAllSession({commit}){
            commit('SET_ALL_SESSION',[])
        },
        fetchAllSession({commit},id_pelatihan){
            var token = this.state.global.token
            return new Promise(function(resolve, reject) {
                axios.get(env.base_url+'pelatihan/get-all-session?id_pelatihan='+id_pelatihan,{
                    headers: {
                        'Authorization':'Bearer '+token
                    }
                }).then(response => {
                    var all_session = response.data
                    for(var i=0;i<all_session.length;i++)
                    {
                        all_session[i]['completed'] = false
                        if(all_session[i].finished_at)
                            all_session[i]['completed'] = true
                    }
                    commit('SET_ALL_SESSION',all_session)
                    resolve(response)
                }).catch(error => {
                    resolve(error.response)
                    // console.log(error)
                })
            })
        }
    },
};