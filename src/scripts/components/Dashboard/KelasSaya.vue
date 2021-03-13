<template>
    <div id="homepage">
        <Header></Header>

        <div class="homepage-content container list-kelas">
            <div class="main-title-container">
                <h3 align="center" class="main-title">KELAS SAYA</h3>
            </div>
            <div class="container" style="max-width:1024px;">
                <!-- <search></search> -->
                <div class="row">
                    <div class="col-12 col-sm-4">
                        <div class="sidebar">
                            <md-list>
                                <md-subheader>
                                    <span> </span>
                                </md-subheader>

                                <md-list-item @click="loadKelas('site/kelas-saya')">Semua Kelas</md-list-item>
                                <md-list-item @click="loadKelas('site/kelas-saya')">Sedang Dikerjakan</md-list-item>
                                <md-list-item @click="loadKelas('site/kelas-saya')">Selesai Materi</md-list-item>
                                <md-list-item @click="loadKelas('site/kelas-saya')">Selesai Test</md-list-item>
                            </md-list>
                        </div>
                    </div>
                    <div class="col-12 col-sm-8">
                        <loading :active.sync="isLoading" :is-full-page="fullPage" class="loader"></loading>
                        <div class="kelas-list">
                            <md-list class="md-triple-line list-kelas" v-if="isLoading==false">
                                <div v-for="(kelas,index) in list_kelas" :key="index">
                                    <md-list-item  style="padding-bottom:10px;">
                                        <md-avatar class="custom-avatar">
                                            <img :src="kelas.image?kelas.image:'https://183263-537949-raikfcquaxqncofqfm.stackpathdns.com/wp-content/uploads/2018/05/shutterstock_285147194.jpg'" :alt="kelas.name">
                                        </md-avatar>

                                        <div class="md-list-item-text">
                                            <span>{{kelas.nm_pelatihan}}</span>
                                            <p> </p>
                                            <div style="margin-top:10px;">
                                                <!-- <progress-bar v-if="kelas.status != ''" :progress_percent="kelas.progress_percent" :flex="1" :title="'Progress Kelas'" /> -->
                                                <md-button class="md-raised md-primary" style="width:auto!important;text-transform:capitalize" @click="$router.push('/details/'+kelas.id_pelatihan)">Ikuti</md-button>
                                                <!-- <md-button class="md-raised md-primary md-success-btn" style="width:auto!important;text-transform:capitalize" v-if="kelas.status == 'Selesai'" @click="$router.push('/details/'+kelas.id)">Selesai</md-button> -->
                                            </div>
                                        </div>

                                        <!-- <md-button class="md-icon-button md-list-action">
                                            <md-icon class="md-primary">star</md-icon>
                                        </md-button> -->
                                    </md-list-item>
                                </div>
                                <div v-if="list_kelas.length == 0">
                                    <center><i>Tidak ada kelas!</i></center>
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
import Swal from 'sweetalert2';
import Loading from 'vue-loading-overlay';
export default {
    components:{
        Loading,
    },
    data(){
        return {
            isLoading:false,
            fullPage:true,
            list_kelas:[]
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
        loadKelas: async function(endpoint){
            this.isLoading = true
            var request = await this.$store.dispatch('kelas/fetchAllKelas',endpoint)
            if(request.status == 401)
                Swal.fire('Oops...', 'Authorized Content!', 'error')
            else
                this.list_kelas = request.data
            this.isLoading = false
        }
    }
}
</script>