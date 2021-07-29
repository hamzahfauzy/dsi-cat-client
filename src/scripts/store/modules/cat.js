export default {
    namespaced: true,
    state: {
        exam_content:{},
        materi:{},
        loading:false,
        navigation:{
            next:false,
            prev:false
        },
        active_materi:{
            idx_konten:-1,
            idx_materi:-1,
            status_data:null
        }
    },

    mutations: {
        SET_EXAM_CONTENT(state, value) {
            state.exam_content = value
        },
        SET_MATERI(state,value){
            state.materi = value
        },
        SET_LOADING(state,value){
            state.loading = value
        },
        SET_NAVIGATION(state,value){
            state.navigation = value
        },
        SET_ACTIVE_MATERI(state,value){
            state.active_materi = value
        }
        
    },

    getters: {
        getExamContent: (state) => state.exam_content,
        getMateri: (state) => state.materi,
        getLoading: (state) => state.loading,
        getNavigation: (state) => state.navigation,
        getActiveMateri: (state) => state.active_materi
    },

    actions: {
        setExamContent({commit},value){
            commit('SET_EXAM_CONTENT',value)
        },
        setMateri({commit},value){
            commit('SET_MATERI',value)
        },
        setLoading({commit},value){
            commit('SET_LOADING',value)
        },
        setNavigation({commit},value){
            commit('SET_NAVIGATION',value)
        },
        setActiveMateri({commit},value){
            commit('SET_ACTIVE_MATERI',value)
        }
    },
};