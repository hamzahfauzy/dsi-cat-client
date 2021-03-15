<template>
    <div id="homepage">
        <cat-header></cat-header>
        <div class="container nav-progress-container">
            <div class="nav-progress">
                <progress-bar-mini :title="kelas.hasOwnProperty('nm_pelatihan')?kelas.nm_pelatihan:'Loading...'" :progress_percent="kelas.hasOwnProperty('progress')?kelas.progress:0"></progress-bar-mini>
            </div>
        </div>

        <div class="cat-section">
            <loading :active.sync="isLoading" :is-full-page="fullPage" class="loader"></loading>
            <div class="row" v-if="!isLoading">
                <div class="col-12 col-xs-6 col-sm-4 col-md-3 col collapsed-sidebar" :class="{'show':nav_sidebar}">
                    <sidebar></sidebar>
                </div>
                <div class="col-12 col-xs-6 col-sm-8 col-md-9 col main-content" @click="$store.dispatch('global/closeNavSidebar')">
                    <div class="kelas-konten">
                        <loading :active.sync="isContentLoading" :is-full-page="fullPage" class="loader"></loading>
                        <div v-if="!isContentLoading">
                            <div v-if="active_materi.idx_konten == -1 && exam_content.length == 0 && Object.keys(session).length == 0" class="intro">
                                <h3 align="center" v-html="kelas.nm_pelatihan"></h3>
                            </div>
                            <exam></exam>
                            <materi></materi>
                        </div>
                        
                    </div>
                    <div class="navigasi-konten">
                        <md-button class="md-raised md-primary" @click="prevMateri()" v-if="navigation_enable.prev">
                            <md-icon>keyboard_arrow_left</md-icon>
                            Sebelumnya
                        </md-button>
                        <md-button class="md-raised md-primary" @click="nextMateri()" v-if="navigation_enable.next">
                            Selanjutnya
                            <md-icon>keyboard_arrow_right</md-icon>
                        </md-button>
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
        }
    },
    async created(){
        this.$store.dispatch('global/setHeader','kelas-saya')
        this.isLoading = true
        await this.loadSidebar()
        this.isLoading = false
    },
    methods:{
        async loadSidebar(){
            var id = this.$route.params.id
            var request = await this.$store.dispatch('kelas/fetchSingleKelas',id)
            if(request.status == 401)
                Swal.fire('Oops...', 'Authorized Content!', 'error')
        },
        blank(){
            // window.alert(val)
        },
        async nextMateri(){
            var idx_konten = this.active_materi.idx_konten
            var idx_materi = this.active_materi.idx_materi
            var kontens = this.kelas.refKontens

            if(idx_konten == kontens[idx_konten].length-1 && idx_materi == kontens[idx_konten].refMateris.length-1)
                return
            
            if(idx_materi == kontens[idx_konten].refMateris.length-1)
            {
                idx_materi = 0
                idx_konten += 1
            }
            else
                idx_materi += 1

            this.$store.dispatch('cat/setActiveMateri',{
                idx_konten:idx_konten,
                idx_materi:idx_materi,
            })
            await this.loadMateri()
        },
        async loadMateri(){
            this.$store.dispatch('cat/setLoading',true)
            var idx_konten = this.active_materi.idx_konten
            var idx_materi = this.active_materi.idx_materi
            var materi = this.kelas.refKontens[idx_konten].refMateris[idx_materi]
            this.loadNavigation()
            await this.$store.dispatch('kelas/fetchMateri',materi.id_materi)
            this.$store.dispatch('cat/setLoading',false)
        },
        async prevMateri(){
            // this.active_materi.idx_materi--
            // await this.loadMateri()
            var idx_konten = this.active_materi.idx_konten
            var idx_materi = this.active_materi.idx_materi
            var kontens = this.kelas.refKontens

            if(idx_konten == 0 && idx_materi == 0)
                return
            
            if(idx_materi == 0 && idx_konten > 0)
            {
                idx_materi = kontens[idx_konten-1].refMateris.length-1
                idx_konten -= 1
            }
            else
                idx_materi -= 1

            this.$store.dispatch('cat/setActiveMateri',{
                idx_konten:idx_konten,
                idx_materi:idx_materi,
            })
            await this.loadMateri()
        },
        loadNavigation(){
            var idx_konten = this.active_materi.idx_konten
            var idx_materi = this.active_materi.idx_materi
            var kontens = this.kelas.refKontens
            var materis = kontens[idx_konten].refMateris
            var materi = materis[idx_materi]

            var next = typeof kontens[idx_konten].refMateris[idx_materi+1] === 'object' && materi.status_selesai ? 1 : 0
            var prev = idx_materi == 0 && idx_konten == 0 ? 0 : 1

            if(idx_materi == materis.length - 1 && typeof kontens[idx_konten+1] === 'object' && materi.status_selesai)
            {
                next = 1
            }

            this.$store.dispatch('cat/setNavigation',{
                next:next,
                prev:prev
            })
        }
    },
    computed: {
        ...mapGetters({
            nav_sidebar: 'global/getNavSidebar',
            kelas: 'kelas/getSingleKelas',
            materi: 'kelas/getMateri',
            loading: 'cat/getLoading',
            navigation_enable: 'cat/getNavigation',
            active_materi: 'cat/getActiveMateri',
            exam_content: 'kelas/getExamContent',
            session: 'kelas/getSession',
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