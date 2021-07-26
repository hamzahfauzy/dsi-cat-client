import axios from 'axios'
import Login from './components/Login'
import LoginToken from './components/LoginToken'
import KelasSaya from './components/Dashboard/KelasSaya'
import KontenSaya from './components/Dashboard/KontenSaya'
import Details from './components/Dashboard/Details'
import ForumDiskusi from './components/Dashboard/ForumDiskusi'
import KelasVirtual from './components/Dashboard/KelasVirtual'
import store from './store';

async function isNotAuthenticated(to, from, next){
    axios.CancelToken.source().cancel('Operation canceled by the user.');
    store.dispatch('dialog/setFullLoading',true)
    var data = await store.dispatch('global/fetchGeneralData')
    if(data.hasOwnProperty('token'))
        next()
    else
        next({'name':'Login'})
    store.dispatch('kelas/setSessionNull')
    store.dispatch('kelas/setSingleKelas',{})
    store.dispatch('dialog/setFullLoading',false)
}

export default [
    {
        name:'Login',
        path: '/', 
        component: Login,
        meta: {
            title: 'Login - FPKAD'
        },
        async beforeEnter(to, from, next) {
            var data = await store.dispatch('global/fetchGeneralData')
            if(data.hasOwnProperty('token'))
                next({'name':'KelasSaya'})
            else
                next()
        }
    },
    {
        name:'LoginToken',
        path: '/login-by-token/:token', 
        component: LoginToken,
        meta: {
            title: 'Login'
        },
    },
    {
        name:'KelasSaya',
        path: '/kelas-saya',
        component:KelasSaya,
        meta: {
            title: 'Kelas Saya - FPKAD'
        },
        beforeEnter: isNotAuthenticated
    },
    {
        name:'Details',
        path: '/details/:id',
        component:Details,
        meta: {
            title: 'CAT - FPKAD'
        },
        beforeEnter: isNotAuthenticated
    },
    {
        name:'Konten Saya',
        path: '/konten-saya/:id',
        component:KontenSaya,
        meta: {
            title: 'CAT - FPKAD'
        },
        beforeEnter: isNotAuthenticated
    },
    {
        name:'ForumDiskusi',
        path: '/forum-diskusi/:id',
        component:ForumDiskusi,
        meta: {
            title: 'CAT - FPKAD'
        },
        beforeEnter: isNotAuthenticated
    },
    {
        name:'KelasVirtual',
        path: '/kelas-virtual/:id',
        component:KelasVirtual,
        meta: {
            title: 'CAT - FPKAD'
        },
        beforeEnter: isNotAuthenticated
    }
]