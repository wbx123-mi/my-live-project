import { createRouter, createWebHistory } from 'vue-router';
import Layout from '../components/Layout.vue';
import Home from '../views/Home.vue';
import Practice from '../views/Practice.vue';
import Notes from '../views/Notes.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: Layout,
      // 1. 重定向：访问根路径时自动跳到 /home
      redirect: '/home',
      children: [
        {
          path: 'home',
          name: 'Home',
          component: Home,
        },
        {
          path: 'practice',
          name: 'Practice',
          component: Practice,
        },
        {
          path: 'notes',
          name: 'Notes',
          component: Notes,
        },
        {
          path: 'notes/:path+',
          name: 'NoteDetail',
          component: Notes,
          props: true,
        },
      ],
    },
  ],
});

export default router;
