<template>
    <div class="profile-dialog">
        <md-dialog :md-active.sync="showDialog">
            <md-dialog-title>Masukkan Token Pelatihan</md-dialog-title>

            <md-dialog-content md-dynamic-height>
                <input type="text" class="form-control" v-model="pin">
                
                <center>
                    <button class="btn btn-primary btn-block" @click="ikuti()" v-html="btnLabel"></button>
                    <span v-if="message" v-html="message" class="text-danger"></span>
                </center>
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
import Swal from 'sweetalert2'
export default {
    components:{
        Loading
    },
    data(){
        return {
            pin:'',
            message:'',
            btnLabel:'Ikuti Pelatihan',
            isLoading:true,
            fullPage:true
        }
    },
    methods:{
        ikuti: async function(){
            var id_pelatihan = this.id_pelatihan
            this.message = ''
            this.btnLabel = 'Menunggu...'
            var request = await this.$store.dispatch('kelas/postIkuti',{id_pelatihan:id_pelatihan,pin:this.pin})
            if(request.status == 401)
                Swal.fire('Oops...', 'Authorized Content!', 'error')
            else
            {
                var response = request.data
                this.btnLabel = 'Ikuti Pelatihan'
                if(response.length  == 0)
                {
                    this.message = 'Token tidak Valid'
                    return
                }
                this.$router.push('/details/'+id_pelatihan)
                this.showDialog = false
            }
        }
    },
    computed: {
        ...mapGetters({
            dialogStatus: 'dialog/getPinDialogStatus',
            id_pelatihan: 'dialog/getIdPelatihan'
        }),
        showDialog: {
            get(){
                return this.dialogStatus
            },
            set(val){
                this.$store.dispatch('dialog/setPinDialogStatus',val)
            }
        }
    }
}
</script>