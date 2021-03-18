<template>
    <div id="homepage">
        <Header></Header>

        <div class="homepage-content container list-kelas">
            <div class="main-title-container">
                <h3 class="main-title">KELAS UNTUK ANDA</h3>
            </div>
            <div class="container" style="max-width:1024px;">
                <search></search>
                <div class="row">
                    <div class="col-12 col-sm-4">
                        <div class="sidebar">
                            <md-list>
                                <md-subheader>
                                    <span>Filter</span>
                                </md-subheader>

                                <md-list-item @click="loadKelas('semua-kelas')">Semua Kelas</md-list-item>
                                <md-list-item @click="loadKelas('kelas-by-pengikut')">Paling Banyak Di ikuti</md-list-item>
                                <md-list-item @click="loadKelas('kelas-by-selesai')">Paling Banyak Terselesaikan</md-list-item>
                            </md-list>
                        </div>
                    </div>
                    <div class="col-12 col-sm-8">
                        <loading :active.sync="isLoading" :is-full-page="fullPage" class="loader"></loading>
                        <md-list class="md-triple-line list-kelas" v-if="isLoading==false">
                            <div v-for="(kelas,index) in list_kelas" :key="index">
                                <md-list-item  style="padding-top:10px;padding-bottom:10px;">
                                    <md-avatar class="custom-avatar">
                                        <img :src="kelas.image" :alt="kelas.name">
                                    </md-avatar>

                                    <div class="md-list-item-text">
                                        <span>{{kelas.name}}</span>
                                        <p>{{kelas.deskripsi}}</p>
                                        <div style="margin-top:10px;">
                                            <md-button class="md-raised md-accent md-orange" style="width:auto!important;text-transform:capitalize">Detail</md-button>
                                        </div>
                                    </div>

                                    <!-- <md-button class="md-icon-button md-list-action">
                                        <md-icon class="md-primary">star</md-icon>
                                    </md-button> -->
                                </md-list-item>

                                <md-divider class="md-inset custom-divider"></md-divider>
                            </div>
                            <div v-if="list_kelas.length == 0">
                                <center><i>Tidak ada kelas!</i></center>
                            </div>
                        </md-list>
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
        Loading
    },
    data(){
        return {
            isLoading:false,
            fullPage:true,
            list_kelas:[]
        }
    },
    async created(){
        this.$store.dispatch('global/setHeader','main')
        await this.loadKelas('semua-kelas')
    },
    methods:{
        alert(){
            window.alert('Oke')
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