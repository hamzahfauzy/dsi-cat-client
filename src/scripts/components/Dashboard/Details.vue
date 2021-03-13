<template>
    <div id="homepage">
        <cat-header></cat-header>
        <div class="container nav-progress-container">
            <div class="nav-progress">
                <progress-bar :title="kelas.hasOwnProperty('nm_pelatihan')?'Progress '+kelas.nm_pelatihan:'Loading'" :progress_percent="kelas.hasOwnProperty('progress_percent')?kelas.progress_percent:0"></progress-bar>
            </div>
        </div>

        <div class="cat-section">
            <loading :active.sync="isLoading" :is-full-page="fullPage" class="loader"></loading>
            <div class="row" v-if="!isLoading">
                <div class="col-12 col-xs-6 col-sm-4 col-md-3 col collapsed-sidebar" :class="{'show':nav_sidebar}">
                    <div class="sidebar">
                        <md-list>
                            <md-subheader>
                                <span><b>Konten Kelas</b></span>
                            </md-subheader>
                            
                            <md-list-item md-expand v-for="(content, index) in kelas.refKontens" :key="index">
                                <md-icon>check_circle_outline</md-icon>
                                <span class="md-list-item-text">{{content.nm_konten}}</span>

                                <md-list slot="md-expand">
                                    <md-list-item class="md-inset" v-for="(children,idx) in content.refMateris" :key="idx" @click="activeMateri(index, idx)">
                                        <div class="item-child-content" :class="{'materi_active':index==active_materi.idx_konten&&idx==active_materi.idx_materi}">
                                            <md-icon :class="{'completed':children.status=='finish'}">check_circle_outline</md-icon>
                                            <!-- <md-icon>{{tipe_konten[children.type]}}</md-icon> -->
                                            {{children.nm_materi}}
                                        </div>
                                    </md-list-item>
                                </md-list>
                            </md-list-item>
                        </md-list>
                    </div>
                </div>
                <div class="col-12 col-xs-6 col-sm-8 col-md-9 col main-content" @click="$store.dispatch('global/closeNavSidebar')">
                    <div class="kelas-konten">
                        <loading :active.sync="isContentLoading" :is-full-page="fullPage" class="loader"></loading>
                        <div class="responsive-content" v-if="!isContentLoading">
                            <iframe v-if="materi.nm_file" :src="materi.nm_file" frameborder="0" class="responsive-iframe"></iframe>
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
            isContentLoading:false,
            fullPage:true,
            kelas:{},
            tipe_konten:{
                'konten_dokumen':'content_paste',
                'konten_video':'slow_motion_video',
                'exam':'create',
            },
            konten:[],
            materi:{},
            kelas:{},
            navigation_enable:{
                next:0,
                prev:0,
            },
            active_materi:{
                idx_konten:-1,
                idx_materi:-1,
            }
        }
    },
    async created(){
        this.$store.dispatch('global/setHeader','kelas-saya')
        this.isLoading = true
        var id = this.$route.params.id
        var request = await this.$store.dispatch('kelas/fetchSingleKelas',id)
        if(request.status == 401)
            Swal.fire('Oops...', 'Authorized Content!', 'error')
        else
        {
            this.kelas = request.data
        }
        this.isLoading = false
        
    },
    methods:{
        alert(val){
            window.alert(val)
        },
        async activeMateri(idx_konten,idx_materi){
            this.active_materi.idx_konten = idx_konten
            this.active_materi.idx_materi = idx_materi
            await this.loadMateri()
        },
        async nextMateri(){
            this.active_materi.idx_materi++
            await this.loadMateri()
        },
        async prevMateri(){
            this.active_materi.idx_materi--
            await this.loadMateri()
        },
        async loadMateri(){
            this.isContentLoading = true
            var materi = this.kelas.refKontens[this.active_materi.idx_konten].refMateris[this.active_materi.idx_materi]

            this.navigation_enable.next = typeof this.kelas.refKontens[this.active_materi.idx_konten].refMateris[this.active_materi.idx_materi+1] === 'undefined' ? 0 : 1
            this.navigation_enable.prev = typeof this.kelas.refKontens[this.active_materi.idx_konten].refMateris[this.active_materi.idx_materi-1] === 'undefined' ? 0 : 1

            var request = await this.$store.dispatch('kelas/fetchMateri',materi.id_materi)
            if(request.status == 401)
                Swal.fire('Oops...', 'Authorized Content!', 'error')
            else
                this.materi = request.data
            this.isContentLoading = false
        }
    },
    computed: {
        ...mapGetters({
            nav_sidebar: 'global/getNavSidebar'
        }),
    }
}
</script>