<template>
    <div id="homepage" class="forum-diskusi">
        <cat-header></cat-header>
        <div class="container nav-progress-container">
            <div class="nav-progress">
                <div>
                    <h2 style="font-size:22px;margin:0;" v-html="kelas.hasOwnProperty('nm_pelatihan')?kelas.nm_pelatihan:'Loading...'"></h2>
                    <div class="progress-section">
                        <b>Konten Saya - <router-link :to="'/details/'+$route.params.id">Kembali Ke Pelatihan</router-link></b>
                    </div>
                </div>
            </div>
        </div>

        <div class="cat-section" style="padding-top:13px;">
            <loading :active.sync="isLoading" :is-full-page="fullPage" class="loader"></loading>
            <div class="row" v-if="!isLoading">
                <div class="col-12 col-xs-6 col-sm-4 col-md-3 col collapsed-sidebar" :class="{'show':nav_sidebar}">
                    <konten-sidebar></konten-sidebar>
                </div>
                <div class="col-12 col-xs-6 col-sm-8 col-md-9 col main-content" @click="$store.dispatch('global/closeNavSidebar')">
                    <div class="kelas-konten" style="height:calc(100vh - 80px) !important;">
                        <loading :active.sync="isContentLoading" :is-full-page="fullPage" class="loader"></loading>
                        <div v-if="!isContentLoading">
                            <konten-materi></konten-materi>
                        </div>
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
            id_pelatihan:0
        }
    },
    async created(){
        this.isLoading = true
        var id = this.$route.params.id
        this.$store.dispatch('global/setHeader','konten-saya')
        this.$store.dispatch('konten/get',id)
        this.id_pelatihan = id
        var request = await this.$store.dispatch('kelas/fetchSingleKelas',id)
        if(request.status == 401)
            Swal.fire('Oops...', 'Authorized Content!', 'error')
        this.isLoading = false
    },
    methods: {
        
    },
    computed: {
        ...mapGetters({
            nav_sidebar: 'global/getNavSidebar',
            kelas: 'kelas/getSingleKelas',
            loading: 'cat/getLoading',
            kontens: 'konten/get',
        }),
        isContentLoading:{
            get(){
                return this.loading
            },
            set(val){
                this.$store.dispatch('cat/setLoading',val)
            }
        }
    }
}
</script>