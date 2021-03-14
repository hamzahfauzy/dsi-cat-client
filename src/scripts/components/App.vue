<template>
    <div>
        <loading :active.sync="isFullLoading" :is-full-page="fullPage" class="loader-full"></loading>
        <router-view></router-view>
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
import Loading from 'vue-loading-overlay'
export default {
    components: {
        Loading
    },
    data(){
        return {
            fullPage:true
        }
    },
    computed: {
        ...mapGetters({
            isFullLoading: 'dialog/isFullLoading',
        })
    }
}
</script>