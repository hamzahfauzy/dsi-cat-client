<template>
    <div class="profile-dialog">
        <md-dialog :md-active.sync="showDialog">
            <md-dialog-title>Buat Konten</md-dialog-title>

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
        id_pelatihan:''
    },
    components:{
        Loading
    },
    data(){
        return {
            button : {
                label:'Simpan',
                enable:true,
            },
            nm_konten:'',
            isLoading:true,
            isLoading:true,
            fullPage:true
        }
    },
    methods:{
        async simpan(){
            this.button.label = 'Menyimpan...'
            this.button.enable = false
            await this.$store.dispatch('konten/create',{
                id:this.id_pelatihan,
                nm_konten:this.nm_konten
            })

            await this.$store.dispatch('konten/get',this.id_pelatihan)
            this.nm_konten = ''
            this.button.label = 'Simpan'
            this.button.enable = true
            this.showDialog = false
        }
    },
    computed: {
        ...mapGetters({
            dialogStatus: 'dialog/getKontenDialogStatus'
        }),
        showDialog: {
            get(){
                return this.dialogStatus
            },
            set(val){
                this.$store.dispatch('dialog/setKontenDialogStatus',val)
            }
        }
    }
}
</script>