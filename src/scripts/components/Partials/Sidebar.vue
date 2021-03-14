<template>
    <div class="sidebar">
        <md-list>
            <md-subheader>
                <span><b>Konten Kelas</b></span>
            </md-subheader>

            <md-list-item @click="loadExam(1)">
                <md-icon>assignment</md-icon>
                <span class="md-list-item-text">PRE EXAM</span>
            </md-list-item>
            
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

            <md-list-item @click="loadExam(2)">
                <md-icon>assignment</md-icon>
                <span class="md-list-item-text">POST EXAM</span>
            </md-list-item>
        </md-list>
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
import Swal from 'sweetalert2'
export default {
    data(){
        return {
            tipe_konten:{
                '2':'content_paste',
                '1':'slow_motion_video',
                'exam':'create',
            }
        }
    },
    methods:{
        async activeMateri(idx_konten,idx_materi){
            var materi = this.kelas.refKontens[idx_konten].refMateris[idx_materi]

            if(materi.status_materi||(idx_konten==0&idx_materi==0)){
                console.log(materi)
                this.$store.dispatch('cat/setActiveMateri',{
                    idx_konten:idx_konten,
                    idx_materi:idx_materi,
                })
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
                    this.$store.dispatch('cat/setActiveMateri',{
                        idx_konten:temp_idx_konten,
                        idx_materi:temp_idx_materi,
                    })
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
                    this.$store.dispatch('cat/setActiveMateri',{
                        idx_konten:temp_idx_konten,
                        idx_materi:temp_idx_materi,
                    })
                    await this.loadMateri()
                    return;
                }
            }
        },
        async loadMateri(){
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
            
            this.$store.dispatch('cat/setLoading',true)
            this.$store.dispatch('kelas/setExamContent',[])
            this.$store.dispatch('cat/setNavigation',{
                next:next,
                prev:prev
            })
            
            var request = await this.$store.dispatch('kelas/fetchMateri',materi.id_materi)
            if(request.status == 401)
                Swal.fire('Oops...', 'Authorized Content!', 'error')
            this.$store.dispatch('cat/setLoading',false)
        },
        async loadExam(jenis_exam){
            if(jenis_exam == 2 && !(this.kelas.hasOwnProperty('progress') && this.kelas.progress == 100))
                return

            this.$store.dispatch('cat/setActiveMateri',{
                idx_konten:-1,
                idx_materi:-1,
            })

            var vm = this
            vm.$store.dispatch('kelas/setMateri',{})
            vm.$store.dispatch('cat/setLoading',true)
            vm.$store.dispatch('cat/setNavigation',{
                next:false,
                prev:false
            })
            var id = vm.$route.params.id
            var request = await vm.$store.dispatch('kelas/fetchSession',{id_pelatihan:id,jenis_exam:jenis_exam})
            if(request.status == 404)
            {
                var title = jenis_exam == 1 ? 'Pre Exam' : 'Post Exam';
                Swal.fire({
                    title: 'Apakah anda yakin akan mengikuti '+title+' ?',
                    showCancelButton: true,
                    confirmButtonText: `Yakin`,
                    denyButtonText: `Batal`,
                }).then(async (result) => {
                    if (result.isConfirmed) {
                        await vm.$store.dispatch('kelas/fetchExam',{id_pelatihan:id,jenis_exam:jenis_exam})
                        vm.$store.dispatch('cat/setLoading',false)
                    }
                    else
                    {
                        vm.$store.dispatch('cat/setLoading',false)
                    }
                })
            }
            else
            {
                await vm.$store.dispatch('kelas/fetchExam',{id_pelatihan:id,jenis_exam:jenis_exam})
                vm.$store.dispatch('cat/setLoading',false)
            }
        }
    },
    computed: {
        ...mapGetters({
            kelas: 'kelas/getSingleKelas',
            active_materi:'cat/getActiveMateri'
        })
    }
}
</script>