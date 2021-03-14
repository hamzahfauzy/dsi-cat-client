import Login from './components/Login'
import LoginToken from './components/LoginToken'
import KelasSaya from './components/Dashboard/KelasSaya'
import Details from './components/Dashboard/Details'
import store from './store';

async function isNotAuthenticated(to, from, next){
    store.dispatch('dialog/setFullLoading',true)
    var data = await store.dispatch('global/fetchGeneralData')
    if(data.hasOwnProperty('token'))
        next()
    else
        next({'name':'Login'})
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
    }
]