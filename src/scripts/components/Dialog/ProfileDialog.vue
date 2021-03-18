<template>
    <div class="profile-dialog">
        <md-dialog :md-active.sync="showDialog">
            <md-dialog-title>Profil</md-dialog-title>

            <md-dialog-content md-dynamic-height>
                <lembaga v-if="profile.hasOwnProperty('id_lembaga')"></lembaga>
                <ap-desa v-if="profile.hasOwnProperty('id_ap_desa')"></ap-desa>
                <narasumber v-if="profile.hasOwnProperty('id_narasumber')"></narasumber>
            </md-dialog-content>

            <md-dialog-actions>
                <md-button class="md-primary" @click="showDialog = false">Close</md-button>
            </md-dialog-actions>
        </md-dialog>
    </div>
</template>
<script>
import Loading from 'vue-loading-overlay'
import { mapGetters } from 'vuex'
export default {
    components:{
        Loading
    },
    data(){
        return {
            isLoading:true,
            fullPage:true
        }
    },
    computed: {
        ...mapGetters({
            dialogStatus: 'dialog/getDialogStatus',
            profile: 'global/getProfile',
        }),
        showDialog: {
            get(){
                return this.dialogStatus
            },
            set(val){
                this.$store.dispatch('dialog/setDialogStatus',val)
            }
        }
    }
}
</script>