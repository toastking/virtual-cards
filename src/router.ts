import Vue from 'vue';
import Router from 'vue-router';
import Game from './views/Game.vue';
import Home from './views/Home.vue';
import Lobby from './views/Lobby.vue';

Vue.use(Router);

const router = new Router({
  routes: [
    // Have a route to prefill the gameid
    { path: '/', redirect: { name: 'start' } },
    {
      path: '/start/:gameid?',
      name: 'start',
      component: Home,
      meta: { title: 'Zooted - Join or Create Game' },
    },
    // TODO: remove about route
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () =>
        import(/* webpackChunkName: "about" */ './views/About.vue'),
    },
    {
      path: '/lobby/:gameid',
      name: 'lobby',
      component: Lobby,
      meta: { title: 'Zooted - Lobby' },
    },
    {
      path: '/game/:gameid',
      name: 'game',
      component: Game,
      meta: { title: 'Zooted - Game' },
    },
  ],
});
// Set the title based on the route
router.beforeEach((to, _, next) => {
  document.title = to?.meta?.title ?? 'Zooted';
  next();
});
export default router;
