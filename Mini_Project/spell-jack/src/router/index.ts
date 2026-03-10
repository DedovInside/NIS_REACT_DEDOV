import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'game',
      component: () => import('../components/MainGame.vue'),
    },
    {
      path: '/shop',
      name: 'shop',
      component: () => import('../components/Shop.vue'),
    },
    {
      path: '/deck-editor',
      name: 'deck-editor',
      component: () => import('../components/DeckEditor.vue'),
    },
  ],
});

export default router;
