import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const router = new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [{
        path: '/',
        name: 'chat',
        component: () =>
            import ('./views/Chat')
    }, ]
})

router.beforeEach((to, from, next) => {
    console.log(to.path);
    console.log(from);
    next();
});

export default router;