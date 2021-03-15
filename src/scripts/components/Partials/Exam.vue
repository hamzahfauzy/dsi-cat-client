<template>
    <div>
        <div v-if="session.hasOwnProperty('finished_at')&&session.finished_at" class="intro">
            <h3 align="center">Anda sudah melaksanakan {{session.jenis_exam==1?"Pre Test":"Post Test"}}</h3>
        </div>
        <div class="container-fluid" v-else>
            <div v-if="exam_content && exam">
                <div class="row">
                    <div class="col-12" style="margin-bottom:15px">
                        <md-button class="md-icon-button md-raised" v-for="(content,index) in exam_content" :key="index" @click="loadExam(index)" style="margin: 0px 10px 0px 0px;color:#000">
                            {{index+1}}
                        </md-button>
                        <br>
                    </div>
                </div>
                <div class="row">
                    <div class="col-12 col-sm-8">
                        <p v-html="exam.soal.soal"></p>
                    </div>
                    <div class="col-12 col-sm-4">
                        <div v-for="(jawaban,j) in exam.soal.refSoalPilihans" :key="j">
                            <label style="position:relative;width:100%;">
                                <input type="radio" class="option-input radio" v-model="answered[exam.id_exam]" :value="jawaban.id_soal_pilihan" style="z-index:2;" />
                                <span class="kode_soal_pilihan">{{numToSSColumn(jawaban.kode_soal_pilihan)}}</span>
                                <span class="soal_pilihan">{{jawaban.soal_pilihan}}</span>
                            </label>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-12">
                        <button class="btn btn-success" v-if="navigation.prev" @click="prev()"><md-icon>keyboard_arrow_left</md-icon> Sebelumnya</button>
                        <button class="btn btn-success" v-if="navigation.next" @click="next()">Selanjutnya <md-icon>keyboard_arrow_right</md-icon></button>
                        <button class="btn btn-primary" v-if="soal_aktif==exam_content.length-1" @click="selesai()">Selesai</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
import Swal from 'sweetalert2'
export default {
    data(){
        return {
            soal_aktif:0,
            exam:{},
            navigation:{
                next:1,
                prev:1
            },
            answered:{}
        }
    },
    created(){
        if(!(this.session.hasOwnProperty('finished_at') && this.session.finished_at))
            this.loadExam()
    },
    methods:{
        loadExam(idx = -1){
            this.soal_aktif = idx > -1 ? idx : this.soal_aktif
            this.exam = this.exam_content[this.soal_aktif]
            if(this.soal_aktif == this.exam_content.length-1)
                this.navigation.next = false
            else
                this.navigation.next = true
            if(this.soal_aktif == 0)
                this.navigation.prev = false
            else
                this.navigation.prev = true
        },
        next(){
            this.soal_aktif++
            this.loadExam()
        },
        prev(){
            this.soal_aktif--
            this.loadExam()
        },
        selesai(){
            var vm = this
            var formData = new FormData;
            formData.append('id_pelatihan',this.exam_content[0].id_pelatihan)
            formData.append('jenis_exam',this.exam_content[0].jenis_exam)
            for ( var key in this.answered ) {
                formData.append('jawaban['+key+']', this.answered[key]);
            }

            Swal.fire({
                title: 'Apakah anda yakin telah menyelesaikan Test ini ?',
                showCancelButton: true,
                confirmButtonText: `Yakin`,
                denyButtonText: `Batal`,
            }).then(async (result) => {
                if (result.isConfirmed) {
                    vm.$store.dispatch('cat/setLoading',true)
                    vm.$store.dispatch('kelas/setExamContent',[])
                    await vm.$store.dispatch('kelas/setSessionFinish',formData)
                    await vm.$store.dispatch('kelas/fetchSession',{id_pelatihan:session.id_pelatihan,jenis_exam:session.jenis_exam})
                    vm.$store.dispatch('cat/setLoading',false)
                }
            })
        },
        numToSSColumn(num){
            var s = '', t;

            while (num > 0) {
                t = (num - 1) % 26;
                s = String.fromCharCode(65 + t) + s;
                num = (num - t)/26 | 0;
            }
            return s || undefined;
        }
    },
    computed: {
        ...mapGetters({
            exam_content: 'kelas/getExamContent',
            session: 'kelas/getSession',
        })
    }
}
</script>