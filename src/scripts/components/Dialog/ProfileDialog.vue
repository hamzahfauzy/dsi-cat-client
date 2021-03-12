<template>
    <div class="profile-dialog">
        <md-dialog :md-active.sync="showDialog">
            <md-dialog-title>My Profile</md-dialog-title>

            <md-dialog-content md-dynamic-height>
                <div class="profile-dialog">
                    <div class="row">
                        <div class="col-12 col-md-4">
                            <img src="dist/images/logo_app_small.png" alt="" width="100%">
                        </div>
                        <div class="col-12 col-md-8">
                            <div class="form-group">
                                <label for="">Nama Lengkap</label>
                                <span>Hamzah Fauzy</span>
                            </div>
                            <div class="form-group">
                                <label for="">Email</label>
                                <span>hamzahfauzy97@gmail.com</span>
                            </div>
                            <div class="form-group">
                                <label for="">No. Handphone</label>
                                <span>+62 082369378823</span>
                            </div>
                            <div class="form-group">
                                <label for="">Jenis Kelamin</label>
                                <span>Laki-laki</span>
                            </div>
                            <div class="form-group">
                                <label for="">Tanggal Lahir</label>
                                <span>27 Agustus 1997</span>
                            </div>
                        </div>
                    </div>
                </div>
            </md-dialog-content>

            <md-dialog-actions>
                <md-button class="md-primary" @click="showDialog = false">Close</md-button>
            </md-dialog-actions>
        </md-dialog>
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
    computed: {
        ...mapGetters({
            dialogStatus: 'dialog/getDialogStatus',
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