<template>
    <div class="profile-dialog">
        <md-dialog :md-active.sync="showDialog">
            <md-dialog-title>Edit Konten</md-dialog-title>

            <md-dialog-content md-dynamic-height>
                <div style="width:450px;">
                    <md-field>
                        <label for="first-name">Nama Konten</label>
                        <md-input v-model="nm_konten"/>
                    </md-field>
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
        id_pelatihan:'',
        id_konten:'',
        nm_konten:'',
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
            await this.$store.dispatch('konten/update',{
                id:this.id_pelatihan,
                id_konten:this.id_konten,
                nm_konten:this.nm_konten
            })

            await this.$store.dispatch('konten/get',this.id_pelatihan)
            this.nm_konten = ''
            this.button.label = 'Update'
            this.button.enable = true
            this.showDialog = false
        }
    },
    computed: {
        ...mapGetters({
            dialogStatus: 'dialog/getEditKontenDialogStatus'
        }),
        showDialog: {
            get(){
                return this.dialogStatus
            },
            set(val){
                this.$store.dispatch('dialog/setEditKontenDialogStatus',val)
            }
        }
    }
}
</script>