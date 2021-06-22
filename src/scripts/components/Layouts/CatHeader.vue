<template>
    <section class="top cat">
        <profile-dialog></profile-dialog>
        <div class="container-fluid" style="position:relative;">
            <div class="right-menu">
                <ul>
                    <li v-if="authData.additional_data.hasOwnProperty('id_narasumber')">
                        <router-link :to="'/konten-saya/'+$route.params.id" :class="{'nav-active':header_aktif=='konten-saya'}">
                        Konten Saya
                        </router-link>
                    </li>
                    <li>
                        <router-link to="/kelas-saya" :class="{'nav-active':header_aktif=='kelas-saya'}">
                        Daftar Pelatihan
                        </router-link>
                    </li>
                    <li v-if="authData.additional_data.hasOwnProperty('id_lembaga') == false">
                        <router-link :to="'/forum-diskusi/'+$route.params.id" :class="{'nav-active':header_aktif=='forum-diskusi'}">Forum Diskusi</router-link>
                    </li>
                    <li>
                        <md-menu md-size="medium" md-align-trigger md-direction="bottom-end" class="account-toggle">
                            <md-button md-menu-trigger>
                                <md-icon>account_circle</md-icon>
                            </md-button>

                            <md-menu-content>
                                <md-menu-item @click="loadProfile()">
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
                    <li>
                        <md-menu md-size="medium" md-align-trigger md-direction="bottom-end" class="account-toggle toggle-sidebar-btn">
                            <md-button md-menu-trigger @click="toggleNav()">
                                <md-icon>table_rows</md-icon>
                            </md-button>
                        </md-menu>
                    </li>
                </ul>
            </div>
            <div class="logo" style="background-image:url(dist/images/logo_app_small.png)"></div>
            <div class="title-section">
                <a href="javascript:void(0)" @click="toggleNav()">
                    <h4>LMS-PEMDES</h4>
                    <span>Kementerian Dalam Negeri</span>
                </a>
            </div>
        </div>
    </section>
</template>
<script>
import { mapGetters } from 'vuex'
import Swal from 'sweetalert2';
export default {
    created(){

    },
    methods: {
        Alert(val){
            Swal.fire(val)
        },
        doLogout: async function()
        {
            await this.$store.dispatch('global/logout')
            this.$router.push({name:'Login'})
        },
        async loadProfile(){
            this.$store.dispatch('dialog/setDialogStatus',true)
            await this.$store.dispatch('global/fetchProfile')
        },
        toggleNav(){
            this.$store.dispatch('global/toggleNavSidebar')
        }
    },
    computed: {
        ...mapGetters({
            headerAktif: 'global/getHeaderAktif',
            authData: 'global/getAuthData'
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