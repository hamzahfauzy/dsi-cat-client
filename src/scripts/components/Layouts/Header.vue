<template>
    <section class="top">
        <profile-dialog></profile-dialog>
        <div class="container" style="position:relative;max-width:1024px;">
            <div class="right-menu">
                <ul>
                    <li>
                        <router-link to="/kelas-saya" :class="{'nav-active':header_aktif=='kelas-saya'}">Kelas Saya</router-link>
                    </li>
                    <li>
                        <a href="javascript:void(0)" @click="$store.dispatch('dialog/setDialogStatus',true)">Hamzah Fauzi</a>
                    </li>
                    <li>
                        <md-menu md-size="medium" md-align-trigger md-direction="bottom-end" class="account-toggle">
                            <md-button md-menu-trigger>
                                <md-icon>account_circle</md-icon>
                            </md-button>

                            <md-menu-content>
                                <md-menu-item @click="$store.dispatch('dialog/setDialogStatus',true)">
                                    <md-icon>account_circle</md-icon>
                                    <span>My Profile</span> 
                                </md-menu-item>
                                <md-menu-item @click="doLogout()">
                                    <md-icon>logout</md-icon>
                                    <span>Log Out</span> 
                                </md-menu-item>
                            </md-menu-content>
                        </md-menu>
                    </li>
                </ul>
            </div>
            <div class="logo" style="background-image:url(dist/images/logo_app_small.png)"></div>
            <div class="title-section">
                <router-link to="/dashboard">
                    <h4>KEMENTRIAN DALAM NEGERI</h4>
                    <span>Fasilitasi Pengembangan Kapasitas Aparatur Desa ( FPKAD )</span>
                </router-link>
            </div>
        </div>
    </section>
</template>
<script>
import { mapGetters } from 'vuex'
import Swal from 'sweetalert2';
export default {
    methods: {
        Alert(val){
            Swal.fire(val)
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
        }),
        header_aktif: {
            get(){
                return this.headerAktif
            },
            set(val){
                this.$store.dispatch('global/setHeader',val)
            }
        }
    }
}
</script>