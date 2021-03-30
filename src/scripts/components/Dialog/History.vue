<template>
    <div class="profile-dialog">
        <md-dialog :md-active.sync="showDialog">
            <md-dialog-title>Riwayat Test</md-dialog-title>

            <md-dialog-content md-dynamic-height>
                <div v-if="histories.length">
                <table class="table table-bordered table-striped" align="center" cellpadding="10">
                    <tr>
                        <th>#</th>
                        <th>Benar</th>
                        <th>Salah</th>
                        <th>Skor</th>
                        <th>Mulai - Selesai</th>
                    </tr>
                    <tr v-for="(history,index) in histories" :key="index">
                        <td>{{index+1}}</td>
                        <td>{{history.benar}}</td>
                        <td>{{history.salah}}</td>
                        <td>{{history.skor}}</td>
                        <td>{{history.started_at}} - {{history.finished_at}}</td>
                    </tr>
                </table>
                <center>
                    <button class="btn btn-primary" v-if="session.status_selesai == 0" @click="finishExam(session.jenis_exam)">Simpan Nilai Tertinggi</button>
                </center>
                </div>
                <div v-else>
                    <center><i>Tidak ada data</i></center>
                </div>
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
            isLoading:true,
            fullPage:true
        }
    },
    methods:{
        async finishExam(jenis_exam){
            var vm = this
            var id = this.$route.params.id

            Swal.fire({
                title: 'Simpan Nilai Tertinggi',
                text: 'Klik Ya untuk menyimpan nilai tertinggi',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: `Ya`,
                denyButtonText: `Batal`,
            }).then(async (result) => {
                if (result.isConfirmed)
                {
                    vm.showDialog = false
                    vm.$store.dispatch('cat/setLoading',true)
                    vm.$store.dispatch('kelas/setSessionNull',true)
                    await vm.$store.dispatch('kelas/finishExam',{id_pelatihan:id,jenis_exam:jenis_exam})
                    await vm.$store.dispatch('kelas/fetchSession',{id_pelatihan:id,jenis_exam:jenis_exam})
                    vm.$store.dispatch('cat/setLoading',false)
                }
            })
        },
    },
    computed: {
        ...mapGetters({
            dialogStatus: 'dialog/getHistoryDialogStatus',
            histories: 'kelas/getHistories',
            session: 'kelas/getSession'
        }),
        showDialog: {
            get(){
                return this.dialogStatus
            },
            set(val){
                this.$store.dispatch('dialog/setHistoryDialogStatus',val)
            }
        }
    }
}
</script>