<template>
    <div id="homepage" class="forum-diskusi">
        <cat-header></cat-header>
        <div class="container nav-progress-container">
            <div class="nav-progress">
                <div>
                    <h2 style="font-size:22px;margin:0;" v-html="kelas.hasOwnProperty('nm_pelatihan')?kelas.nm_pelatihan:'Loading...'"></h2>
                    <div class="progress-section">
                        <b>Kelas Virtual - <router-link :to="'/details/'+$route.params.id">Kembali Ke Pelatihan</router-link></b>
                    </div>
                </div>
            </div>
        </div>

        <div class="cat-section" style="padding-top:20px;">
            <loading :active.sync="isLoading" :is-full-page="fullPage" class="loader"></loading>
            <div class="row" v-if="!isLoading">
                <div class="col-12 col-md-8 mx-auto main-content forum-konten">
                    <template v-if="kelas.kelas_virtual.length == 0">
                    <h3 align="center" >Tidak ada jadwal kelas virtual</h3>
                    </template>
                    <template v-else>
                    <div class="bg-light" style="padding:30px">

                        <h3 align="center">Jadwal Kelas Virtual</h3>

                        <table class="table table-bordered">
                            <tr>
                                <th>No</th>
                                <th>Tanggal</th>
                                <th>Aksi</th>
                            </tr>
                            <tr v-for="(v,i) in kelas.kelas_virtual" :key="i">
                                <td>{{++i}}</td>
                                <td>{{v.tanggal}}</td>
                                <td v-if="v.is_today">
                                    <a :href="'/meeting.html?apiKey='+kelas.zoom_auth.apikey+'&mn='+v.response_data.pmi+'&name='+nama+'&pwd='+v.response_data.password+'&email=lmspemdes@kemendagri.go.id&role=0&signature='+v.signature" style="color:#FFF;" target="_blank" class="btn btn-success">Ikuti</a>
                                    <a :href="v.response_data.join_url" class="btn btn-success" style="color:#FFF;" target="_blank">Ikuti Via Zoom</a>
                                </td>
                                <td v-else>-</td>
                            </tr>
                        </table>
                    </div>
                    </template>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
import Swal from 'sweetalert2';
import Loading from 'vue-loading-overlay';
export default {
    components:{
        Loading 
    },
    data(){
        return {
            isLoading:false,
            // isContentLoading:false,
            fullPage:true,
            pesan:'',
            nama:'',
            forumDiskusi:[]
        }
    },
    async created(){
        this.isLoading = true
        if(this.authData.hasOwnProperty('additional_data'))
        {
            if(this.authData.additional_data.hasOwnProperty('id_lembaga'))
                this.nama = this.authData.additional_data.nm_lembaga
            if(this.authData.additional_data.hasOwnProperty('id_ap_desa'))
                this.nama = this.authData.additional_data.nm_ap_desa
            if(this.authData.additional_data.hasOwnProperty('id_narasumber'))
                this.nama = this.authData.additional_data.nm_narasumber
        }
        this.$store.dispatch('global/setHeader','kelas-virtual')
        var id = this.$route.params.id
        var request = await this.$store.dispatch('kelas/fetchSingleKelas',id)
        if(request.status == 401)
            Swal.fire('Oops...', 'Authorized Content!', 'error')

        this.loadForumDiskusi()
        // var vm = this

        // setInterval(function(){
        //     vm.loadForumDiskusi()
        // },1500)
        
        this.isLoading = false
        // var id = this.$route.params.id
        // await this.$store.dispatch('kelas/fetchAllSession',id)
    },
    methods: {
        scrollToBottom() {
            const container = this.$el.querySelector(".diskusi-konten");
            container.scrollTop = container.scrollHeight;
        },
        async sendMessage(){
            var id = this.$route.params.id
            var pesan = this.pesan
            if(pesan == "")
            {
                alert('Pesan tidak boleh kosong')
                return
            } 
            await this.$store.dispatch('forum/postForumKonten',{
                id:id,
                pesan:pesan
            })

            this.pesan = ''

        },
        async loadForumDiskusi(){
            var id = this.$route.params.id
            var request = await this.$store.dispatch('forum/fetchForumKonten',id)
            if(JSON.stringify(this.forumDiskusi) != JSON.stringify(request.data))
            {
                this.forumDiskusi = request.data
                this.scrollToBottom()
            }
            await this.loadForumDiskusi()
        }
    },
    computed: {
        ...mapGetters({
            kelas: 'kelas/getSingleKelas',
            authData: 'global/getAuthData',
            // forumDiskusi: 'forum/getForumKonten',
        })
    }
}
</script>