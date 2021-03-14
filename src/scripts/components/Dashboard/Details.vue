<template>
    <div id="homepage">
        <cat-header></cat-header>
        <div class="container nav-progress-container">
            <div class="nav-progress">
                <progress-bar :title="kelas.hasOwnProperty('nm_pelatihan')?'Progress '+kelas.nm_pelatihan:'Loading'" :progress_percent="kelas.hasOwnProperty('progress')?kelas.progress:0"></progress-bar>
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
                            
                            <md-list-item md-expand :md-expanded="true" v-for="(content, index) in kelas.refKontens" :key="index">
                                <md-icon>check_circle_outline</md-icon>
                                <span class="md-list-item-text">{{content.nm_konten}}</span>

                                <md-list slot="md-expand">
                                    <md-list-item class="md-inset" v-for="(children,idx) in content.refMateris" :key="idx" @click="activeMateri(index, idx)">
                                        <div class="item-child-content" :class="{'completed':children.status_selesai,'materi_active':index==active_materi.idx_konten&&idx==active_materi.idx_materi}">
                                            <md-icon :class="{'completed':children.status_selesai}">check_circle_outline</md-icon>
                                            <md-icon :class="{'completed':children.status_selesai}">{{tipe_konten[children.jenis_materi]}}</md-icon>
                                            <span style="display:inline-block">
                                                {{children.nm_materi}}<br>
                                                <p class="ket_materi">{{children.ket_materi}}</p>
                                            </span>
                                            
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
                        <div v-if="active_materi.idx_konten==-1">
                            <h3 align="center" v-html="kelas.nm_pelatihan"></h3>
                        </div>
                        <div class="responsive-content" v-if="!isContentLoading">
                            <video class="responsive-iframe" controls v-if="materi.jenis_materi==1" ref="videoPlayer"
                            @canplay="updatePaused" 
                            @playing="updatePaused" 
                            @pause="updatePaused" 
                            @timeupdate="timeupdate"
                            @seeking="seeking"
                            >
                                <source :src="materi.url_player" type="video/mp4" />
                            </video>
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
            videoElement: null,
            paused: null,
            isLoading:false,
            isContentLoading:false,
            fullPage:true,
            kelas:{},
            tipe_konten:{
                '2':'content_paste',
                '1':'slow_motion_video',
                'exam':'create',
            },
            konten:[],
            materi:{},
            kelas:{},
            ended_is_send:false,
            navigation_enable:{
                next:0,
                prev:0,
            },
            active_materi:{
                idx_konten:-1,
                idx_materi:-1,
            },
            video_handle: {
                supposedCurrentTime:0,
            }
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
            else
            {
                this.kelas = request.data
            }
        },
        blank(){
            // window.alert(val)
        },
        timeupdate: function(){
            var video = this.$refs.videoPlayer
            if (!video.seeking) {
                this.video_handle.supposedCurrentTime = video.currentTime;
                var percent = (video.currentTime / video.duration * 100).toFixed(2);
                // console.log(percent)
                if(Math.floor(percent) == 75 && !this.materi.status_selesai)
                {
                    if(!this.ended_is_send)
                        this.sendEnded(this.materi.id_materi)
                }
            }
        },
        seeking: function(){
            var video = this.$refs.videoPlayer
            var delta = video.currentTime - this.video_handle.supposedCurrentTime;
            // if (Math.abs(delta) > 0.01) {
            if (delta > 0.01 && !this.materi.status_selesai) {
                console.log("Seeking is disabled");
                video.currentTime = this.video_handle.supposedCurrentTime;
            }
        },
        async activeMateri(idx_konten,idx_materi){
            var materi = this.kelas.refKontens[idx_konten].refMateris[idx_materi]

            if(materi.status_materi||(idx_konten==0&idx_materi==0)){
                this.active_materi.idx_konten = idx_konten
                this.active_materi.idx_materi = idx_materi
                await this.loadMateri()
                return;
            }

            if(idx_materi == 0 && idx_konten > 0)
            {
                // last materi in prev content
                var temp_idx_konten = idx_konten - 1
                var temp_materis = this.kelas.refKontens[temp_idx_konten].refMateris.length
                var temp_idx_materi = temp_materis - 1
                var temp_materi = this.kelas.refKontens[temp_idx_konten].refMateris[temp_idx_materi]
                if(temp_materi.status_selesai)
                {
                    this.active_materi.idx_konten = idx_konten
                    this.active_materi.idx_materi = idx_materi
                    await this.loadMateri()
                    return;
                }
                

            }

            if(idx_materi > 0 && idx_konten >= 0)
            {
                // last materi in prev content
                var temp_idx_konten = idx_konten
                var temp_idx_materi = idx_materi - 1
                var temp_materi = this.kelas.refKontens[temp_idx_konten].refMateris[temp_idx_materi]
                if(temp_materi.status_selesai)
                {
                    this.active_materi.idx_konten = idx_konten
                    this.active_materi.idx_materi = idx_materi
                    await this.loadMateri()
                    return;
                }
            }

            // if(idx_materi>0)
            // {
            //     var temp_idx_konten = idx_konten > 0 ? idx_konten-1 : idx_konten
            //     var temp_idx_materi = idx_materi-1
            // }
        },
        async nextMateri(){
            this.active_materi.idx_materi++
            await this.loadMateri()
        },
        async prevMateri(){
            this.active_materi.idx_materi--
            await this.loadMateri()
        },
        loadNavigation(){
            var materi = this.kelas.refKontens[this.active_materi.idx_konten].refMateris[this.active_materi.idx_materi]
            console.log(materi)
            this.navigation_enable.next = typeof this.kelas.refKontens[this.active_materi.idx_konten].refMateris[this.active_materi.idx_materi+1] === 'object' && materi.status_selesai ? 1 : 0
            this.navigation_enable.prev = typeof this.kelas.refKontens[this.active_materi.idx_konten].refMateris[this.active_materi.idx_materi-1] === 'undefined' ? 0 : 1
        },
        async loadMateri(){
            this.video_handle.supposedCurrentTime = 0
            this.isContentLoading = true
            var materi = this.kelas.refKontens[this.active_materi.idx_konten].refMateris[this.active_materi.idx_materi]
            
            this.navigation_enable.next = typeof this.kelas.refKontens[this.active_materi.idx_konten].refMateris[this.active_materi.idx_materi+1] === 'object' && materi.status_selesai ? 1 : 0
            this.navigation_enable.prev = typeof this.kelas.refKontens[this.active_materi.idx_konten].refMateris[this.active_materi.idx_materi-1] === 'undefined' ? 0 : 1

            var request = await this.$store.dispatch('kelas/fetchMateri',materi.id_materi)
            if(request.status == 401)
                Swal.fire('Oops...', 'Authorized Content!', 'error')
            else
                this.materi = request.data
            this.isContentLoading = false
        },
        async sendEnded(id_materi){
            this.ended_is_send = true
            await this.$store.dispatch('kelas/finishMateri',id_materi)
            await this.loadSidebar()
            this.loadNavigation()
            this.ended_is_send = false
        },
        updatePaused(event) {
            this.videoElement = event.target;
            this.paused = event.target.paused;
        },
        play() {
            this.videoElement.play();
        },
        pause() {
            this.videoElement.pause();
        }
    },
    computed: {
        ...mapGetters({
            nav_sidebar: 'global/getNavSidebar'
        }),
        playing() { return !this.paused; }
    }
}
</script>