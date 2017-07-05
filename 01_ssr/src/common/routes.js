import Home from './screens/Home';
import Single from './screens/Single';
import Page from './screens/ExamplePage';

const routes = [
  {
    path: '/',
    component: Home,
    exact: true,
  },
  {
    path: '/(\d*)/(\d*)/:slug',
    component: Single,
    exact: true,
  },
  {
    path: '/:slug',
    component: Page,
    exact: true,
  },
];

export default routes;