import React from 'react';
import { render } from 'react-dom';
import {
  BrowserRouter as Router
} from 'react-router-dom';

import App from '../common/App';
import routes from '../common/routes';

const router = (
  <Router>
    <App routes={routes} initialData={window.DATA} />
  </Router>
);

// Render it to DOM
render(router, document.getElementById('root'));

if (module.hot) {
  module.hot.accept();
}