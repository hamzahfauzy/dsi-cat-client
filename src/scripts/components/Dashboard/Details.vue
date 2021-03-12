<template>
    <div id="homepage">
        <cat-header></cat-header>
        <div class="container" style="max-width:1024px;">
            <div class="nav-progress">
                <progress-bar :title="kelas.hasOwnProperty('name')?'Progress Kelas - '+kelas.name:'Loading'" :progress_percent="kelas.hasOwnProperty('progress_percent')?kelas.progress_percent:0"></progress-bar>
            </div>
        </div>

        <div class="cat-section">
            <loading :active.sync="isLoading" :is-full-page="fullPage" class="loader"></loading>
            <div class="row" v-if="!isLoading">
                <div class="col-12 col-sm-3 col">
                    <div class="sidebar">
                        <md-list>
                            <md-subheader>
                                <span><b>Konten Kelas</b></span>
                            </md-subheader>
                            
                            <md-list-item md-expand v-for="(content, index) in konten" :key="index">
                                <md-icon :class="{'completed':content.status=='finish'}">check_circle_outline</md-icon>
                                <span class="md-list-item-text">{{content.title}}</span>

                                <md-list slot="md-expand">
                                    <md-list-item class="md-inset" v-for="(children,idx) in content.childs" :key="idx" @click="alert(children.title)">
                                        <div class="item-child-content">
                                            <md-icon :class="{'completed':children.status=='finish'}">check_circle_outline</md-icon>
                                            <md-icon>{{tipe_konten[children.type]}}</md-icon>
                                            {{children.title}}
                                        </div>
                                    </md-list-item>
                                </md-list>
                            </md-list-item>
                        </md-list>
                    </div>
                </div>
                <div class="col-12 col-sm-9 col">
                    <div class="kelas-konten">
                        <loading :active.sync="isContentLoading" :is-full-page="fullPage" class="loader"></loading>
                        <h2>Title</h2>
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas quidem recusandae tenetur maxime temporibus, soluta magni corrupti, numquam veritatis non quaerat facere quo voluptates perspiciatis totam eius repudiandae quibusdam necessitatibus!</p>
                    </div>
                    <div class="navigasi-konten">
                        <md-button class="md-raised md-primary">
                            <md-icon>keyboard_arrow_left</md-icon>
                            Sebelumnya
                        </md-button>
                        <md-button class="md-raised md-primary">
                            Selanjutnya
                            <md-icon>keyboard_arrow_right</md-icon>
                        </md-button>
                    </div>
                </div>
            </div>
        </div>
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
            isContentLoading:false,
            fullPage:true,
            kelas:{},
            tipe_konten:{
                'konten_dokumen':'content_paste',
                'konten_video':'slow_motion_video',
                'exam':'create',
            },
            konten:[
                {
                    title:'Konten Kelas 1',
                    status:'waiting',
                    childs:[
                        {
                            title:'Sub 1 Konten Kelas 1',
                            type:'konten_video',
                            status:'finish'
                        },
                        {
                            title:'Sub 2 Konten Kelas 1',
                            type:'konten_video',
                            status:'finish'
                        },
                        {
                            title:'Sub 3 Konten Kelas 1',
                            type:'konten_dokumen',
                            status:'waiting'
                        },
                        {
                            title:'Mid Test Konten Kelas 1',
                            type:'exam'
                        }
                    ]
                },
                {
                    title:'Konten Kelas 2',
                    status:'waiting',
                    childs:[
                        {
                            title:'Sub 1 Konten Kelas 2',
                            type:'konten_video',
                            status:'waiting'
                        },
                        {
                            title:'Sub 2 Konten Kelas 2',
                            type:'konten_video',
                            status:'waiting'
                        },
                        {
                            title:'Sub 3 Konten Kelas 2',
                            type:'konten_dokumen',
                            status:'waiting'
                        },
                        {
                            title:'Mid Test Konten Kelas 2',
                            type:'exam'
                        }
                    ]
                },
                {
                    title:'Konten Kelas 3',
                    status:'waiting',
                    childs:[
                        {
                            title:'Sub 1 Konten Kelas 3',
                            type:'konten_video',
                            status:'waiting'
                        },
                        {
                            title:'Sub 2 Konten Kelas 3',
                            type:'konten_video',
                            status:'waiting'
                        },
                        {
                            title:'Sub 3 Konten Kelas 3',
                            type:'konten_dokumen',
                            status:'waiting'
                        },
                        {
                            title:'Mid Test Konten Kelas 3',
                            type:'exam'
                        }
                    ]
                }
            ]
        }
    },
    async created(){
        this.$store.dispatch('global/setHeader','kelas-saya')
        this.isLoading = true
        var id = this.$route.params.id
        var request = await this.$store.dispatch('kelas/fetchSingleKelas',id)
        if(request.status == 401)
            Swal.fire('Oops...', 'Authorized Content!', 'error')
        else
        {
            this.kelas = request.data
        }
        this.isLoading = false
        
    }
}
</script>