import Vue from 'vue';
import Router from 'vue-router';
import Home from '@/components/Home';
import BarChart from '@/components/BarChart';
import Scatterplot from '@/components/Scatterplot';
import HeatMap from '@/components/HeatMap';
import ForceDirected from '@/components/ForceDirected';
import MapData from '@/components/MapData';
import NotFound from '@/components/NotFound';

Vue.use(Router);

const title = 'D3.js Showcase';

const router = new Router({
  mode: 'history',
  linkActiveClass: 'menu__item--active',
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
      meta: { title },
    }, {
      path: '/bar-chart',
      name: 'BarChart',
      component: BarChart,
      meta: { title: `D3 Bar Chart | ${title}` },
    }, {
      path: '/scatterplot',
      name: 'Scatterplot',
      component: Scatterplot,
      meta: { title: `D3 Scatterplot Graph | ${title}` },
    }, {
      path: '/heatmap',
      name: 'HeatMap',
      component: HeatMap,
      meta: { title: `D3 Heat Map | ${title}` },
    }, {
      path: '/force-directed',
      name: 'ForceDirected',
      component: ForceDirected,
      meta: { title: `D3 Force Directed Map | ${title}` },
    }, {
      path: '/map',
      name: 'MapData',
      component: MapData,
      meta: { title: `D3 Map Data | ${title}` },
    }, {
      path: '*',
      name: 'NotFound',
      component: NotFound,
      meta: { title: `Page Not Found | ${title}` },
    },
  ],
});

router.beforeEach((to, from, next) => {
  window.document.title = to.meta.title;
  next();
});

export default router;
