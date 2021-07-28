<template>
    <div class="profile-dialog">
        <div class="row">
            <div class="col-12 col-md-4">
                <img :src="app_link+profile.picture" alt="" width="100%">
            </div>
            <div class="col-12 col-md-8">
                <div class="form-group">
                    <label for="">Nama Lembaga</label>
                    <span>{{profile.profile.nm_lembaga+' ('+profile.profile.singkatan_lembaga+')'}}</span>
                </div>
                <div class="form-group">
                    <label for="">Email Lembaga</label>
                    <span>{{profile.profile.email_lembaga}}</span>
                </div>
                <div class="form-group">
                    <label for="">Penanggung Jawab</label>
                    <span>{{profile.profile.nm_penangung_jwb}}</span>
                </div>
                <div class="form-group">
                    <label for="">No. Telepon</label>
                    <span>{{profile.profile.tlp1}}</span>
                </div>
                <div class="form-group">
                    <label for="">Alamat</label>
                    <span>{{profile.profile.alamat}}</span>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
    data(){
        return {
            app_link:''
        }
    },
    computed: {
        ...mapGetters({
            profile: 'global/getProfile',
        })
    },
    created(){
        this.app_link = env.image_link
    }
}
</script>