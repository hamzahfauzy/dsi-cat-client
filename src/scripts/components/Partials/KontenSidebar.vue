<template>
    <div class="sidebar">
        <create-konten :id_pelatihan="id_pelatihan"></create-konten>
        <create-materi :id_pelatihan="id_pelatihan"></create-materi>
        <md-list>
            <md-subheader>
                <span><b>Konten Saya</b></span>
            </md-subheader>

            <md-list-item style="cursor:pointer;">
                <md-icon>add</md-icon>
                <span class="md-list-item-text" @click="openCreateKonten()">Buat Konten</span>
            </md-list-item>

            <md-list-item md-expand :md-expanded="true" v-for="(content, index) in kontens" :key="index">
                <span class="md-list-item-text">{{content.nm_konten}}</span>

                <md-list slot="md-expand">
                    <md-list-item class="md-inset" @click="openCreateMateri(content.id_konten)">
                        <div class="item-child-content">
                            <md-icon>add</md-icon>
                            <span style="display:inline-block;white-space:normal;padding-top:3px;">
                                Buat Materi
                            </span>
                            
                        </div>
                    </md-list-item>
                    <md-list-item class="md-inset" v-for="(children,idx) in content.refMateris" :key="idx" @click="activeMateri(index, idx)">
                        <div class="item-child-content" :class="{'materi_active':index==active_materi.idx_konten&&idx==active_materi.idx_materi}">
                            <md-icon>{{tipe_konten[children.jenis_materi]}}</md-icon>
                            <span style="display:inline-block;white-space:normal;padding-top:3px;">
                                {{children.nm_materi}}
                            </span>
                            
                        </div>
                    </md-list-item>
                </md-list>
            </md-list-item>
        </md-list>
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
    data(){
        return {
            id_pelatihan:'',
            tipe_konten:{
                '2':'content_paste',
                '1':'play_circle_filled',
                'exam':'create',
            },
        }
    },
    async created(){
        this.id_pelatihan = this.$route.params.id
    },
    methods:{
        async activeMateri(idx_konten,idx_materi){
            // console.log(idx_konten,idx_materi)
            this.$store.dispatch('cat/setActiveMateri',{
                idx_konten:idx_konten,
                idx_materi:idx_materi,
            })
            await this.loadMateri()
            return;
        },
        async loadMateri(){
            this.$store.dispatch('cat/setLoading',true)
            var idx_konten = this.active_materi.idx_konten
            var idx_materi = this.active_materi.idx_materi
            var kontens = this.kontens
            var materis = kontens[idx_konten].refMateris
            var materi = materis[idx_materi]
            
            var request = await this.$store.dispatch('kelas/fetchMateri',materi.id_materi)
            if(request.status == 401)
                Swal.fire('Oops...', 'Authorized Content!', 'error')
            this.$store.dispatch('cat/setLoading',false)
        },
        openCreateKonten(){
            this.$store.dispatch('dialog/setKontenDialogStatus',true)
        },
        openCreateMateri(id_konten){
            this.$store.dispatch('dialog/setMateriDialogStatus',true)
            this.$store.dispatch('konten/setActiveKontenId',id_konten)
        }
    },
    computed: {
        ...mapGetters({
            kontens: 'konten/get',
            active_materi:'cat/getActiveMateri',
        })
    },
}
</script>