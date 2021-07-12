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
                    <h3 align="center">Fitur ini sedang dalam pengembangan</h3>
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
            forumDiskusi:[]
        }
    },
    async created(){
        this.isLoading = true
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
            kelas: 'kelas/getSingleKelas'
            // forumDiskusi: 'forum/getForumKonten',
        })
    }
}
</script>