<template>
    <div class="cat-login">
        <div class="page_loader"></div>

        <!-- Login 4 start -->
        <div class="login-4">
            <div class="container">
                <div class="row login-box">
                    <div class="col-lg-7 pad-0 form-info">
                        <a :href="app_link" class="btn-back-login"><md-icon>keyboard_backspace</md-icon>Kembali</a>
                        <div class="form-section align-self-center">
                            <div class="btn-section clearfix">
                                <h3>FPKAD - CAT<br>Kementerian Dalam Negeri</h3>
                            </div>
                            <div class="logo">
                                <a href="login-4.html">
                                    <img src="dist/images/logo_app_small.png" alt="logo">
                                </a>
                            </div>
                            <h1>Selamat Datang!</h1>
                            <h3>Masukkan akun FPKAD digital untuk memulai pelatihan.</h3>
                            <div class="clearfix"></div>
                            <form @submit="doLogin">
                                <div class="form-group form-box">
                                    <label>Alamat Email</label>
                                    <input v-model="username" type="email" name="email" class="input-text" placeholder="Alamat Email">
                                </div>
                                <div class="form-group form-box clearfix">
                                    <label>Kata Sandi</label>
                                    <input v-model="password" type="password" name="Password" class="input-text" placeholder="Password">
                                </div>
                                <!-- <div class="checkbox form-group clearfix">
                                    <div class="form-check checkbox-theme">
                                        <input class="form-check-input" type="checkbox" value="" id="rememberMe">
                                        <label class="form-check-label" for="rememberMe">
                                            Remember me
                                        </label>
                                    </div>
                                    <a href="" class="forgot-password">Forgot Password</a>
                                </div> -->
                                <div class="form-group clearfix">
                                    <button type="submit" class="btn-md btn-theme btn-block">Masuk</button>
                                </div>
                            </form>
                            <loading :active.sync="isLoading" :is-full-page="fullPage" class="loader-full"></loading>
                            <div class="social-list" style="text-align:center">
                                <a href="#">
                                    <i class="fa fa-facebook"></i>
                                </a>
                                <a href="#">
                                    <i class="fa fa-twitter"></i>
                                </a>
                                <a href="#">
                                    <i class="fa fa-instagram"></i>
                                </a>
                                <a href="#">
                                    <i class="fa fa-youtube"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-5 bg-color-15 pad-0 none-992 bg-img">
                    </div>
                </div>
            </div>
        </div>
        <!-- Login 4 end -->
    </div>
</template>
<script>
import Loading from 'vue-loading-overlay';
import Swal from 'sweetalert2';
export default {
    components:{
        Loading
    },
    created(){
        this.app_link = env.app_link
    },
    data() {
        return {
            isLoading:false,
            isContentLoading:false,
            fullPage:true,
            app_link:'',
            errors: {
                username:'',
                password:''
            },
            username:null,
            password:null
        }
    },
    methods:{
        doLogin: async function(e){
            e.preventDefault();
            this.isLoading = true
            this.errors = {
                username:'',
                password:''
            }
            if(this.username && this.password)
            {
                var formdata = new FormData;
                formdata.append('username',this.username)
                formdata.append('password',this.password)
                var login = await this.$store.dispatch('global/login',formdata)
                if(login.status == 404)
                {
                    Swal.fire('Oops...', 'Email atau Password tidak valid!', 'error')
                    this.isLoading = false
                    return
                }

                window.localStorage.setItem('token',login.data.token)
                this.$router.push('/kelas-saya')
                this.isLoading = false
                return
            }

            if(!this.username || this.username == null)
                this.errors.username = 'Email tidak boleh kosong'

            if(!this.password || this.password == null)
                this.errors.password = 'Password tidak boleh kosong'

            this.isLoading = false
            return false
        }
    }
}
</script>