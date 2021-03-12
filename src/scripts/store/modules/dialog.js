export default {
    namespaced: true,
    state: {
        dialogStatus:false,
    },

    mutations: {
        SET_DIALOG_STATUS(state, value) {
            state.dialogStatus = value
        }
    },

    getters: {
        getDialogStatus: (state) => state.dialogStatus
    },

    actions: {
        setDialogStatus({commit}, value){
            commit('SET_DIALOG_STATUS',value)
        }
    },
};