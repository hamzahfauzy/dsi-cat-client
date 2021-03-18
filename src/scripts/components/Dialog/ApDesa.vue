<template>
    <div class="profile-dialog">
        <div class="row">
            <div class="col-12 col-md-4">
                <img src="dist/images/logo_app_small.png" alt="" width="100%">
            </div>
            <div class="col-12 col-md-8">
                <div class="form-group">
                    <label for="">NIPD</label>
                    <span>{{profile.nipd}}</span>
                </div>
                <div class="form-group">
                    <label for="">NIK</label>
                    <span>{{profile.nik}}</span>
                </div>
                <div class="form-group">
                    <label for="">Nama</label>
                    <span>{{profile.nm_ap_desa}}</span>
                </div>
                <div class="form-group">
                    <label for="">Tempat Lahir</label>
                    <span>{{profile.tempat_lahir}}</span>
                </div>
                <div class="form-group">
                    <label for="">Tanggal Lahir</label>
                    <span>{{profile.tgl_lahir}}</span>
                </div>
                <div class="form-group">
                    <label for="">Email</label>
                    <span>{{profile.email_ap_desa}}</span>
                </div>
                <div class="form-group">
                    <label for="">Alamat</label>
                    <span>{{profile.alamat}}</span>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
    computed: {
        ...mapGetters({
            profile: 'global/getProfile',
        })
    }
}
</script>