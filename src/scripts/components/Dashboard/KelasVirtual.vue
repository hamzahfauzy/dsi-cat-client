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

        <div class="cat-section" style="padding-top:20px;padding-bottom:100px;">
            <loading :active.sync="isLoading" :is-full-page="fullPage" class="loader"></loading>
            <div class="row" v-if="!isLoading">
                <div class="col-12 col-md-8 mx-auto main-content forum-konten">
                    <template v-if="kelas.kelas_virtual.length == 0">
                    <h3 align="center" >Tidak ada jadwal kelas virtual</h3>
                    </template>
                    <template v-else>
                        <h3 align="center">Jadwal Kelas Virtual</h3>
                        <div class="row">
                            <div class="col-sm-12 col-md-6 mb-3" v-for="(v,i) in kelas.kelas_virtual" :key="i">
                                <div class="bg-light" style="padding:30px;border-radius:10px;">
                                    Tanggal : <b>{{v.tanggal_indo}}</b>
                                    <div v-if="v.is_today">
                                        <a :href="ecat_link+'/meeting.html?apiKey='+kelas.zoom_auth.apikey+'&mn='+v.pmi+'&name='+nama+'&pwd='+v.response_data.password+'&email=lmspemdes@kemendagri.go.id&role='+role+'&signature='+v.signature" style="color:#FFF;" target="_blank" class="btn btn-success">Ikuti</a>
                                        <a :href="role==1?v.response_data.start_url:v.response_data.join_url" class="btn btn-success" style="color:#FFF;" target="_blank">Ikuti Via Zoom</a>
                                    </div>
                                    <div v-else-if="v.is_yesterday">
                                        <i>Jadwal Telah Berlalu</i>
                                    </div>
                                    <div v-else>
                                        <i>Belum memasuki jadwal</i>
                                    </div>
                                </div>

                            </div>
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
            ecat_link:'/e-cat',
            role:0,
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
            {
                this.nama = this.authData.additional_data.nm_narasumber
                this.role = 1
            }
        }
        if(env.app_link == 'http://lmskemendagri.test/')
            this.ecat_link = ''
        this.$store.dispatch('global/setHeader','kelas-virtual')
        var id = this.$route.params.id
        var request = await this.$store.dispatch('kelas/fetchSingleKelas',id)
        if(request.status == 401)
            Swal.fire('Oops...', 'Authorized Content!', 'error')

        // this.loadForumDiskusi()
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