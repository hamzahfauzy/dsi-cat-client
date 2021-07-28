<template>
    <div class="sidebar">
        <create-konten :id_pelatihan="id_pelatihan"></create-konten>
        <create-materi :id_pelatihan="id_pelatihan"></create-materi>
        <edit-konten :id_pelatihan="id_pelatihan" :id_konten="edit.id_konten" :nm_konten="edit.nm_konten"></edit-konten>
        <md-list>
            <md-subheader>
                <span><b>Konten Saya</b></span>
            </md-subheader>

            <md-list-item style="cursor:pointer;">
                <md-icon>add</md-icon>
                <span class="md-list-item-text" @click="openCreateKonten()">Buat Konten</span>
            </md-list-item>

            <md-list-item md-expand :md-expanded="true" v-for="(content, index) in kontens" :key="index">
                <!-- <md-icon @click="openEditKonten(content.id_konten)">create</md-icon>
                <md-icon @click="hapusKonten(content.id_konten)">delete</md-icon> -->
                <span class="md-list-item-text">
                    {{content.nm_konten}}
                </span>

                <md-list slot="md-expand">
                    <md-list-item class="md-inset" style="margin-top:-15px;">
                        <div class="item-child-content">
                            <md-button @click="openEditKonten(content.id_konten)" style="margin:0;min-width:0px;">
                                <md-icon>create</md-icon>
                            </md-button>
                            <md-button @click="hapusKonten(content.id_konten)" style="margin:0;min-width:0px;">
                                <md-icon>delete</md-icon>
                            </md-button>
                        </div>
                    </md-list-item>
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
import Swal from 'sweetalert2'
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
            edit:{
                id_konten:0,
                nm_konten:''
            }
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
        async openEditKonten(id_konten){
            this.$store.dispatch('dialog/setEditKontenDialogStatus',true)
            var response = await this.$store.dispatch('konten/single',id_konten)
            if(response.data)
            {
                this.edit.id_konten = response.data.id_konten
                this.edit.nm_konten = response.data.nm_konten
            }
        },
        hapusKonten(id_konten){
            var vm = this
            Swal.fire({
                title: 'Hapus Konten',
                text: 'Apakah anda yakin akan menghapus konten ini?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: `Hapus`,
                denyButtonText: `Batal`,
            }).then(async (result) => {
                if (result.isConfirmed)
                {
                    var id_pelatihan = vm.id_pelatihan
                    await vm.$store.dispatch('konten/hapus',{id_pelatihan:id_pelatihan,id_konten:id_konten})
                    Swal.fire('Berhasil', 'Konten Berhasil Di Hapus', 'success')
                    await vm.$store.dispatch('konten/get',id_pelatihan)
                }
            })
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