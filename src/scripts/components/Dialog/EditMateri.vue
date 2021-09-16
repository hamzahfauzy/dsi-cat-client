<template>
    <div class="profile-dialog">
        <md-dialog :md-active.sync="showDialog">
            <md-dialog-title>Edit Materi</md-dialog-title>

            <md-dialog-content md-dynamic-height>
                <div style="width:450px;">
                    <md-field>
                        <label for="first-name">Nama Materi</label>
                        <md-input v-model="nm_materi"/>
                    </md-field>

                    <md-field>
                        <label for="movie">Jenis Materi</label>
                        <md-select v-model="jenis_materi">
                            <md-option value="1">Video</md-option>
                            <md-option value="2">File</md-option>
                        </md-select>
                    </md-field>

                    <md-field>
                        <label for="first-name">Keterangan</label>
                        <md-textarea v-model="ket_materi"></md-textarea>
                    </md-field>

                    <md-field>
                        <label for="first-name">File URL</label>
                        <md-input v-model="file_url"/>
                    </md-field>
                    <a :href="lms_drive_url+'index.php?action=auth/login-via-token&token='+token" target="_blank" class="btn btn-primary" style="color:#FFF">Buka LMS Drive</a>
                </div>
            </md-dialog-content>

            <md-dialog-actions>
                <md-button class="md-raised md-primary" @click="simpan()" :disabled="!button.enable">{{button.label}}</md-button>
                <md-button class="md-accent" @click="showDialog = false">Close</md-button>
            </md-dialog-actions>
        </md-dialog>
    </div>
</template>
<script>
import Loading from 'vue-loading-overlay'
import { mapGetters } from 'vuex'
export default {
    props:{
        id_pelatihan:String,
        id_materi:Number,
        id_konten:Number,
        nm_materi:String,
        ket_materi:String,
        jenis_materi:Number,
        file_url:String,
    },
    components:{
        Loading
    },
    data(){
        return {
            button : {
                label:'Update',
                enable:true,
            },
            isLoading:true,
            isLoading:true,
            fullPage:true
        }
    },
    methods:{
        async simpan(){
            this.button.label = 'Mengupdate...'
            this.button.enable = false
            await this.$store.dispatch('konten/updateMateri',{
                id:this.id_pelatihan,
                id_materi:this.id_materi,
                id_konten:this.id_konten,
                nm_materi:this.nm_materi,
                ket_materi:this.ket_materi,
                jenis_materi:this.jenis_materi,
                file_url:this.file_url
            })

            await this.$store.dispatch('konten/get',this.id_pelatihan)
            this.nm_materi = ''
            this.ket_materi = ''
            this.jenis_materi = ''
            this.file_url = ''
            this.button.label = 'Update'
            this.button.enable = true
            this.showDialog = false
        }
    },
    computed: {
        ...mapGetters({
            dialogStatus: 'dialog/getEditMateriDialogStatus',
            // id_konten: 'konten/getActiveKontenId'
        }),
        showDialog: {
            get(){
                return this.dialogStatus
            },
            set(val){
                this.$store.dispatch('dialog/setEditMateriDialogStatus',val)
            }
        }
    }
}
</script>