<template>
    <div class="profile-dialog">
        <md-dialog :md-active.sync="showDialog">
            <md-dialog-title>Detail Pelatihan</md-dialog-title>

            <md-dialog-content md-dynamic-height>
                <template v-if="pelatihan.hasOwnProperty('nm_pelatihan')">
                    <table class="table table-bordered table-striped" align="center" cellpadding="10">
                        <tr>
                            <th>Nama Pelatihan</th>
                            <td>{{pelatihan.nm_pelatihan}}</td>
                        </tr>
                        <tr>
                            <th>Penyelenggara</th>
                            <td>{{pelatihan.nm_lembaga}}</td>
                        </tr>
                        <tr>
                            <th>Jadwal</th>
                            <td>{{pelatihan.tanggal}}</td>
                        </tr>
                        <tr>
                            <th>Narasumber</th>
                            <td>
                                <ul>
                                    <li v-for="narasumber in pelatihan.narasumbers" :key="narasumber.id_narasumber" v-html="narasumber.narasumber.nm_narasumber"></li>
                                </ul>
                            </td>
                        </tr>
                        <tr>
                            <th>Jumlah Peserta</th>
                            <td>{{pelatihan.jumlah_peserta}}</td>
                        </tr>
                    </table>
                </template>
                <template v-else><i>Memuat...</i></template>
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
            dialogStatus: 'dialog/getDetailDialogStatus',
            pelatihan: 'kelas/getSingleKelas',
        }),
        showDialog: {
            get(){
                return this.dialogStatus
            },
            set(val){
                this.$store.dispatch('dialog/setDetailDialogStatus',val)
            }
        }
    }
}
</script>