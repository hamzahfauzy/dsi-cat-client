<template>
    <div class="cat-login">
        <div class="page_loader"></div>

        <!-- Login 4 start -->
        <div class="login-4">
            <div class="container">
                <div class="row login-box" style="padding:15px;">
                    <div class="col-12">
                        <loading :active.sync="isLoading" :is-full-page="fullPage"></loading>
                        <center>
                            Sedang Memvalidasi Token ...
                        </center>
                    </div>
                </div>
            </div>
        </div>
        <!-- Login 4 end -->
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
            isLoading:true,
            fullPage:true
        }
    },
    async created(){
        // console.log(this.$route.params.token)
        var token = this.$route.params.token
        var login = await this.$store.dispatch('global/validateToken',token)
        if(login.status == 404)
        {
            Swal.fire('Oops...', 'Token anda tidak valid!', 'error')
            this.$router.push('/login')
            return
        }

        window.localStorage.setItem('token',token)
        this.$router.push('/kelas-saya')
        
        return
    }
}
</script>