<template>
    <div>
        <history></history>
        <div v-if="session.hasOwnProperty('finished_at')&&session.finished_at&&(activeMateri.idx_konten==-1)" class="intro">
            <div style="text-align:center">
                <img src="dist/images/congrats.png" alt="" width="150px" style="margin-bottom:15px;">
                <p></p>
                <h3 style="font-size:18px;">Selamat, Kamu sudah melaksanakan <br>{{session.jenis_exam==1?"Pre Exam":"Post Exam"}} dengan ringkasan sebagai berikut:</h3>
                <div style="padding:20px;background-color:#FFF;color:#74b9ff!important;border-radius:1rem;margin-top:15px;">
                    <table align="center" cellpadding="10" style="font-weight:bold;">
                        <tr>
                            <td>Benar</td>
                            <td>Salah</td>
                            <td>Waktu</td>
                            <td>Nilai</td>
                        </tr>
                        <tr>
                            <td>{{session.hasil.benar}}</td>
                            <td>{{session.hasil.salah}}</td>
                            <td>{{session.waktu}}</td>
                            <td>{{session.hasil.skor}}</td>
                        </tr>
                    </table>
                </div>
                <p></p>
                <div>
                    <button class="btn btn-primary" v-if="session.jenis_exam==2" @click="showHistory(1)">Riwayat Test</button>
                    <button class="btn btn-primary" v-if="session.jenis_exam==2&&session.status_selesai == 0" @click="tryAgainExam(1)">Ulangi Test</button>
                    <a :href="app_link+'sertifikat/index.php?token='+token+'&id_pelatihan='+session.id_pelatihan" class="btn btn-success" style="color:#FFF;text-decoration:none" target="_blank" v-if="session.jenis_exam == 2 && session.status_selesai">Lihat Sertifikat</a>
                </div>
            </div>
        </div>
        <div class="container-fluid" v-else>
            <div v-if="exam_content && exam && exam.hasOwnProperty('soal')">
                <div class="row mb-2" v-if="exam.hasOwnProperty('jenis_exam')">
                    <div class="col-12 text-center">
                        <span class="badge badge-success" style="font-size:16px;" v-if="countDown >= 0">{{(new Date(countDown * 1000)).toUTCString().match(/(\d\d:\d\d:\d\d)/)[0]}}</span>
                        <span class="badge badge-success" style="font-size:16px;" v-if="ticker_time">{{ticker_time}}</span>
                    </div>
                </div>
                <div class="row">
                    <div class="col-12" style="margin-bottom:15px">
                        <md-button class="md-icon-button md-raised" v-for="(content,index) in exam_content" :key="index" @click="loadExam(index)" style="margin: 0px 10px 0px 0px;color:#000;z-index:2" :class="{'btn-nav-active':soal_aktif==index}">
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
            app_link:'',
            soal_aktif:0,
            exam:{},
            navigation:{
                next:1,
                prev:1
            },
            mytimeout:null,
            answered:{},
            ticker_time:0,
        }
    },
    created(){
        this.app_link = env.app_link
        if(!(this.session.hasOwnProperty('finished_at') && this.session.finished_at))
        {
            clearTimeout(this.mytimeout)
            this.loadExam()
            if(this.count_down > 0)
                this.countDownTimer()
            else
                this.ticker()
        }
    },
    methods:{
        countDownTimer() {
            if(this.count_down > 0) {
                this.mytimeout = setTimeout(() => {
                    this.count_down -= 1
                    this.countDownTimer()
                }, 1000)
            }
            if(this.count_down == 0)
                this.selesai(false)
        },
        ticker() {
            this.mytimeout = setTimeout(() => {
                this.ticker_time += 1
                this.ticker()
            }, 1000)
            
        },
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
        async selesai(useswal = true){
            var vm = this
            var id_pelatihan = this.exam_content[0].id_pelatihan
            var jenis_exam = this.exam_content[0].jenis_exam
            var formData = new FormData;
            formData.append('id_pelatihan',id_pelatihan)
            formData.append('jenis_exam',jenis_exam)
            for ( var key in this.answered ) {
                formData.append('jawaban['+key+']', this.answered[key]);
            }

            if(useswal)
            {
                Swal.fire({
                    title: 'Selesai Test',
                    text:'Apakah anda yakin telah menyelesaikan Test ini ?',
                    icon:'warning',
                    showCancelButton: true,
                    confirmButtonText: `Yakin`,
                    denyButtonText: `Batal`,
                }).then(async (result) => {
                    if (result.isConfirmed) {
                        clearTimeout(vm.mytimeout)
                        vm.$store.dispatch('cat/setLoading',true)
                        vm.$store.dispatch('kelas/setExamContent',[])
                        await vm.$store.dispatch('kelas/setSessionFinish',formData)
                        await vm.$store.dispatch('kelas/fetchSession',{id_pelatihan:id_pelatihan,jenis_exam:jenis_exam})
                        vm.$store.dispatch('kelas/fetchAllSession',id_pelatihan)
                        vm.$store.dispatch('cat/setLoading',false)
                    }
                })
            }
            else
            {
                this.count_down = -1
                vm.$store.dispatch('cat/setLoading',true)
                vm.$store.dispatch('kelas/setExamContent',[])
                await vm.$store.dispatch('kelas/setSessionFinish',formData)
                await vm.$store.dispatch('kelas/fetchSession',{id_pelatihan:id_pelatihan,jenis_exam:jenis_exam})
                vm.$store.dispatch('kelas/fetchAllSession',id_pelatihan)
                vm.$store.dispatch('cat/setLoading',false)
            }
            
        },
        numToSSColumn(num){
            var s = '', t;

            while (num > 0) {
                t = (num - 1) % 26;
                s = String.fromCharCode(65 + t) + s;
                num = (num - t)/26 | 0;
            }
            return s || undefined;
        },
        async tryAgainExam(jenis_exam){
            var vm = this

            clearTimeout(this.mytimeout)

            var id = this.$route.params.id

            var title = jenis_exam == 0 ? 'Pre Test' : 'Post Test';
            jenis_exam = jenis_exam+1

            Swal.fire({
                title: 'Mulai '+title,
                text: 'Klik mulai jika kamu sudah merasa siap untuk mengikuti '+title,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: `Mulai`,
                denyButtonText: `Batal`,
            }).then(async (result) => {
                if (result.isConfirmed)
                {
                    vm.$store.dispatch('cat/setLoading',true)
                    vm.$store.dispatch('kelas/setSessionNull',true)
                    var request = await vm.$store.dispatch('kelas/fetchTryExam',{id_pelatihan:id,jenis_exam:jenis_exam})
                    if(request.status == 200)
                    {
                        var durasi = request.data[0].durasi*60
                        vm.$store.dispatch('global/setCountDown',durasi)
                    }
                    vm.$store.dispatch('global/setExamIntro',{})
                    vm.$store.dispatch('cat/setLoading',false)
                }
            })
        },
        showHistory(){
            var id = this.$route.params.id
            this.$store.dispatch('dialog/setHistoryDialogStatus',true)
            this.$store.dispatch('kelas/fetchHistories',id)
        }
    },
    computed: {
        ...mapGetters({
            exam_content: 'kelas/getExamContent',
            activeMateri: 'cat/getActiveMateri',
            session: 'kelas/getSession',
            countDown: 'global/getCountDown',
            token: 'global/getToken',
        }),
        count_down:{
            get(){
                return this.countDown
            },
            set(value){
                this.$store.dispatch('global/setCountDown',value)
            }
        }
    }
}
</script>