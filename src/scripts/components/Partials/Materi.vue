<template>
    <div>
        <template v-if="getId(materi.nm_file) == null">
        <div class="responsive-content" v-if="materi.hasOwnProperty('jenis_materi') && materi.jenis_materi==1">
            <video class="responsive-iframe" controls ref="videoPlayer"
                @canplay="updatePaused" 
                @playing="updatePaused" 
                @pause="updatePaused" 
                @timeupdate="timeupdate"
                @seeking="seeking"
                >
                    <source :src="materi.url_player" type="video/mp4" />
            </video>
        </div>
        </template>
        <template v-else>
            <div style="height: calc(100vh - 200px);">
            <iframe width="100%" style="height:100%!important;" :src="'https://www.youtube.com/embed/' 
            + getId(materi.nm_file)" frameborder="0" allowfullscreen></iframe>
            </div>
        </template>
        <div v-if="materi.hasOwnProperty('jenis_materi') && materi.jenis_materi==2" class="intro">
            <div style="text-align:center">
                <img src="dist/images/file.png" alt="" width="150px" style="margin-bottom:15px;">
                <p></p>
                <div>
                    <button class="btn btn-success" @click="downloadMateri(materi)" style="color:#FFF;text-decoration:none" target="_blank">Download File</button>
                </div>
            </div>
        </div>
        <br>
        <h4 v-html="materi.nm_materi"></h4>
        <p v-html="materi.ket_materi"></p>
        <p v-if="!(materi.lampiran == null)">
            <md-button :href="materi.lampiran.url" class="md-raised md-accent">
                <md-icon>download</md-icon>
                Download
            </md-button>
        </p>
    </div>
</template>
<style scoped>
a:hover {
    text-decoration: none;
}
</style>
<script>
import { mapGetters } from 'vuex'
export default {
    data(){
        return {
            videoElement: null,
            paused: null,
            ended_is_send:false,
            app_link:'',
            video_handle: {
                supposedCurrentTime:0,
            },
            yt_id:null
        }
    },
    created(){
        this.app_link = env.app_link
    },
    methods:{
        downloadMateri(materi){
            var id = this.$route.params.id
            var vm = this
            this.$store.dispatch('kelas/finishMateri',materi.id_materi).then(res => {
                vm.$store.dispatch('kelas/fetchSingleKelas',id)
            })
            window.open(this.app_link+'e-sistem/public/download?key='+materi.encode_file)
        },
        timeupdate: function(){
            if(this.authData.additional_data.hasOwnProperty('id_narasumber')) return
            var video = this.$refs.videoPlayer
            if (!video.seeking) {
                this.video_handle.supposedCurrentTime = video.currentTime;
                var percent = (video.currentTime / video.duration * 100).toFixed(2);
                // console.log(percent)
                if(Math.floor(percent) == 99 && !this.materi.status_selesai)
                {
                    if(!this.ended_is_send)
                        this.sendEnded(this.materi.id_materi)
                }
            }
        },
        seeking: function(){
            if(this.authData.additional_data.hasOwnProperty('id_narasumber')) return
            var video = this.$refs.videoPlayer
            var delta = video.currentTime - this.video_handle.supposedCurrentTime;
            // if (Math.abs(delta) > 0.01) {
            if (delta > 0.01 && !this.materi.status_selesai) {
                console.log("Seeking is disabled");
                video.currentTime = this.video_handle.supposedCurrentTime;
            }
        },
        sendEnded(id_materi){
            if(this.authData.additional_data.hasOwnProperty('id_narasumber')) return
            var vm = this
            this.ended_is_send = true
            var kelas = JSON.parse(JSON.stringify(this.kelas))
            kelas.refKontens[this.active_materi.idx_konten].refMateris[this.active_materi.idx_materi].status_selesai = true
            this.$store.dispatch('kelas/setSingleKelas',kelas)
            var id = this.$route.params.id
            this.$store.dispatch('kelas/finishMateri',id_materi).then(res => {
                vm.$store.dispatch('kelas/fetchSingleKelas',id)
                vm.ended_is_send = false
                var idx_konten = vm.active_materi.idx_konten
                var idx_materi = vm.active_materi.idx_materi
                var kontens = vm.kelas.refKontens
                var materis = kontens[idx_konten].refMateris
                var materi = materis[idx_materi]

                var next = typeof kontens[idx_konten].refMateris[idx_materi+1] === 'object' && materi.status_selesai ? 1 : 0
                var prev = idx_materi == 0 && idx_konten == 0 ? 0 : 1

                if(idx_materi == materis.length - 1 && typeof kontens[idx_konten+1] === 'object' && materi.status_selesai)
                {
                    next = 1
                }
                
                vm.$store.dispatch('cat/setNavigation',{
                    next:next,
                    prev:prev
                })
            })
            // await this.loadSidebar()
            // this.loadNavigation()
        },
        updatePaused(event) {
            if(this.authData.additional_data.hasOwnProperty('id_narasumber')) return
            this.videoElement = event.target;
            this.paused = event.target.paused;
        },
        play() {
            this.videoElement.play();
        },
        pause() {
            this.videoElement.pause();
        },
        getId(url){
            if(url == '') return
            const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
            const match = url.match(regExp);

            return (match && match[2].length === 11)
            ? match[2]
            : null;
        },
        embed(){
            const videoId = this.getId();
            const iframeMarkup = '<iframe width="560" height="315" src="//www.youtube.com/embed/' 
                + videoId + '" frameborder="0" allowfullscreen></iframe>';
            return iframeMarkup
            // console.log('Video ID:', videoId)
        }
    },
    computed: {
        ...mapGetters({
            materi: 'kelas/getMateri',
            kelas: 'kelas/getSingleKelas',
            active_materi:'cat/getActiveMateri',
            authData: 'global/getAuthData'
        }),
        playing() { return !this.paused; }
    },
    watch: {
        materi: function(){
            console.log(this.materi)
            if(this.materi && this.getId(this.materi.nm_file))
            {
                this.yt_id = this.getId()
            }
        },
    }
}
</script>