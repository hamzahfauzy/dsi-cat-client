<template>
    <div id="homepage" class="forum-diskusi">
        <cat-header></cat-header>
        <div class="container nav-progress-container">
            <div class="nav-progress">
                <div>
                    <h2 style="font-size:22px;margin:0;" v-html="kelas.hasOwnProperty('nm_pelatihan')?kelas.nm_pelatihan:'Loading...'"></h2>
                    <div class="progress-section">
                        <b>Forum Diskusi - <router-link :to="'/details/'+$route.params.id">Kembali Ke Pelatihan</router-link></b>
                    </div>
                </div>
            </div>
        </div>

        <div class="cat-section" style="padding-top:20px;">
            <loading :active.sync="isLoading" :is-full-page="fullPage" class="loader"></loading>
            <div class="row" v-if="!isLoading">
                <div class="col-12 col-md-8 mx-auto main-content forum-konten" v-if="forumDiskusi">
                    <div class="diskusi-konten">
                        <div v-for="forum in forumDiskusi" :key="forum.id" class="talk-bubble" :class="{'left-top':!forum.is_me,'right-top':forum.is_me}">
                            <div class="talktext">
                                <div class="tt-content">
                                    <div class="img">
                                        <img :src="app_link+forum.picture" alt="" class="mr-3 rounded-circle" width="100px" height="100px" style="object-fit:cover;">
                                    </div>
                                    <div class="content">
                                        <small>{{forum.tanggal}}</small><br>
                                        <b>{{forum.is_me?'Anda':forum.from.nama_lengkap}}</b>
                                        <p v-html="forum.msg"></p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="form-group message-group" style="position:absolut;bottom:0;">
                        <textarea class="form-control message-form" v-model="pesan" placeholder="Pesan disini..."></textarea>
                        <button class="btn btn-primary" @click="sendMessage()">
                            <md-icon>send</md-icon>
                        </button>
                    </div>
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
            app_link:'',
            forumDiskusi:[]
        }
    },
    async created(){
        this.app_link = env.image_link
        this.isLoading = true
        this.$store.dispatch('global/setHeader','forum-diskusi')
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
                pesan:encodeURIComponent(pesan)
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