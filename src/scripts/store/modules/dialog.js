export default {
    namespaced: true,
    state: {
        dialogStatus:false,
        detailDialogStatus:false,
        historyDialogStatus:false,
        pinDialogStatus:false,
        id_pelatihan:0,
        kontenDialogStatus:false,
        editKontenDialogStatus:false,
        materiDialogStatus:false,
        editMateriDialogStatus:false,
        fullLoading:false
    },

    mutations: {
        SET_DIALOG_STATUS(state, value) {
            state.dialogStatus = value
        },
        SET_DETAIL_DIALOG_STATUS(state, value) {
            state.detailDialogStatus = value
        },
        SET_HISTORY_DIALOG_STATUS(state, value) {
            state.historyDialogStatus = value
        },
        SET_PIN_DIALOG_STATUS(state, value) {
            state.pinDialogStatus = value
        },
        SET_ID_PELATIHAN(state, value) {
            state.id_pelatihan = value
        },
        SET_KONTEN_DIALOG_STATUS(state, value) {
            state.kontenDialogStatus = value
        },
        SET_EDIT_KONTEN_DIALOG_STATUS(state, value) {
            state.editKontenDialogStatus = value
        },
        SET_MATERI_DIALOG_STATUS(state, value) {
            state.materiDialogStatus = value
        },
        SET_EDIT_MATERI_DIALOG_STATUS(state, value) {
            state.editMateriDialogStatus = value
        },
        SET_FULL_LOADING(state, value) {
            state.fullLoading = value
        }
    },

    getters: {
        getDialogStatus: (state) => state.dialogStatus,
        getDetailDialogStatus: (state) => state.detailDialogStatus,
        getHistoryDialogStatus: (state) => state.historyDialogStatus,
        getPinDialogStatus: (state) => state.pinDialogStatus,
        getIdPelatihan: (state) => state.id_pelatihan,
        getKontenDialogStatus: (state) => state.kontenDialogStatus,
        getEditKontenDialogStatus: (state) => state.editKontenDialogStatus,
        getMateriDialogStatus: (state) => state.materiDialogStatus,
        getEditMateriDialogStatus: (state) => state.editMateriDialogStatus,
        isFullLoading: (state) => state.fullLoading
    },

    actions: {
        setDialogStatus({commit}, value){
            commit('SET_DIALOG_STATUS',value)
        },
        setDetailDialogStatus({commit}, value){
            commit('SET_DETAIL_DIALOG_STATUS',value)
        },
        setHistoryDialogStatus({commit}, value){
            commit('SET_HISTORY_DIALOG_STATUS',value)
        },
        setPinDialogStatus({commit}, value){
            commit('SET_PIN_DIALOG_STATUS',value.status)
            commit('SET_ID_PELATIHAN',value.id_pelatihan)
        },
        setKontenDialogStatus({commit}, value){
            commit('SET_KONTEN_DIALOG_STATUS',value)
        },
        setEditKontenDialogStatus({commit}, value){
            commit('SET_EDIT_KONTEN_DIALOG_STATUS',value)
        },
        setMateriDialogStatus({commit}, value){
            commit('SET_MATERI_DIALOG_STATUS',value)
        },
        setEditMateriDialogStatus({commit}, value){
            commit('SET_EDIT_MATERI_DIALOG_STATUS',value)
        },
        setFullLoading({commit}, value){
            commit('SET_FULL_LOADING',value)
        }
    },
};