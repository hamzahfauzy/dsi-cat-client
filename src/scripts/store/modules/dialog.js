export default {
    namespaced: true,
    state: {
        dialogStatus:false,
        historyDialogStatus:false,
        fullLoading:false
    },

    mutations: {
        SET_DIALOG_STATUS(state, value) {
            state.dialogStatus = value
        },
        SET_HISTORY_DIALOG_STATUS(state, value) {
            state.historyDialogStatus = value
        },
        SET_FULL_LOADING(state, value) {
            state.fullLoading = value
        }
    },

    getters: {
        getDialogStatus: (state) => state.dialogStatus,
        getHistoryDialogStatus: (state) => state.historyDialogStatus,
        isFullLoading: (state) => state.fullLoading
    },

    actions: {
        setDialogStatus({commit}, value){
            commit('SET_DIALOG_STATUS',value)
        },
        setHistoryDialogStatus({commit}, value){
            commit('SET_HISTORY_DIALOG_STATUS',value)
        },
        setFullLoading({commit}, value){
            commit('SET_FULL_LOADING',value)
        }
    },
};