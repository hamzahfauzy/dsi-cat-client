<template>
    <div v-if="exam_content && exam">
        <div class="container-fluid">
            <div class="row">
                <div class="col-12 col-sm-8">
                    <p v-html="exam.soal.soal"></p>
                </div>
                <div class="col-12 col-sm-4">
                    <div v-for="(jawaban,j) in exam.soal.refSoalPilihans" :key="j">
                        <label>
                            <input type="radio" class="option-input radio" v-model="answered[exam.id_exam]" :value="jawaban.id_soal_pilihan" />
                            {{jawaban.soal_pilihan}}
                        </label>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-12">
                    <center>
                    <button class="btn btn-success" v-if="navigation.prev" @click="prev()">Sebelumnya</button>
                    <button class="btn btn-success" v-if="navigation.next" @click="next()">Selanjutnya</button>
                    <button class="btn btn-primary" v-if="soal_aktif==exam_content.length-1" @click="selesai()">Selesai</button>
                    </center>
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
        this.loadExam()
    },
    methods:{
        loadExam(){
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
                    await vm.$store.dispatch('kelas/setSessionFinish',formData)
                }
            })
        }
    },
    computed: {
        ...mapGetters({
            exam_content: 'kelas/getExamContent',
        })
    }
}
</script>