<template>
    <div id="homepage">
        <Header></Header>
        <pin></pin>
        <detail-dialog></detail-dialog>

        <div class="homepage-content container list-kelas">
            <div class="main-title-container">
                <h3 align="center" class="main-title">DAFTAR PELATIHAN</h3>
            </div>
            <div class="container" style="max-width:1024px;">
                <search></search>
                <div class="row">
                    <div class="col-12 col-sm-4" v-if="authData && authData.additional_data.hasOwnProperty('id_narasumber') == false">
                        <div class="sidebar">
                            <md-list>
                                <md-subheader>
                                    <span>FILTER</span>
                                </md-subheader>

                                <md-list-item @click="loadKelas('semua-kelas')">Semua Pelatihan ({{master_list_kelas.length}})</md-list-item>
                                <md-list-item @click="loadKelas('sedang-dikerjakan')">Sedang Dikerjakan ({{master_list_kelas.filter(kelas => kelas.status_pelatihan && kelas.progress < 100).length}})</md-list-item>
                                <md-list-item @click="loadKelas('selesai-materi')">Selesai Materi ({{master_list_kelas.filter(kelas => kelas.status_pelatihan && kelas.progress == 100).length}})</md-list-item>
                                <md-list-item @click="loadKelas('selesai-test')">Selesai Test ({{master_list_kelas.filter(kelas => kelas.exam).length}})</md-list-item>
                                <md-list-item @click="loadKelas('lembaga')">Pelatihan Oleh Lembaga ({{master_list_kelas.filter(kelas => kelas.nm_lembaga != "Kementerian Dalam Negeri").length}})</md-list-item>
                                <md-list-item @click="loadKelas('kemendagri')">Pelatihan Oleh Kemendagri ({{master_list_kelas.filter(kelas => kelas.nm_lembaga == "Kementerian Dalam Negeri").length}})</md-list-item>
                            </md-list>
                        </div>
                    </div>
                    <div class="col-12" :class="{'col-md-8':authData && authData.additional_data.hasOwnProperty('id_narasumber') == false}">
                        <loading :active.sync="isLoading" :is-full-page="fullPage" class="loader"></loading>
                        <div class="kelas-list">
                            <md-list class="md-triple-line list-kelas" v-if="isLoading==false">
                                <div v-for="(kelas,index) in list_kelas" :key="index">
                                    <md-list-item  style="padding-bottom:10px;">
                                        <md-avatar class="custom-avatar">
                                            <img :src="kelas.url_foto?kelas.thumb:'https://183263-537949-raikfcquaxqncofqfm.stackpathdns.com/wp-content/uploads/2018/05/shutterstock_285147194.jpg'" :alt="kelas.name">
                                        </md-avatar>

                                        <div class="md-list-item-text">
                                            <span>{{kelas.nm_pelatihan}}</span>
                                            <span style="color:#999;font-size:12px;">Oleh : {{kelas.nm_lembaga}}</span>
                                            <p style="font-size:11px;">{{kelas.tanggal}}</p>
                                            <div style="margin-top:10px;">
                                                <template v-if="authData && authData.additional_data.hasOwnProperty('id_narasumber') == false">
                                                    <progress-bar v-if="kelas.status_pelatihan" :progress_percent="kelas.progress" :flex="1" :title="'Progress Pelatihan'" /> 
                                                    <md-button class="md-raised md-primary" style="width:auto!important;text-transform:capitalize;background-color:#f9a507" @click="openDetailDialog(kelas.id_pelatihan)">Detail</md-button>
                                                    <md-button v-if="kelas.status_pelatihan == false" class="md-raised md-primary" style="width:auto!important;text-transform:capitalize;color:#FFF;" @click="ikuti(kelas.id_pelatihan)">Ikuti Pelatihan</md-button>
                                                    <md-button v-if="kelas.status_pelatihan == true" class="md-raised md-accent" style="width:auto!important;text-transform:capitalize;color:#FFF;" @click="$router.push('/details/'+kelas.id_pelatihan)">
                                                    {{kelas.status_pelatihan && kelas.progress == 100 ? 'Lihat' : 'Lanjutkan'}}
                                                    </md-button>
                                                </template>
                                                <template v-else>
                                                    <md-button class="md-raised md-primary" style="width:auto!important;text-transform:capitalize;background-color:#f9a507" @click="openDetailDialog(kelas.id_pelatihan)">Detail</md-button>
                                                    <md-button class="md-raised md-primary" style="width:auto!important;text-transform:capitalize" @click="$router.push('/details/'+kelas.id_pelatihan)">
                                                    Lihat
                                                    </md-button>

                                                    <md-button class="md-raised md-accent" style="width:auto!important;text-transform:capitalize" @click="$router.push('/konten-saya/'+kelas.id_pelatihan)">
                                                    Konten Saya
                                                    </md-button>

                                                    <!-- <md-button class="md-raised md-primary md-success-btn" style="width:auto!important;text-transform:capitalize" v-if="kelas.status == 'Selesai'" @click="$router.push('/details/'+kelas.id)">Selesai</md-button> -->
                                                </template>
                                            </div>
                                                    
                                        </div>

                                        <!-- <md-button class="md-icon-button md-list-action">
                                            <md-icon class="md-primary">star</md-icon>
                                        </md-button> -->
                                    </md-list-item>
                                </div>
                                <div v-if="list_kelas.length == 0">
                                    <center><i>Tidak ada pelatihan!</i></center>
                                </div>

                                <div class="row">
                                    <div class="col-12" style="margin-bottom:15px">
                                        <div style="height: 100px;white-space: nowrap;position: relative;overflow-x: scroll;overflow-y: hidden;-webkit-overflow-scrolling: touch;">
                                        <md-button class="md-icon-button md-raised" v-for="i in pages" :key="i" @click="loadKelas('site/kelas-saya','',i)" style="margin: 0px 10px 0px 0px;color:#000;z-index:2;display: inline-block;" :class="{'btn-nav-active':offset==i}">
                                            {{i}}
                                        </md-button>
                                        </div>
                                        <br>
                                    </div>
                                </div>
                            </md-list>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <Footer></Footer>
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
import Swal from 'sweetalert2';
import Loading from 'vue-loading-overlay';
import DetailDialog from '../Dialog/DetailDialog.vue';
export default {
    components:{
        Loading,
        DetailDialog,
    },
    data(){
        return {
            limit:20,
            offset:1,
            pages:0,
            isLoading:false,
            fullPage:true,
            list_kelas:[],
            master_list_kelas:[],
            kelas_saya:[]
        }
    },
    async created(){
        this.$store.dispatch('global/setHeader','kelas-saya')
        await this.loadKelas('site/kelas-saya')
    },
    methods:{
        alert () {
            window.alert('...')
        },
        loadKelas: async function(endpoint, keyword = false, offset = 1){
            this.isLoading = true
            var master_list_kelas = JSON.parse(JSON.stringify(this.master_list_kelas))
            if(endpoint == 'sedang-dikerjakan')
            {
                this.list_kelas = master_list_kelas.filter(kelas => kelas.status_pelatihan && kelas.progress < 100)
            }
            else if(endpoint == 'selesai-materi')
            {
                this.list_kelas = master_list_kelas.filter(kelas => kelas.status_pelatihan && kelas.progress == 100)
            }
            else if(endpoint == 'semua-kelas')
            {
                this.list_kelas = master_list_kelas
            }
            else if(endpoint == 'selesai-test')
            {
                this.list_kelas = master_list_kelas.filter(kelas => kelas.exam)
            }
            else if(endpoint == 'lembaga')
            {
                this.list_kelas = master_list_kelas.filter(kelas => kelas.nm_lembaga != "Kementerian Dalam Negeri")
            }
            else if(endpoint == 'kemendagri')
            {
                this.list_kelas = master_list_kelas.filter(kelas => kelas.nm_lembaga == "Kementerian Dalam Negeri")
            }
            else if(endpoint == 'search')
            {
                this.list_kelas = master_list_kelas.filter(kelas => kelas.nm_pelatihan.includes(keyword))
            }
            else
            {
                this.offset = offset
                offset = offset - 1
                var request = await this.$store.dispatch('kelas/fetchAllKelas',endpoint+'?limit='+this.limit+'&offset='+offset)
                if(request.status == 401)
                    Swal.fire('Oops...', 'Authorized Content!', 'error')
                else
                {
                    this.pages = Math.ceil(request.data.length / this.limit)
                    this.list_kelas = request.data.rows
                    this.master_list_kelas = request.data.rows
                }
            }

            this.isLoading = false
        },
        ikuti: async function(id_pelatihan){
            this.$store.dispatch('dialog/setPinDialogStatus',{status:true,id_pelatihan:id_pelatihan})
        },
        openDetailDialog: async function(id_pelatihan){
            this.$store.dispatch('kelas/setSingleKelas',{})
            this.$store.dispatch('dialog/setDetailDialogStatus',true)
            await this.$store.dispatch('kelas/fetchSinglePelatihan',id_pelatihan)
        }
    },
    computed:{
        ...mapGetters({
            authData: 'global/getAuthData'
        }),
    }
}
</script>