export default {
    namespaced: true,
    state: {
        dialogStatus:false,
        historyDialogStatus:false,
        kontenDialogStatus:false,
        materiDialogStatus:false,
        fullLoading:false
    },

    mutations: {
        SET_DIALOG_STATUS(state, value) {
            state.dialogStatus = value
        },
        SET_HISTORY_DIALOG_STATUS(state, value) {
            state.historyDialogStatus = value
        },
        SET_KONTEN_DIALOG_STATUS(state, value) {
            state.kontenDialogStatus = value
        },
        SET_MATERI_DIALOG_STATUS(state, value) {
            state.materiDialogStatus = value
        },
        SET_FULL_LOADING(state, value) {
            state.fullLoading = value
        }
    },

    getters: {
        getDialogStatus: (state) => state.dialogStatus,
        getHistoryDialogStatus: (state) => state.historyDialogStatus,
        getKontenDialogStatus: (state) => state.kontenDialogStatus,
        getMateriDialogStatus: (state) => state.materiDialogStatus,
        isFullLoading: (state) => state.fullLoading
    },

    actions: {
        setDialogStatus({commit}, value){
            commit('SET_DIALOG_STATUS',value)
        },
        setHistoryDialogStatus({commit}, value){
            commit('SET_HISTORY_DIALOG_STATUS',value)
        },
        setKontenDialogStatus({commit}, value){
            commit('SET_KONTEN_DIALOG_STATUS',value)
        },
        setMateriDialogStatus({commit}, value){
            commit('SET_MATERI_DIALOG_STATUS',value)
        },
        setFullLoading({commit}, value){
            commit('SET_FULL_LOADING',value)
        }
    },
};