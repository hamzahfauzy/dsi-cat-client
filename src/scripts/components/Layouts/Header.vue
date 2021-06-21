<template>
    <section class="top">
        <profile-dialog></profile-dialog>
        <div class="container" style="position:relative;max-width:1024px;">
            <div class="right-menu">
                <ul>
                    <li>
                        <router-link to="/kelas-saya" :class="{'nav-active':header_aktif=='kelas-saya'}">
                        Daftar Pelatihan
                        </router-link>
                    </li>
                    <li>
                        <a href="javascript:void(0)" @click="loadProfile()">{{nama}}</a>
                    </li>
                    <li>
                        <md-menu md-size="medium" md-align-trigger md-direction="bottom-end" class="account-toggle">
                            <md-button md-menu-trigger>
                                <md-icon>account_circle</md-icon>
                            </md-button>

                            <md-menu-content>
                                <md-menu-item @click="$store.dispatch('dialog/setDialogStatus',true)">
                                    <md-icon>account_circle</md-icon>
                                    <span>Profil Saya</span> 
                                </md-menu-item>
                                <md-menu-item @click="doLogout()">
                                    <md-icon>logout</md-icon>
                                    <span>Keluar</span> 
                                </md-menu-item>
                            </md-menu-content>
                        </md-menu>
                    </li>
                </ul>
            </div>
            <div class="logo" style="background-image:url(dist/images/logo_app_small.png)"></div>
            <div class="title-section">
                <router-link to="/kelas-saya">
                    <h4>FPKAD-CAT</h4>
                    <span>Kementerian Dalam Negeri</span>
                </router-link>
            </div>
        </div>
    </section>
</template>
<script>
import { mapGetters } from 'vuex'
import Swal from 'sweetalert2';
export default {
    data(){
        return {
            profile:{},
            nama:'Pengguna'
        }
    },
    created(){
        if(this.authData.hasOwnProperty('additional_data'))
        {
            if(this.authData.additional_data.hasOwnProperty('id_lembaga'))
                this.nama = this.authData.additional_data.nm_lembaga
            if(this.authData.additional_data.hasOwnProperty('id_ap_desa'))
                this.nama = this.authData.additional_data.nm_ap_desa
            if(this.authData.additional_data.hasOwnProperty('id_narasumber'))
                this.nama = this.authData.additional_data.nm_narasumber
        }
        // this.$store.dispatch('global/setHeader',val)
    },
    methods: {
        Alert(val){
            Swal.fire(val)
        },
        async loadProfile(){
            this.$store.dispatch('dialog/setDialogStatus',true)
            var request = await this.$store.dispatch('global/fetchProfile')
            if(request.status == 401)
                Swal.fire('Oops...', 'Authorized Content!', 'error')
            else
                this.profile = request.data
        },
        doLogout: async function()
        {
            await this.$store.dispatch('global/logout')
            this.$router.push({name:'Login'})
        }
    },
    computed: {
        ...mapGetters({
            headerAktif: 'global/getHeaderAktif',
            authData: 'global/getAuthData',
        }),
        header_aktif: {
            get(){
                return this.headerAktif
            },
            set(val){
                this.$store.dispatch('global/setHeader',val)
            }
        }
    },
}
</script>