<template>
    <div id="homepage">
        <cat-header></cat-header>
        <div class="container nav-progress-container">
            <div class="nav-progress">
                <progress-bar-mini :level="authData.additional_data.hasOwnProperty('id_narasumber')" :title="kelas.hasOwnProperty('nm_pelatihan')?kelas.nm_pelatihan:'Loading...'" :progress_percent="kelas.hasOwnProperty('progress')?kelas.progress:0"></progress-bar-mini>
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
                            <div v-if="exam_intro.hasOwnProperty('title')" class="intro">
                                <div style="text-align:center;">
                                    <img src="dist/images/exam-icon.png" alt="" width="150px" style="margin-bottom:15px;">
                                    <p></p>
                                    <h3 align="center">{{exam_intro.title}}</h3>
                                    <p align="center">{{exam_intro.content}}</p>
                                    <center>
                                        <button class="btn btn-success" v-if="exam_intro.enable_btn" @click="loadExam(exam_intro.jenis_exam)">Mulai {{exam_intro.title}}</button>
                                    </center>
                                </div>
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
        // var id = this.$route.params.id
        // await this.$store.dispatch('kelas/fetchAllSession',id)
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

            if((idx_materi == materis.length - 1 && typeof kontens[idx_konten+1] === 'object' && materi.status_selesai) || this.authData.additional_data.hasOwnProperty('id_narasumber'))
            {
                next = 1
            }

            this.$store.dispatch('cat/setNavigation',{
                next:next,
                prev:prev
            })
        },
        async loadExam(jenis_exam){
            var vm = this

            var id = this.$route.params.id

            var title = jenis_exam == 0 ? 'Pre Test' : 'Post Test';
            jenis_exam = jenis_exam+1

            Swal.fire({
                title: 'Mulai '+title,
                text: 'Klik mulai jika kamu sudah merasa siap untuk mengikuti '+title,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: `Mulai`,
                denyButtonText: `Batal`,
            }).then(async (result) => {
                if (result.isConfirmed)
                {
                    vm.$store.dispatch('cat/setLoading',true)
                    var request = await vm.$store.dispatch('kelas/fetchExam',{id_pelatihan:id,jenis_exam:jenis_exam})
                    if(request.status == 200)
                    {
                        // if(jenis_exam == 2)
                        // {
                            var durasi = request.data[0].parameter.durasi*60
                            vm.$store.dispatch('global/setCountDown',durasi)
                        // }
                    }
                    vm.$store.dispatch('global/setExamIntro',{})
                    vm.$store.dispatch('cat/setLoading',false)
                }
            })
        }
    },
    computed: {
        ...mapGetters({
            nav_sidebar: 'global/getNavSidebar',
            exam_intro: 'global/getExamIntro',
            kelas: 'kelas/getSingleKelas',
            materi: 'kelas/getMateri',
            loading: 'cat/getLoading',
            navigation_enable: 'cat/getNavigation',
            active_materi: 'cat/getActiveMateri',
            exam_content: 'kelas/getExamContent',
            authData: 'global/getAuthData',
            session: 'kelas/getSession'
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